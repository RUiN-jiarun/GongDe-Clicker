import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

const getAchievementTier = (type) => {
  if (type === 'metris_player_click_counter' || type === 'metris_player_click_frequency') {
    return 'bronze';
  }

  if (type === 'metris_amount') {
    return 'silver';
  }

  if (
    type === 'metris_gold_click_counter' ||
    type === 'metris_gold_time_counter'
  ) {
    return 'gold';
  }

  return 'purple';
};

const Achievement = ({ disabled, options, isNewlyUnlocked = false }) => {
  const { name, icon, icon_var, description, value, type } = options;
  const tier = getAchievementTier(type);

  library.add(Icons[icon_var]);

  if (disabled) {
    return (
      <div className='achievements__item achievements__item--disabled'>
        <span className='achievements__item__locked'>???</span>
      </div>
    );
  }

  const tooltipId = `achievement-tooltip-${name}`;

  return (
    <div
      className={`achievements__item achievements__item--${tier}${
        isNewlyUnlocked ? ' achievements__item--newlyUnlocked' : ''
      }`}
      aria-describedby={tooltipId}
    >
      <div className='achievements__item__value'>
        <FontAwesomeIcon className='achievements__item__image__icon' icon={icon} />
        <p>{value}</p>
      </div>

      <span
        id={tooltipId}
        className='achievements__item__information'
        role='tooltip'
      >
        <FontAwesomeIcon
          className='achievements__item__information__image__icon'
          icon={icon}
        />
        <h3>{name}</h3>
        <p>{description}</p>
      </span>
    </div>
  );
};

export default Achievement;
