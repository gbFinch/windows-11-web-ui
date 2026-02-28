import {
  Wifi1Regular,
  Speaker2Regular,
  Battery5Regular,
  AlertRegular,
  ChevronUpRegular,
} from '@fluentui/react-icons';
import styles from './SystemTray.module.css';
import Clock from './Clock';

interface SystemTrayProps {
  onTrayClick?: (id: string) => void;
}

export default function SystemTray({ onTrayClick }: SystemTrayProps) {
  return (
    <div className={styles.tray}>
      <button
        className={styles.notificationBell}
        onClick={() => onTrayClick?.('hidden-icons')}
        aria-label="Show hidden icons"
      >
        <ChevronUpRegular />
      </button>
      <div className={styles.iconGroup} onClick={() => onTrayClick?.('quick-settings')}>
        <Wifi1Regular />
        <Speaker2Regular />
        <Battery5Regular />
      </div>
      <Clock />
      <button
        className={styles.notificationBell}
        onClick={() => onTrayClick?.('notifications')}
        aria-label="Notifications"
      >
        <AlertRegular />
      </button>
    </div>
  );
}
