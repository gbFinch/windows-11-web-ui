import { ReactNode } from 'react';
import styles from './DesktopIcon.module.css';

interface DesktopIconProps {
  id: string;
  icon: ReactNode;
  label: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick?: (id: string) => void;
}

export default function DesktopIcon({
  id,
  icon,
  label,
  isSelected,
  onSelect,
  onDoubleClick,
}: DesktopIconProps) {
  return (
    <div
      className={`${styles.icon} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(id)}
      onDoubleClick={() => onDoubleClick?.(id)}
    >
      <div className={styles.iconImage}>{icon}</div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
