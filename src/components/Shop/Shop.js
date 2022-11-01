import React, { Component } from 'react';
import Product from './Product';
import _PRODUCTS from '../../constants/products';

import '../../css/shop.css';

class Shop extends Component {

    constructor(){
        super();

        this.state = { products: _PRODUCTS }
    }

    componentDidMount(){
        if(this.props.products.length !== 0){
            this.setState({
                products: this.props.products
            })
        }
    }

    buyItem = (item, price) => {

        let products = this.state.products.map(element => {
            if(element.name === item)
                element.start_price = parseFloat(element.start_price * element.multiplier);
            return element;
        })

        this.setState({products: products}, () => {
            this.props.onClick(item, price, products);
        })
        
    }

    render() {

        const { metris_amount, items } = this.props;

        const products_containter = this.state.products.map((element, key) => {
            
            let amount = 0;

            for(let item of items){
                if(item.name === element.name){
                    amount = item.count
                }
            }

            if( metris_amount >= element.start_price){
                return <Product 
                    amount={amount} 
                    onClick={this.buyItem} 
                    options={element} 
                    key={key}
                />
            }else{
                return <Product 
                    disabled 
                    amount={amount}  
                    onClick={this.buyItem} 
                    options={element} 
                    key={key}
                />
            }
        })

        return (
            <div className='shop'>
                <div className='shop__header'>
                    <h1 className='shop__header__element'>商店</h1>
                </div>
                
                
                <div className="shop__container">
                    {products_containter}
                </div>
            </div>
        );
    }
}

export default Shop;