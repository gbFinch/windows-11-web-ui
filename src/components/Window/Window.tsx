import { ReactNode, useRef, useCallback } from 'react';
import {
  DismissRegular,
  MaximizeRegular,
  SquareMultipleRegular,
  SubtractRegular,
} from '@fluentui/react-icons';
import styles from './Window.module.css';

interface WindowProps {
  id: string;
  title: string;
  icon?: ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, x: number, y: number, w: number, h: number) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  children: ReactNode;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const MIN_W = 400;
const MIN_H = 300;
const TASKBAR_H = 48;

export default function Window({
  id, title, icon, x, y, width, height, zIndex,
  isMinimized, isMaximized,
  onMove, onResize, onMinimize, onMaximize, onClose, onFocus,
  children,
}: WindowProps) {
  const dragRef = useRef<{ ox: number; oy: number } | null>(null);
  const resizeRef = useRef<{ dir: ResizeDir; sx: number; sy: number; ix: number; iy: number; iw: number; ih: number } | null>(null);

  const posX = isMaximized ? 0 : x;
  const posY = isMaximized ? 0 : y;
  const w = isMaximized ? window.innerWidth : width;
  const h = isMaximized ? window.innerHeight - TASKBAR_H : height;

  const handleDragStart = useCallback((e: React.PointerEvent) => {
    if (isMaximized) return;
    dragRef.current = { ox: e.clientX - x, oy: e.clientY - y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isMaximized, x, y]);

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const newX = e.clientX - dragRef.current.ox;
    const newY = Math.max(0, Math.min(e.clientY - dragRef.current.oy, window.innerHeight - TASKBAR_H - 32));
    onMove(id, newX, newY);
  }, [id, onMove]);

  const handleDragEnd = useCallback(() => { dragRef.current = null; }, []);

  const handleResizeStart = useCallback((dir: ResizeDir) => (e: React.PointerEvent) => {
    if (isMaximized) return;
    e.stopPropagation();
    resizeRef.current = { dir, sx: e.clientX, sy: e.clientY, ix: x, iy: y, iw: width, ih: height };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isMaximized, x, y, width, height]);

  const handleResizeMove = useCallback((e: React.PointerEvent) => {
    const r = resizeRef.current;
    if (!r) return;
    const dx = e.clientX - r.sx;
    const dy = e.clientY - r.sy;
    let nx = r.ix, ny = r.iy, nw = r.iw, nh = r.ih;

    if (r.dir.includes('e')) nw = Math.max(MIN_W, r.iw + dx);
    if (r.dir.includes('s')) nh = Math.max(MIN_H, r.ih + dy);
    if (r.dir.includes('w')) { nw = Math.max(MIN_W, r.iw - dx); nx = r.ix + r.iw - nw; }
    if (r.dir.includes('n') && r.dir !== 'ne' && r.dir !== 'nw') { nh = Math.max(MIN_H, r.ih - dy); ny = r.iy + r.ih - nh; }
    if (r.dir === 'ne') { nw = Math.max(MIN_W, r.iw + dx); nh = Math.max(MIN_H, r.ih - dy); ny = r.iy + r.ih - nh; }
    if (r.dir === 'nw') { nw = Math.max(MIN_W, r.iw - dx); nx = r.ix + r.iw - nw; nh = Math.max(MIN_H, r.ih - dy); ny = r.iy + r.ih - nh; }
    if (r.dir === 'n') { nh = Math.max(MIN_H, r.ih - dy); ny = r.iy + r.ih - nh; }

    onResize(id, nx, ny, nw, nh);
  }, [id, onResize]);

  const handleResizeEnd = useCallback(() => { resizeRef.current = null; }, []);

  const resizeHandle = (dir: ResizeDir, className: string | undefined) => (
    <div
      className={className}
      onPointerDown={handleResizeStart(dir)}
      onPointerMove={handleResizeMove}
      onPointerUp={handleResizeEnd}
    />
  );

  return (
    <div
      className={`${styles.window} ${isMaximized ? styles.maximized : ''}`}
      style={{ left: `${posX}px`, top: `${posY}px`, width: `${w}px`, height: `${h}px`, zIndex, visibility: isMinimized ? 'hidden' : 'visible' }}
      onPointerDown={() => onFocus(id)}
    >
      {!isMaximized && (
        <>
          {resizeHandle('n', styles.resizeN)}
          {resizeHandle('s', styles.resizeS)}
          {resizeHandle('e', styles.resizeE)}
          {resizeHandle('w', styles.resizeW)}
          {resizeHandle('nw', styles.resizeNW)}
          {resizeHandle('ne', styles.resizeNE)}
          {resizeHandle('sw', styles.resizeSW)}
          {resizeHandle('se', styles.resizeSE)}
        </>
      )}
      <div
        className={styles.titleBar}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onDoubleClick={() => onMaximize(id)}
      >
        <div className={styles.titleLeft}>
          {icon && <span className={styles.titleIcon}>{icon}</span>}
          <span className={styles.titleText}>{title}</span>
        </div>
        <div className={styles.titleButtons}>
          <button aria-label="Minimize" className={styles.titleBtn} onClick={(e) => { e.stopPropagation(); onMinimize(id); }}>
            <SubtractRegular />
          </button>
          <button aria-label="Maximize" className={styles.titleBtn} onClick={(e) => { e.stopPropagation(); onMaximize(id); }}>
            {isMaximized ? <SquareMultipleRegular /> : <MaximizeRegular />}
          </button>
          <button aria-label="Close" className={`${styles.titleBtn} ${styles.closeBtn}`} onClick={(e) => { e.stopPropagation(); onClose(id); }}>
            <DismissRegular />
          </button>
        </div>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
