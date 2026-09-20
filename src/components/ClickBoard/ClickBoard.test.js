import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ClickBoard from './ClickBoard';

describe('ClickBoard effects', () => {
  beforeEach(() => {
    window.Audio = jest.fn().mockImplementation(() => ({
      currentTime: 0,
      play: jest.fn()
    }));
  });

  it('spawns a floating gain when the muyu is clicked', () => {
    const onClick = jest.fn(() => ({
      gained: 7,
      goldClick: false,
      goldTime: false
    }));

    render(<ClickBoard onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: '敲木鱼积功德' }));

    expect(onClick).toHaveBeenCalled();
    expect(screen.getByText('+7')).toBeTruthy();
  });

  it('marks gold click effects differently', () => {
    const onClick = jest.fn(() => ({
      gained: 1000,
      goldClick: true,
      goldTime: false
    }));

    render(<ClickBoard onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: '敲木鱼积功德' }));

    expect(screen.getByText('+1,000')).toBeTruthy();
  });
});


describe('ClickBoard hammer orbit', () => {
  beforeEach(() => {
    window.Audio = jest.fn().mockImplementation(() => ({
      currentTime: 0,
      play: jest.fn()
    }));
  });

  it('renders one hammer for each purchased stick', () => {
    const { container } = render(
      <ClickBoard onClick={jest.fn()} stickCount={3} />
    );

    const hammers = container.querySelectorAll('.clickBoard__stick');
    expect(hammers).toHaveLength(3);
  });

  it('renders no hammers before the first purchase', () => {
    const { container } = render(
      <ClickBoard onClick={jest.fn()} stickCount={0} />
    );

    expect(container.querySelector('.clickBoard__stick')).toBeNull();
  });
});


describe('ClickBoard art upgrades', () => {
  beforeEach(() => {
    window.Audio = jest.fn().mockImplementation(() => ({
      currentTime: 0,
      play: jest.fn()
    }));
  });

  it('renders the layered background', () => {
    const { container } = render(<ClickBoard onClick={jest.fn()} />);

    expect(container.querySelector('.clickBoard__background')).toBeTruthy();
    expect(container.querySelector('.clickBoard__backgroundSky')).toBeTruthy();
    expect(container.querySelector('.clickBoard__backgroundMountainFar')).toBeTruthy();
    expect(container.querySelector('.clickBoard__backgroundMountainNear')).toBeTruthy();
  });

  it('spawns a shockwave on click', () => {
    const { container } = render(
      <ClickBoard
        onClick={jest.fn(() => ({ gained: 1, goldClick: false, goldTime: false }))}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '敲木鱼积功德' }));

    expect(container.querySelector('.clickBoard__shockwave')).toBeTruthy();
  });

  it('marks the board during gold time', () => {
    const { container } = render(
      <ClickBoard onClick={jest.fn()} goldTimeActive />
    );

    expect(container.querySelector('.clickBoard').className).toContain(
      'clickBoard--goldTime'
    );
  });
});
