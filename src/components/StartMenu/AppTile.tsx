import { ReactNode } from 'react';
import styles from './AppTile.module.css';

interface AppTileProps {
  id: string;
  icon: ReactNode;
  label: string;
  onClick?: (id: string) => void;
}

export default function AppTile({ id, icon, label, onClick }: AppTileProps) {
  return (
    <div className={styles.tile} onClick={() => onClick?.(id)}>
      <div className={styles.icon}>{icon}</div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
