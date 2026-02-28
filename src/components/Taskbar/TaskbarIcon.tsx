import { ReactNode } from 'react';
import styles from './TaskbarIcon.module.css';

interface TaskbarIconProps {
  id: string;
  icon: ReactNode;
  label: string;
  onClick?: (id: string) => void;
}

export default function TaskbarIcon({ id, icon, label, onClick }: TaskbarIconProps) {
  return (
    <button className={styles.button} onClick={() => onClick?.(id)} aria-label={label}>
      {icon}
      <span className={styles.tooltip}>{label}</span>
    </button>
  );
}
