import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StartMenu from '../../../src/components/StartMenu/StartMenu';
import { AppTileData, RecommendedItemData } from '../../../src/types';

const apps: AppTileData[] = [
  { id: 'app-1', icon: <span>A</span>, label: 'App One' },
  { id: 'app-2', icon: <span>B</span>, label: 'App Two' },
];

const items: RecommendedItemData[] = [
  { id: 'rec-1', icon: <span>R</span>, name: 'Recent File', timestamp: 'Yesterday' },
];

describe('StartMenu', () => {
  it('renders search bar', () => {
    render(<StartMenu isOpen={true} pinnedApps={apps} recommendedItems={items} onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('renders pinned section header', () => {
    render(<StartMenu isOpen={true} pinnedApps={apps} recommendedItems={items} onClose={vi.fn()} />);
    expect(screen.getByText('Pinned')).toBeInTheDocument();
  });

  it('renders all pinned app tiles', () => {
    render(<StartMenu isOpen={true} pinnedApps={apps} recommendedItems={items} onClose={vi.fn()} />);
    expect(screen.getByText('App One')).toBeInTheDocument();
    expect(screen.getByText('App Two')).toBeInTheDocument();
  });

  it('renders recommended section header', () => {
    render(<StartMenu isOpen={true} pinnedApps={apps} recommendedItems={items} onClose={vi.fn()} />);
    expect(screen.getByText('Recommended')).toBeInTheDocument();
  });

  it('renders user name', () => {
    render(<StartMenu isOpen={true} pinnedApps={apps} recommendedItems={items} onClose={vi.fn()} />);
    expect(screen.getByText('User')).toBeInTheDocument();
  });
});
