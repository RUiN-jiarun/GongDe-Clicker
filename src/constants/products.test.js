import _PRODUCTS from './products';

describe('product balance', () => {
  it('makes each later item dramatically more expensive than the previous one', () => {
    for (let i = 1; i < _PRODUCTS.length; i++) {
      const previous = _PRODUCTS[i - 1];
      const current = _PRODUCTS[i];

      expect(current.start_price).toBeGreaterThan(previous.start_price * 3);
      expect(current.value).toBeGreaterThan(previous.value);
    }
  });

  it('makes later items proportionally less efficient than early items', () => {
    const efficiencies = _PRODUCTS.map(
      product => product.value / product.start_price
    );

    for (let i = 1; i < efficiencies.length; i++) {
      expect(efficiencies[i]).toBeLessThan(efficiencies[i - 1]);
    }
  });
});
