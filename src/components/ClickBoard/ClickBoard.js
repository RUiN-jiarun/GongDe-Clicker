import React, { Component } from 'react';
import '../../css/clickBoard.css';
import clickSound from '../../sounds/click.mp3';

class ClickBoard extends Component {

    constructor(props) {
        super(props);
        this.clickAudio = new Audio(clickSound);
    }

    clickHandler = () => {
        try {
            this.clickAudio.currentTime = 0;
            const playPromise = this.clickAudio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    // play may be prevented by browser autoplay policies in some cases
                    // swallow the error - sound is optional
                });
            }
        } catch (e) {
            // ignore audio errors
        }

        this.props.onClick();
    }

    render() {
        return (
            <div className='clickBoard'>
                <div className='clickBoard__muyu' onClick={this.clickHandler}></div>
            </div>
        );
    }
}

export default ClickBoard;