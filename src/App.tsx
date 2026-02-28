import { useState, useRef, useCallback } from 'react';
import styles from './App.module.css';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import StartMenu from './components/StartMenu/StartMenu';
import Window from './components/Window/Window';
import ThisPcContent from './components/ThisPcContent/ThisPcContent';
import { desktopIcons } from './data/desktopIcons';
import { taskbarIcons } from './data/taskbarIcons';
import { pinnedApps } from './data/pinnedApps';
import { recommendedItems } from './data/recommendedItems';
import { WindowState } from './types';
import { DesktopRegular } from '@fluentui/react-icons';

export default function App() {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const nextZIndex = useRef(100);
  const windowCounter = useRef(0);

  const handleBackgroundClick = () => {
    setSelectedIconId(null);
    setIsStartMenuOpen(false);
  };

  const handleIconDoubleClick = useCallback((iconId: string) => {
    if (iconId === 'this-pc') {
      const offset = windowCounter.current * 30;
      const win: WindowState = {
        id: `this-pc-${Date.now()}`,
        appId: 'this-pc',
        title: 'This PC',
        icon: <DesktopRegular />,
        x: Math.max(0, (window.innerWidth - 800) / 2 + offset),
        y: Math.max(0, (window.innerHeight - 48 - 600) / 2 + offset),
        width: 800,
        height: 600,
        zIndex: nextZIndex.current++,
        isMinimized: false,
        isMaximized: false,
        preMaxBounds: null,
      };
      windowCounter.current++;
      setOpenWindows((prev) => [...prev, win]);
    }
  }, []);

  const updateWindow = useCallback((id: string, patch: Partial<WindowState>) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }, []);

  const handleWindowMove = useCallback((id: string, x: number, y: number) => {
    updateWindow(id, { x, y });
  }, [updateWindow]);

  const handleWindowResize = useCallback((id: string, x: number, y: number, width: number, height: number) => {
    updateWindow(id, { x, y, width, height });
  }, [updateWindow]);

  const handleWindowMinimize = useCallback((id: string) => {
    updateWindow(id, { isMinimized: true });
  }, [updateWindow]);

  const handleWindowMaximize = useCallback((id: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          return { ...w, isMaximized: false, ...(w.preMaxBounds ?? {}), preMaxBounds: null };
        }
        return { ...w, isMaximized: true, preMaxBounds: { x: w.x, y: w.y, width: w.width, height: w.height } };
      }),
    );
  }, []);

  const handleWindowClose = useCallback((id: string) => {
    setOpenWindows((prev) => {
      const next = prev.filter((w) => w.id !== id);
      if (next.length === 0) windowCounter.current = 0;
      return next;
    });
  }, []);

  const handleWindowFocus = useCallback((id: string) => {
    updateWindow(id, { zIndex: nextZIndex.current++ });
  }, [updateWindow]);

  return (
    <div className={styles.container}>
      <Desktop
        icons={desktopIcons}
        selectedIconId={selectedIconId}
        onIconSelect={setSelectedIconId}
        onIconDoubleClick={handleIconDoubleClick}
        onBackgroundClick={handleBackgroundClick}
      />
      {openWindows.map((win) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          icon={win.icon}
          x={win.x}
          y={win.y}
          width={win.width}
          height={win.height}
          zIndex={win.zIndex}
          isMinimized={win.isMinimized}
          isMaximized={win.isMaximized}
          onMove={handleWindowMove}
          onResize={handleWindowResize}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onClose={handleWindowClose}
          onFocus={handleWindowFocus}
        >
          {win.appId === 'this-pc' && <ThisPcContent />}
        </Window>
      ))}
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
