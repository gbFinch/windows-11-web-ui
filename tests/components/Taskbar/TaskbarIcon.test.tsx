import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskbarIcon from '../../../src/components/Taskbar/TaskbarIcon';

describe('TaskbarIcon', () => {
  it('renders label as accessible name', () => {
    render(<TaskbarIcon id="test" icon={<span>T</span>} label="Test App" />);
    expect(screen.getByRole('button', { name: 'Test App' })).toBeInTheDocument();
  });

  it('calls onClick with id when clicked', () => {
    const onClick = vi.fn();
    render(<TaskbarIcon id="test" icon={<span>T</span>} label="Test App" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Test App' }));
    expect(onClick).toHaveBeenCalledWith('test');
  });
});
