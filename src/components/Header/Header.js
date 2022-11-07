import React, { Component } from 'react';
import '../../css/header.css';

class Header extends Component {
    render() {

        const { player_name, metris_amount, metris_per_second_value } = this.props;

        return (
            <div className='header'>
                <h1 className='header__welcome' >你好，{player_name}，来攒点功德吧！</h1>
                <h2 className='header__metrissCount'>{parseInt(metris_amount, 10).toLocaleString()} 功德</h2>
                <h4 className='header__perSecond'>{parseFloat(metris_per_second_value, 10).toFixed(1)} 每秒</h4>
            </div>
        );
    }
}

export default Header;