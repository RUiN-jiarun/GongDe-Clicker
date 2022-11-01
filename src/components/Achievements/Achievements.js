import React, { Component } from 'react';
import Achievement from './Achievement';
import _ACHIEVEMENTS from '../../constants/achievements';
import '../../css/achievements.css';

class Achievements extends Component {
    
    render() {

        const { achievements } = this.props;

        const achievements_container = _ACHIEVEMENTS.map((element, key) => {

            const earn_achiev = achievements.filter(achiev => {return element.name === achiev.name});

            if(earn_achiev.length !== 0){
                return <Achievement   
                    options={element} 
                    key={key}
                />
            }else{
                return <Achievement
                    disabled   
                    options={element} 
                    key={key}
                />
            }
        })

        return (
            <div className='achievements'>
                <div className='achievements__header'>
                    <h1 className='achievements__header__element'>成就:</h1>
                </div>

                <div className='achievements__container'>
                    {achievements_container}
                </div>
            </div>
        );
    }
}

export default Achievements;