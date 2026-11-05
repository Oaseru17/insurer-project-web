import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ProductPicker } from '@/components/product-picker';
import { productsFrom } from '@/lib/products';

describe('ProductPicker', () => {
  it('offers each product once, built from the carriers the backend returns', () => {
    const carriers = [
      { id: 'harbor', name: 'Harbor Assurance', product: 'renters' },
      { id: 'second', name: 'Second Carrier', product: 'renters' },
    ];

    render(<ProductPicker products={productsFrom(carriers)} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName(expect.stringContaining('Renters insurance'));
    expect(links[0]).toHaveAttribute('href', '/quote/renters');
  });
});
