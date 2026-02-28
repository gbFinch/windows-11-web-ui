import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Desktop from '../../../src/components/Desktop/Desktop';
import { DesktopIconData } from '../../../src/types';

const icons: DesktopIconData[] = [
  { id: 'icon-1', icon: <span>1</span>, label: 'Icon One' },
  { id: 'icon-2', icon: <span>2</span>, label: 'Icon Two' },
  { id: 'icon-3', icon: <span>3</span>, label: 'Icon Three' },
];

describe('Desktop', () => {
  it('renders all provided icons', () => {
    render(
      <Desktop icons={icons} selectedIconId={null} onIconSelect={vi.fn()} onBackgroundClick={vi.fn()} />,
    );
    expect(screen.getByText('Icon One')).toBeInTheDocument();
    expect(screen.getByText('Icon Two')).toBeInTheDocument();
    expect(screen.getByText('Icon Three')).toBeInTheDocument();
  });

  it('calls onBackgroundClick when clicking desktop background', () => {
    const onBackgroundClick = vi.fn();
    const { container } = render(
      <Desktop icons={icons} selectedIconId={null} onIconSelect={vi.fn()} onBackgroundClick={onBackgroundClick} />,
    );
    fireEvent.click(container.firstChild!);
    expect(onBackgroundClick).toHaveBeenCalled();
  });

  it('does not call onBackgroundClick when clicking an icon', () => {
    const onBackgroundClick = vi.fn();
    render(
      <Desktop icons={icons} selectedIconId={null} onIconSelect={vi.fn()} onBackgroundClick={onBackgroundClick} />,
    );
    fireEvent.click(screen.getByText('Icon One'));
    expect(onBackgroundClick).not.toHaveBeenCalled();
  });
});
