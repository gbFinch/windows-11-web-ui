import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DesktopIcon from '../../../src/components/Desktop/DesktopIcon';

const defaultProps = {
  id: 'test-icon',
  icon: <span>🖥️</span>,
  label: 'Test Icon',
  isSelected: false,
  onSelect: vi.fn(),
};

describe('DesktopIcon', () => {
  it('renders icon and label', () => {
    render(<DesktopIcon {...defaultProps} />);
    expect(screen.getByText('Test Icon')).toBeInTheDocument();
  });

  it('calls onSelect with id on click', () => {
    const onSelect = vi.fn();
    render(<DesktopIcon {...defaultProps} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Test Icon'));
    expect(onSelect).toHaveBeenCalledWith('test-icon');
  });

  it('applies selected class when isSelected is true', () => {
    const { container } = render(<DesktopIcon {...defaultProps} isSelected={true} />);
    expect(container.firstChild).toHaveClass(/selected/);
  });

  it('does not apply selected class when isSelected is false', () => {
    const { container } = render(<DesktopIcon {...defaultProps} isSelected={false} />);
    expect(container.firstChild).not.toHaveClass(/selected/);
  });

  it('calls onDoubleClick with id on double-click', () => {
    const onDoubleClick = vi.fn();
    render(<DesktopIcon {...defaultProps} onDoubleClick={onDoubleClick} />);
    fireEvent.doubleClick(screen.getByText('Test Icon'));
    expect(onDoubleClick).toHaveBeenCalledWith('test-icon');
  });
});
