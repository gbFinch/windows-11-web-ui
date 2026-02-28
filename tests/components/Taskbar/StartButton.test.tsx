import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StartButton from '../../../src/components/Taskbar/StartButton';

describe('StartButton', () => {
  it('renders with Start aria-label', () => {
    render(<StartButton isActive={false} onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<StartButton isActive={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('applies active class when isActive is true', () => {
    render(<StartButton isActive={true} onClick={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Start' });
    expect(button).toHaveClass(/active/);
  });
});
