import _PRODUCTS from '../constants/products';
import _ACHIEVEMENTS from '../constants/achievements';

const STORAGE_KEY = 'metrisClicker';
const SAVE_VERSION = 1;
const LEGACY_BASE64_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const migrations = [
  // Version 0 was the original JSON save without a version field.
  (savedSettings) => ({ ...savedSettings, saveVersion: 1 })
];
const PRODUCT_NAMES = _PRODUCTS.map((product) => product.name);
const ACHIEVEMENT_BONUS_PER_ITEM = 0.001;
const ACHIEVEMENT_NAMES = _ACHIEVEMENTS.map((achievement) => achievement.name);

const cloneSettings = (settings) => JSON.parse(JSON.stringify(settings));

const decodeLegacySave = (value) => {
  let result = '';
  let i = 0;

  do {
    const b1 = LEGACY_BASE64_CHARACTERS.indexOf(value.charAt(i++));
    const b2 = LEGACY_BASE64_CHARACTERS.indexOf(value.charAt(i++));
    const b3 = LEGACY_BASE64_CHARACTERS.indexOf(value.charAt(i++));
    const b4 = LEGACY_BASE64_CHARACTERS.indexOf(value.charAt(i++));

    const a = ((b1 & 0x3F) << 2) | ((b2 >> 4) & 0x3);
    const b = ((b2 & 0xF) << 4) | ((b3 >> 2) & 0xF);
    const c = ((b3 & 0x3) << 6) | (b4 & 0x3F);

    result += String.fromCharCode(a) +
      (b ? String.fromCharCode(b) : '') +
      (c ? String.fromCharCode(c) : '');
  } while (i < value.length);

  return result;
};

const migrateSettings = (savedSettings) => {
  const rawVersion = Number(savedSettings.saveVersion) || 0;
  if (rawVersion < 0 || rawVersion > SAVE_VERSION) return null;

  let migratedSettings = savedSettings;
  for (let version = rawVersion; version < SAVE_VERSION; version++) {
    migratedSettings = migrations[version](migratedSettings);
  }

  return migratedSettings;
};

const isPlainObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const sanitizeItems = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => isPlainObject(item) && PRODUCT_NAMES.includes(item.name))
    .map((item) => ({
      name: item.name,
      count: Number.isInteger(item.count) && item.count > 0 ? item.count : 0
    }))
    .filter((item) => item.count > 0);
};

const sanitizeProducts = (value, defaultProducts) => {
  if (!Array.isArray(value)) return cloneSettings(defaultProducts);

  return defaultProducts.map((defaultProduct) => {
    const savedProduct = value.find((product) => {
      return isPlainObject(product) && product.name === defaultProduct.name;
    });

    if (!savedProduct) return defaultProduct;

    const savedPrice = Number(savedProduct.start_price);
    return {
      ...defaultProduct,
      start_price: Number.isFinite(savedPrice) && savedPrice >= defaultProduct.start_price
        ? savedPrice
        : defaultProduct.start_price
    };
  });
};

const sanitizeAchievements = (value) => {
  if (!Array.isArray(value)) return [];

  const names = new Set();

  return value
    .filter((achievement) => {
      return isPlainObject(achievement) && ACHIEVEMENT_NAMES.includes(achievement.name);
    })
    .map((achievement) => ({ name: achievement.name }))
    .filter((achievement) => {
      if (names.has(achievement.name)) return false;
      names.add(achievement.name);
      return true;
    });
};

export const loadSettings = (defaultSettings, storage = window.localStorage) => {
  const settings = cloneSettings(defaultSettings);
  const savedValue = storage.getItem(STORAGE_KEY);

  if (!savedValue) return settings;

  try {
    let savedSettings;

    try {
      savedSettings = JSON.parse(savedValue);
    } catch (error) {
      savedSettings = JSON.parse(decodeLegacySave(savedValue));
    }

    if (!isPlainObject(savedSettings)) return settings;

    savedSettings = migrateSettings(savedSettings);
    if (!savedSettings) return settings;

    Object.keys(settings).forEach((key) => {
      const defaultValue = settings[key];
      const savedFieldValue = savedSettings[key];

      if (key === 'items') {
        settings[key] = sanitizeItems(savedFieldValue);
      } else if (key === 'products') {
        settings[key] = sanitizeProducts(savedFieldValue, _PRODUCTS);
      } else if (key === 'achievements') {
        settings[key] = sanitizeAchievements(savedFieldValue);
      } else if (typeof defaultValue === 'number') {
        settings[key] = Number.isFinite(savedFieldValue)
          ? savedFieldValue
          : defaultValue;
      } else if (typeof defaultValue === 'boolean') {
        settings[key] = typeof savedFieldValue === 'boolean'
          ? savedFieldValue
          : defaultValue;
      } else if (typeof defaultValue === 'string') {
        settings[key] = typeof savedFieldValue === 'string'
          ? savedFieldValue
          : defaultValue;
      }
    });

    settings.notification_top_show = false;
    settings.notification_left_show = false;
    settings.notification_top_text = '';
    settings.notification_left_text = '';
    settings.metris_gold_time_active = false;

    return settings;
  } catch (error) {
    return settings;
  }
};

export const saveSettings = (state, storage = window.localStorage) => {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // localStorage can be unavailable in private browsing or when full.
  }
};

export const getAchievementBonus = (achievementCount) => {
  return Math.max(achievementCount, 0) * ACHIEVEMENT_BONUS_PER_ITEM;
};

export const getAchievementMultiplier = (achievementCount) => {
  return 1 + getAchievementBonus(achievementCount);
};

export const getProductValue = (product, achievementCount) => {
  return product.value * getAchievementMultiplier(achievementCount);
};

export const calculatePerSecond = (items, achievementCount) => {
  const multiplier = getAchievementMultiplier(achievementCount);

  return items.reduce((perSecond, element) => {
    const product = _PRODUCTS.find((product) => product.name === element.name);
    return product ? perSecond + element.count * product.value * multiplier : perSecond;
  }, 0);
};

export const buyItem = (item, price, items, achievementCount = 0) => {
  const updatePerSecond = (addItems) => calculatePerSecond(addItems, achievementCount);

  let itemExists = false;
  const data = items.map((element) => {
    if (element.name !== item) return element;

    itemExists = true;
    return { ...element, count: element.count + 1 };
  });

  if (!itemExists) {
    data.push({ name: item, count: 1 });
  }

  return {
    item: data,
    price: price,
    per_sec_multi: updatePerSecond(data)
  };
};

export const chanceCalculation = (chance) => Math.random() <= chance;

export const levelCalculation = (cookies) => {
  if (cookies >= 10) {
    const calc = -(((cookies - 10) / 10 * -1) - 1);
    return parseInt(Math.log2(calc), 10) + 1;
  }

  return 0;
};

export const achievementsChecker = (achievements) => {
  const ownedNames = new Set(achievements.map((achievement) => achievement.name));

  return _ACHIEVEMENTS.filter((achievement) => !ownedNames.has(achievement.name));
};
