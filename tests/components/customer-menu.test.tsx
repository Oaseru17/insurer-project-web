import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { CustomerMenu } from '@/components/customer-menu';
import { CUSTOMER_COOKIE, writeCustomerCookie } from '@/lib/demo-customers';

const CUSTOMERS = [
  { id: 'a', name: 'Maya Torres' },
  { id: 'b', name: 'Sam Lee' },
];

describe('CustomerMenu', () => {
  it('shows who is logged in and lets you log in as another sample customer', () => {
    const onSelect = jest.fn();
    render(<CustomerMenu customers={CUSTOMERS} currentId="a" onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Maya Torres/ }));
    expect(screen.getByRole('button', { name: 'Log in as Maya Torres' })).toHaveAttribute(
      'aria-current',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Log in as Sam Lee' }));
    expect(onSelect).toHaveBeenCalledWith('b');
  });

  it('remembers the chosen customer id in a cookie', () => {
    writeCustomerCookie('b');

    expect(document.cookie).toContain(`${CUSTOMER_COOKIE}=b`);
  });
});
