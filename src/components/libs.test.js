import {
  buyItem,
  calculatePerSecond,
  getAchievementBonus,
  getAchievementMultiplier,
  loadSettings,
  saveSettings
} from './libs';
import _SETTINGS from '../constants/settings';

const createStorage = () => {
  const values = new Map();

  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  };
};

describe('game settings storage', () => {
  it('returns default settings when storage is empty', () => {
    const storage = createStorage();
    const settings = loadSettings(_SETTINGS, storage);

    expect(settings.metris_amount).toBe(0);
    expect(settings.items).toEqual([]);
    expect(settings.achievements).toEqual([]);
  });

  it('saves and restores valid progress', () => {
    const storage = createStorage();
    const settings = {
      ..._SETTINGS,
      metris_amount: 123,
      items: [{ name: '槌子', count: 2 }],
      achievements: [{ name: '忏悔之路' }]
    };

    saveSettings(settings, storage);
    const restored = loadSettings(_SETTINGS, storage);

    expect(restored.metris_amount).toBe(123);
    expect(restored.items).toEqual([{ name: '槌子', count: 2 }]);
    expect(restored.achievements).toEqual([{ name: '忏悔之路' }]);
  });

  it('rejects corrupted saved data', () => {
    const storage = createStorage();
    storage.setItem('metrisClicker', '{invalid json');
    const settings = loadSettings(_SETTINGS, storage);

    expect(settings).toEqual(_SETTINGS);
  });
});

describe('buyItem', () => {
  it('adds a new product and calculates production', () => {
    const result = buyItem('槌子', 10, []);

    expect(result.item).toEqual([{ name: '槌子', count: 1 }]);
    expect(result.price).toBe(10);
    expect(result.per_sec_multi).toBe(1);
  });

  it('increments an existing product without mutating the input', () => {
    const items = [{ name: '槌子', count: 1 }];
    const result = buyItem('槌子', 11, items);

    expect(items).toEqual([{ name: '槌子', count: 1 }]);
    expect(result.item).toEqual([{ name: '槌子', count: 2 }]);
    expect(result.per_sec_multi).toBe(2);
  });
});

describe('save migrations', () => {
  it('migrates an unversioned JSON save to the current version', () => {
    const storage = createStorage();
    storage.setItem('metrisClicker', JSON.stringify({
      metris_amount: 77,
      metris_player_click_counter: 9,
      achievements: []
    }));

    const restored = loadSettings(_SETTINGS, storage);

    expect(restored.saveVersion).toBe(1);
    expect(restored.metris_amount).toBe(77);
    expect(restored.metris_player_click_counter).toBe(9);
  });

  it('ignores saves from a newer game version', () => {
    const storage = createStorage();
    storage.setItem('metrisClicker', JSON.stringify({
      saveVersion: 99,
      metris_amount: 999999
    }));

    const restored = loadSettings(_SETTINGS, storage);

    expect(restored.saveVersion).toBe(1);
    expect(restored.metris_amount).toBe(0);
  });
});

it('migrates the original base64 save format', () => {
  const storage = createStorage();
  storage.setItem('metrisClicker', 'eyJtZXRyaXNfYW1vdW50Ijo0Mn0=');

  const restored = loadSettings(_SETTINGS, storage);

  expect(restored.saveVersion).toBe(1);
  expect(restored.metris_amount).toBe(42);
});

describe('achievement production bonus', () => {
  it('increases production by 0.1% per achievement', () => {
    const items = [{ name: '槌子', count: 10 }];

    expect(calculatePerSecond(items, 0)).toBe(10);
    expect(calculatePerSecond(items, 1)).toBeCloseTo(10.01, 10);
    expect(calculatePerSecond(items, 10)).toBeCloseTo(10.1, 10);
    expect(getAchievementBonus(10)).toBe(0.01);
    expect(getAchievementMultiplier(10)).toBe(1.01);
  });

  it('applies the achievement bonus when buying an item', () => {
    const result = buyItem('槌子', 15, [{ name: '槌子', count: 1 }], 10);

    expect(result.per_sec_multi).toBeCloseTo(2.02, 10);
  });
});
