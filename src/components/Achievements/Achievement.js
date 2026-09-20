import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

const Achievement = ({ disabled, options }) => {
  const { name, icon, icon_var, description, value } = options;

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
      className='achievements__item'
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
