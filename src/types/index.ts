import { ReactNode } from 'react';

export interface DesktopIconData {
  id: string;
  icon: ReactNode;
  label: string;
}

export interface TaskbarIconData {
  id: string;
  icon: ReactNode;
  label: string;
}

export interface AppTileData {
  id: string;
  icon: ReactNode;
  label: string;
}

export interface RecommendedItemData {
  id: string;
  icon: ReactNode;
  name: string;
  timestamp: string;
}
