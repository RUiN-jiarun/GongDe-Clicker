import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import '../../css/clickBoard.css';
import clickSound from '../../sounds/click.mp3';

library.add(Icons.faGavel);

const STICK_ORBIT_RINGS = [
  { radius: 95, capacity: 12 },
  { radius: 130, capacity: 20 },
  { radius: 165, capacity: 28 },
  { radius: 200, capacity: 40 }
];

const getStickPositions = (count) => {
  const positions = [];
  let remaining = count;

  STICK_ORBIT_RINGS.forEach((ring, ringIndex) => {
    if (remaining <= 0) return;

    const ringCount = Math.min(remaining, ring.capacity);
    const startAngle = ringIndex * (Math.PI / ringCount);

    for (let i = 0; i < ringCount; i++) {
      const angle = startAngle + (i / ringCount) * Math.PI * 2;
      positions.push({
        x: Math.cos(angle) * ring.radius,
        y: Math.sin(angle) * ring.radius,
        angle: (angle * 180) / Math.PI
      });
    }

    remaining -= ringCount;
  });

  return positions;
};

const EFFECT_DURATION = 1000;
const MAX_EFFECTS = 12;
const PARTICLES_PER_CLICK = 10;

class ClickBoard extends Component {
  constructor(props) {
    super(props);

    this.state = { effects: [] };
    this.clickAudio = new Audio(clickSound);
    this.effectId = 0;
    this.effectTimeouts = [];
    this.muyuRef = React.createRef();
  }

  componentWillUnmount() {
    this.effectTimeouts.forEach(clearTimeout);
  }

  playClickSound = () => {
    try {
      this.clickAudio.currentTime = 0;
      const playPromise = this.clickAudio.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Sound is optional; browser autoplay policies may prevent it.
        });
      }
    } catch (error) {
      // Ignore audio construction or playback failures.
    }
  };

  spawnEffects = (event, clickResult) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX ? event.clientX - rect.left : rect.width / 2;
    const y = event.clientY ? event.clientY - rect.top : rect.height / 2;
    const id = ++this.effectId;

    const particles = Array.from({ length: PARTICLES_PER_CLICK }, (_, index) => ({
      id: `${id}-${index}`,
      dx: (Math.random() * 2 - 1) * 90,
      dy: -40 - Math.random() * 100,
      delay: Math.random() * 80
    }));

    const effect = {
      id,
      x,
      y,
      value: clickResult.gained,
      gold: clickResult.goldClick
    };

    this.setState(prevState => ({
      effects: [...prevState.effects, { ...effect, particles }].slice(-MAX_EFFECTS)
    }));

    this.effectTimeouts.push(setTimeout(() => {
      this.setState(prevState => ({
        effects: prevState.effects.filter(item => item.id !== id)
      }));
    }, EFFECT_DURATION));
  };

  restartSquashAnimation = () => {
    const muyu = this.muyuRef.current;
    if (!muyu) return;

    muyu.classList.remove('clickBoard__muyu--pressed');
    void muyu.offsetWidth;
    muyu.classList.add('clickBoard__muyu--pressed');
  };

  clickHandler = (event) => {
    this.playClickSound();
    this.restartSquashAnimation();

    const clickResult = this.props.onClick(undefined, true, event);
    if (clickResult) {
      this.spawnEffects(event, clickResult);
    }
  };

  keyDownHandler = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    this.clickHandler(event);
  };

  render() {
    const { effects } = this.state;
    const { stickCount = 0, goldTimeActive = false } = this.props;
    const sticks = getStickPositions(Math.min(stickCount, 100));

    return (
      <div
        className={
          goldTimeActive
            ? 'clickBoard clickBoard--goldTime'
            : 'clickBoard'
        }
      >
        <div className='clickBoard__background' aria-hidden='true'>
          <span className='clickBoard__backgroundSky' />
          <span className='clickBoard__backgroundGlow' />
          <span className='clickBoard__backgroundMountainFar' />
          <span className='clickBoard__backgroundMountainNear' />
          <span className='clickBoard__backgroundGround' />
          <span className='clickBoard__backgroundCloud clickBoard__backgroundCloud--one' />
          <span className='clickBoard__backgroundCloud clickBoard__backgroundCloud--two' />
        </div>

        <div className='clickBoard__stickOrbit' aria-hidden='true'>
          {sticks.map((stick, index) => (
            <span
              key={index}
              className='clickBoard__stick'
              style={{
                transform: `translate(calc(-50% + ${stick.x}px), calc(-50% + ${stick.y}px)) rotate(${stick.angle}deg)`
              }}
            >
              <FontAwesomeIcon icon='gavel' />
            </span>
          ))}
        </div>

        <div
          ref={this.muyuRef}
          className='clickBoard__muyu'
          onClick={this.clickHandler}
          onKeyDown={this.keyDownHandler}
          role='button'
          tabIndex={0}
          aria-label='敲木鱼积功德'
        >
          {effects.map(effect => (
            <React.Fragment key={effect.id}>
              <span
                className={
                  effect.gold
                    ? 'clickBoard__shockwave clickBoard__shockwave--gold'
                    : 'clickBoard__shockwave'
                }
                style={{ left: `${effect.x}px`, top: `${effect.y}px` }}
              />

              <span
                className={
                  effect.gold
                    ? 'clickBoard__gain clickBoard__gain--gold'
                    : 'clickBoard__gain'
                }
                style={{ left: `${effect.x}px`, top: `${effect.y}px` }}
              >
                +{effect.value.toLocaleString()}
              </span>

              {effect.particles.map(particle => (
                <span
                  key={particle.id}
                  className={
                    effect.gold
                      ? 'clickBoard__particle clickBoard__particle--gold'
                      : 'clickBoard__particle'
                  }
                  style={{
                    left: `${effect.x}px`,
                    top: `${effect.y}px`,
                    '--dx': `${particle.dx}px`,
                    '--dy': `${particle.dy}px`,
                    animationDelay: `${particle.delay}ms`
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
}

export default ClickBoard;
