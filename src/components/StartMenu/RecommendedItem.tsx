import { ReactNode } from 'react';
import styles from './RecommendedItem.module.css';

interface RecommendedItemProps {
  id: string;
  icon: ReactNode;
  name: string;
  timestamp: string;
  onClick?: (id: string) => void;
}

export default function RecommendedItem({ id, icon, name, timestamp, onClick }: RecommendedItemProps) {
  return (
    <div className={styles.item} onClick={() => onClick?.(id)}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.timestamp}>{timestamp}</span>
      </div>
    </div>
  );
}
