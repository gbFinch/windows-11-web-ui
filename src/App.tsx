import { useState } from 'react';
import styles from './App.module.css';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import StartMenu from './components/StartMenu/StartMenu';
import { desktopIcons } from './data/desktopIcons';
import { taskbarIcons } from './data/taskbarIcons';
import { pinnedApps } from './data/pinnedApps';
import { recommendedItems } from './data/recommendedItems';

export default function App() {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const handleBackgroundClick = () => {
    setSelectedIconId(null);
    setIsStartMenuOpen(false);
  };

  return (
    <div className={styles.container}>
      <Desktop
        icons={desktopIcons}
        selectedIconId={selectedIconId}
        onIconSelect={setSelectedIconId}
        onBackgroundClick={handleBackgroundClick}
      />
      <Taskbar
        icons={taskbarIcons}
        isStartMenuOpen={isStartMenuOpen}
        onStartClick={() => setIsStartMenuOpen((prev) => !prev)}
      />
      {isStartMenuOpen && (
        <StartMenu
          isOpen={isStartMenuOpen}
          pinnedApps={pinnedApps}
          recommendedItems={recommendedItems}
          onClose={() => setIsStartMenuOpen(false)}
        />
      )}
    </div>
  );
}
