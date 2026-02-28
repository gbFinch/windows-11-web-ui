import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AppTile from '../../../src/components/StartMenu/AppTile';

describe('AppTile', () => {
  it('renders icon and label', () => {
    render(<AppTile id="test" icon={<span>T</span>} label="Test App" />);
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('calls onClick with id when clicked', () => {
    const onClick = vi.fn();
    render(<AppTile id="test" icon={<span>T</span>} label="Test App" onClick={onClick} />);
    fireEvent.click(screen.getByText('Test App'));
    expect(onClick).toHaveBeenCalledWith('test');
  });
});
