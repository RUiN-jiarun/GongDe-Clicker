import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import * as Icons from '@fortawesome/free-solid-svg-icons'
library.add(Icons['faHandsPraying'])


const TOOLTIP_WIDTH = 300;
const TOOLTIP_GAP = 12;

class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipPosition: null
        };
    }

    onClickHandler = () => {
        if(!this.props.disabled)
            this.props.onClick(this.props.options.name, this.props.options.start_price);
    }

    mouseEnterHandler = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const preferredLeft = rect.left - TOOLTIP_WIDTH - TOOLTIP_GAP;
        const left = Math.max(preferredLeft, 10);
        const top = Math.min(
            Math.max(rect.top + rect.height / 2, 65),
            Math.max(window.innerHeight - 65, 65)
        );

        this.setState({ tooltipPosition: { left, top } });
    }

    mouseLeaveHandler = () => {
        this.setState({ tooltipPosition: null });
    }


    render() {

        const { name, start_price, value, icon, icon_var, description } = this.props.options;
        const { disabled, amount, achievementMultiplier = 1 } = this.props;
        const effectiveValue = value * achievementMultiplier;
        const tooltipId = `shop-tooltip-${name}`;

        library.add(Icons[icon_var]);

        return (
            <div
                aria-describedby={tooltipId}
                onClick={this.onClickHandler}
                onMouseEnter={this.mouseEnterHandler}
                onMouseLeave={this.mouseLeaveHandler}
                className={
                    !disabled ? 
                    'shop__product': 
                    'shop__product shop__product--disabled'
                }>

                <span
                    id={tooltipId}
                    className={`shop__product__information${this.state.tooltipPosition ? ' shop__product__information--visible' : ''}`}
                    role="tooltip"
                    style={this.state.tooltipPosition || undefined}
                >
                    <FontAwesomeIcon className='shop__product__information__image__icon' icon={icon} />
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <strong>当前每秒：+{effectiveValue.toFixed(1)}</strong>
                </span>

                <div className='shop__product__image'>
                    <FontAwesomeIcon className='shop__product__image__icon' icon={icon} />
                </div>

                <div className='shop__product__name'>
                    {name}
                </div>

                <div className='shop__product_price'>
                    <FontAwesomeIcon 
                        className='shop__product_price__icon' 
                        icon="hands-praying" /> {parseInt(start_price, 10)}
                </div>

                <div className='shop__product_amount'>
                    {amount}
                </div>
            </div>
        );
    }
}

export default Product;