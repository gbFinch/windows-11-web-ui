import { PersonRegular, PowerRegular } from '@fluentui/react-icons';
import styles from './UserPowerRow.module.css';

interface UserPowerRowProps {
  userName: string;
  onUserClick?: () => void;
  onPowerClick?: () => void;
}

export default function UserPowerRow({ userName, onUserClick, onPowerClick }: UserPowerRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.user} onClick={onUserClick}>
        <div className={styles.avatar}>
          <PersonRegular />
        </div>
        <span className={styles.userName}>{userName}</span>
      </div>
      <button className={styles.powerButton} onClick={onPowerClick} aria-label="Power">
        <PowerRegular />
      </button>
    </div>
  );
}
