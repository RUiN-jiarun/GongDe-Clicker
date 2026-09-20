import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Achievements from './Achievements';
import _ACHIEVEMENTS from '../../constants/achievements';

const achievements = [{ name: '忏悔之路' }];

const renderAchievements = (show = false, onClose = jest.fn()) => {
  const view = render(
    <Achievements
      achievements={achievements}
      show={show}
      onOpen={jest.fn()}
      onClose={onClose}
    />
  );

  return { ...view, onClose };
};

describe('Achievements window', () => {
  it('shows the floating window only when open', () => {
    const { rerender } = renderAchievements(false);

    expect(screen.queryByRole('dialog')).toBeNull();

    rerender(
      <Achievements
        achievements={achievements}
        productionBonus={0.001}
        show
        onOpen={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: `成就 1/${_ACHIEVEMENTS.length}` })
    ).toBeTruthy();
  });

  it('calls onClose from the close button', () => {
    const { onClose } = renderAchievements(true);
    fireEvent.click(screen.getByRole('button', { name: '关闭成就窗口' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
it('keeps tooltips independent of clipped grid cells', () => {
  const allAchievements = _ACHIEVEMENTS.map(achievement => ({
    name: achievement.name
  }));

  render(
    <Achievements
      achievements={allAchievements}
      show
      onOpen={jest.fn()}
      onClose={jest.fn()}
    />
  );

  const tooltip = screen.getByRole('tooltip', {
    name: `${_ACHIEVEMENTS[0].name} ${_ACHIEVEMENTS[0].description}`
  });

  expect(tooltip).toBeTruthy();
  expect(tooltip.className).toContain('achievements__item__information');
  expect(tooltip.getAttribute('role')).toBe('tooltip');
});


it('shows the current achievement production bonus', () => {
  render(
    <Achievements
      achievements={achievements}
      productionBonus={0.012}
      show
      onOpen={jest.fn()}
      onClose={jest.fn()}
    />
  );

  expect(screen.getByText('当前加成：+1.2%')).toBeTruthy();
});


it('renders tiered achievement frames', () => {
  const allAchievements = _ACHIEVEMENTS.map(achievement => ({
    name: achievement.name
  }));

  const { container } = render(
    <Achievements
      achievements={allAchievements}
      show
      onOpen={jest.fn()}
      onClose={jest.fn()}
    />
  );

  expect(container.querySelector('.achievements__item--bronze')).toBeTruthy();
  expect(container.querySelector('.achievements__item--silver')).toBeTruthy();
  expect(container.querySelector('.achievements__item--gold')).toBeTruthy();
  expect(container.querySelector('.achievements__item--purple')).toBeTruthy();
});

it('marks newly unlocked achievements for the unlock animation', () => {
  render(
    <Achievements
      achievements={[{ name: _ACHIEVEMENTS[0].name }]}
      recentAchievements={[_ACHIEVEMENTS[0].name]}
      show
      onOpen={jest.fn()}
      onClose={jest.fn()}
    />
  );

  const item = screen.getByRole('tooltip').parentElement;
  expect(item.className).toContain('achievements__item--newlyUnlocked');
});
