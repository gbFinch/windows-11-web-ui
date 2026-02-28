import styles from './PinnedApps.module.css';
import AppTile from './AppTile';
import { AppTileData } from '../../types';

interface PinnedAppsProps {
  apps: AppTileData[];
  onAppClick?: (appId: string) => void;
}

export default function PinnedApps({ apps, onAppClick }: PinnedAppsProps) {
  return (
    <div>
      <div className={styles.header}>
        <span className={styles.title}>Pinned</span>
        <button className={styles.allApps}>All apps &gt;</button>
      </div>
      <div className={styles.grid}>
        {apps.map((app) => (
          <AppTile key={app.id} id={app.id} icon={app.icon} label={app.label} onClick={onAppClick} />
        ))}
      </div>
    </div>
  );
}
