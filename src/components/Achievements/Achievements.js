import React, { Component } from 'react';
import Achievement from './Achievement';
import _ACHIEVEMENTS from '../../constants/achievements';
import '../../css/achievements.css';

class Achievements extends Component {
  render() {
    const {
      achievements,
      productionBonus = 0,
      recentAchievements = [],
      show,
      onOpen,
      onClose
    } = this.props;
    const earnedNames = new Set(achievements.map(achievement => achievement.name));

    const achievementItems = _ACHIEVEMENTS.map(achievement => (
      <Achievement
        key={achievement.name}
        disabled={!earnedNames.has(achievement.name)}
        isNewlyUnlocked={recentAchievements.includes(achievement.name)}
        options={achievement}
      />
    ));

    return (
      <div className='achievements'>
        <button
          className='achievements__toggle'
          onClick={onOpen}
          aria-expanded={show}
          aria-haspopup='dialog'
        >
          成就 <span>{earnedNames.size}/{_ACHIEVEMENTS.length}</span>
        </button>

        {show && (
          <section
            className='achievements__window'
            role='dialog'
            aria-modal='false'
            aria-labelledby='achievements-window-title'
          >
            <header className='achievements__header'>
              <h1
                className='achievements__header__element'
                id='achievements-window-title'
              >
                成就
              </h1>

              <div className='achievements__bonus'>
                当前加成：+{(productionBonus * 100).toFixed(1)}%
              </div>

              <button
                className='achievements__close'
                onClick={onClose}
                aria-label='关闭成就窗口'
              >
                ×
              </button>
            </header>

            <div className='achievements__container'>
              {achievementItems}
            </div>
          </section>
        )}
      </div>
    );
  }
}

export default Achievements;
