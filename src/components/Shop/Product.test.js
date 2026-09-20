import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Product from './Product';
import _PRODUCTS from '../../constants/products';

const renderProduct = (disabled = false) => render(
  <Product
    disabled={disabled}
    amount={2}
    achievementMultiplier={1.01}
    onClick={jest.fn()}
    options={_PRODUCTS[0]}
  />
);

describe('Product tooltip', () => {
  it('renders a semantic tooltip without covering the product card', () => {
    const { container } = renderProduct();

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip.className).toContain('shop__product__information');
    expect(container.querySelector('.shop__product__image')).toBeTruthy();
  });

  it('links the product to its tooltip for accessibility', () => {
    const { container } = renderProduct(true);

    const product = container.querySelector('.shop__product');
    expect(product.getAttribute('aria-describedby')).toContain(_PRODUCTS[0].name);
    expect(screen.getByRole('tooltip').id).toContain(_PRODUCTS[0].name);
  });
});


  it('positions the tooltip beside the product on hover', () => {
    const { container } = renderProduct();

    const product = container.querySelector('.shop__product');
    fireEvent.mouseEnter(product);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('shop__product__information--visible');
    expect(tooltip.style.left).toBe('10px');
    expect(tooltip.style.top).toBe('65px');
  });


it('shows the achievement-boosted production value', () => {
  render(
    <Product
      amount={2}
      achievementMultiplier={1.01}
      onClick={jest.fn()}
      options={_PRODUCTS[0]}
    />
  );

  expect(screen.getByText('当前每秒：+1.0')).toBeTruthy();
});
