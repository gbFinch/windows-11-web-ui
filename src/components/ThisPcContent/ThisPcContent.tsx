import {
  ArrowLeftRegular,
  ArrowRightRegular,
  ArrowUpRegular,
  DesktopRegular,
  DocumentRegular,
  ArrowDownloadRegular,
  ImageRegular,
  HardDriveRegular,
} from '@fluentui/react-icons';
import { drives } from '../../data/drives';
import styles from './ThisPcContent.module.css';

const sidebarItems = [
  { id: 'desktop', label: 'Desktop', icon: <DesktopRegular /> },
  { id: 'documents', label: 'Documents', icon: <DocumentRegular /> },
  { id: 'downloads', label: 'Downloads', icon: <ArrowDownloadRegular /> },
  { id: 'pictures', label: 'Pictures', icon: <ImageRegular /> },
];

export default function ThisPcContent() {
  return (
    <div className={styles.container}>
      <div className={styles.navBar}>
        <button className={styles.navBtn} disabled><ArrowLeftRegular /></button>
        <button className={styles.navBtn} disabled><ArrowRightRegular /></button>
        <button className={styles.navBtn} disabled><ArrowUpRegular /></button>
        <span className={styles.breadcrumb}>This PC</span>
      </div>
      <div className={styles.content}>
        <nav className={styles.sidebar}>
          {sidebarItems.map((item) => (
            <div key={item.id} className={styles.sidebarItem}>
              <span className={styles.sidebarIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className={styles.main}>
          <div className={styles.driveGrid}>
            {drives.map((drive) => {
              const usedPct = ((drive.totalGB - drive.freeGB) / drive.totalGB) * 100;
              return (
                <div key={drive.id} className={styles.driveTile}>
                  <div className={styles.driveIcon}><HardDriveRegular /></div>
                  <div className={styles.driveInfo}>
                    <span className={styles.driveLabel}>{drive.label}</span>
                    <div className={styles.usageBar} role="progressbar" aria-valuenow={usedPct} aria-valuemin={0} aria-valuemax={100}>
                      <div className={styles.usageFill} style={{ width: `${usedPct}%` }} />
                    </div>
                    <span className={styles.driveText}>{drive.freeGB} GB free of {drive.totalGB} GB</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
