import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { AppShell } from './app-shell';

describe('AppShell', () => {
  it('renders page content inside the main landmark', () => {
    render(
      <AppShell>
        <h1>Renters insurance quote</h1>
      </AppShell>,
    );

    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('heading', { name: 'Renters insurance quote' }),
    );
  });
});
