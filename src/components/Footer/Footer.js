import React, { Component } from 'react';
import '../../css/footer.css';

class Footer extends Component {

    onClickHandler = () => {
        this.props.onClick();
    }

    render() {
        return (
            <div className="footer">
                &copy; 2022 RUiN

                <span onClick={this.onClickHandler} className="footer__reset">重置游戏</span>
            </div>
        );
    }
}

export default Footer;