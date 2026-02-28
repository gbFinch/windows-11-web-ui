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

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon?: ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  preMaxBounds: { x: number; y: number; width: number; height: number } | null;
}

export interface DriveData {
  id: string;
  label: string;
  totalGB: number;
  freeGB: number;
}
