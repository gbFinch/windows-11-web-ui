import styles from './StartMenu.module.css';
import SearchBar from './SearchBar';
import PinnedApps from './PinnedApps';
import RecommendedSection from './RecommendedSection';
import UserPowerRow from './UserPowerRow';
import { AppTileData, RecommendedItemData } from '../../types';

interface StartMenuProps {
  isOpen: boolean;
  pinnedApps: AppTileData[];
  recommendedItems: RecommendedItemData[];
  onClose: () => void;
  onAppClick?: (appId: string) => void;
  onSearch?: (query: string) => void;
}

export default function StartMenu({
  pinnedApps,
  recommendedItems,
  onAppClick,
  onSearch,
}: StartMenuProps) {
  return (
    <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
      <div className={styles.content}>
        <SearchBar onSearch={onSearch} />
        <PinnedApps apps={pinnedApps} onAppClick={onAppClick} />
      </div>
      <div className={styles.divider} />
      <div className={styles.content}>
        <RecommendedSection items={recommendedItems} onItemClick={onAppClick} />
      </div>
      <UserPowerRow userName="User" />
    </div>
  );
}
