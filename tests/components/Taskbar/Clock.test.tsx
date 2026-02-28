import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Clock from '../../../src/components/Taskbar/Clock';

describe('Clock', () => {
  it('renders current time in h:mm AM/PM format', () => {
    render(<Clock />);
    const timeEl = screen.getByText(/\d{1,2}:\d{2}\s[AP]M/);
    expect(timeEl).toBeInTheDocument();
  });

  it('renders current date in M/D/YYYY format', () => {
    render(<Clock />);
    const dateEl = screen.getByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dateEl).toBeInTheDocument();
  });
});
