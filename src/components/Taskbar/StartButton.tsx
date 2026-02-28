import { WindowRegular } from '@fluentui/react-icons';
import styles from './StartButton.module.css';

interface StartButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export default function StartButton({ isActive, onClick }: StartButtonProps) {
  return (
    <button
      className={`${styles.button} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      aria-label="Start"
    >
      <WindowRegular />
    </button>
  );
}
