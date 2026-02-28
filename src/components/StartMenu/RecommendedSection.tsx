import styles from './RecommendedSection.module.css';
import RecommendedItem from './RecommendedItem';
import { RecommendedItemData } from '../../types';

interface RecommendedSectionProps {
  items: RecommendedItemData[];
  onItemClick?: (itemId: string) => void;
}

export default function RecommendedSection({ items, onItemClick }: RecommendedSectionProps) {
  return (
    <div>
      <div className={styles.header}>
        <span className={styles.title}>Recommended</span>
        <button className={styles.more}>More &gt;</button>
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <RecommendedItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            name={item.name}
            timestamp={item.timestamp}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}
