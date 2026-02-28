import styles from './Taskbar.module.css';
import StartButton from './StartButton';
import TaskbarIcon from './TaskbarIcon';
import SystemTray from './SystemTray';
import { TaskbarIconData } from '../../types';

interface TaskbarProps {
  icons: TaskbarIconData[];
  isStartMenuOpen: boolean;
  onStartClick: () => void;
  onTaskbarIconClick?: (id: string) => void;
}

export default function Taskbar({
  icons,
  isStartMenuOpen,
  onStartClick,
  onTaskbarIconClick,
}: TaskbarProps) {
  return (
    <div className={styles.taskbar}>
      <div className={styles.center}>
        <StartButton isActive={isStartMenuOpen} onClick={onStartClick} />
        {icons.map((icon) => (
          <TaskbarIcon
            key={icon.id}
            id={icon.id}
            icon={icon.icon}
            label={icon.label}
            onClick={onTaskbarIconClick}
          />
        ))}
      </div>
      <div className={styles.right}>
        <SystemTray />
      </div>
    </div>
  );
}
