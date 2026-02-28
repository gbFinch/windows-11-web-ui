import styles from './Desktop.module.css';
import DesktopIcon from './DesktopIcon';
import { DesktopIconData } from '../../types';

interface DesktopProps {
  icons: DesktopIconData[];
  selectedIconId: string | null;
  onIconSelect: (id: string) => void;
  onIconDoubleClick?: (id: string) => void;
  onBackgroundClick: () => void;
}

export default function Desktop({
  icons,
  selectedIconId,
  onIconSelect,
  onIconDoubleClick,
  onBackgroundClick,
}: DesktopProps) {
  return (
    <div className={styles.desktop} onClick={onBackgroundClick}>
      <div className={styles.iconGrid} onClick={(e) => e.stopPropagation()}>
        {icons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            icon={icon.icon}
            label={icon.label}
            isSelected={selectedIconId === icon.id}
            onSelect={onIconSelect}
            onDoubleClick={onIconDoubleClick}
          />
        ))}
      </div>
    </div>
  );
}
