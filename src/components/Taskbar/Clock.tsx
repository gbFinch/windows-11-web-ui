import { useState, useEffect } from 'react';
import styles from './Clock.module.css';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
}

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.clock}>
      <span className={styles.time}>{formatTime(now)}</span>
      <span className={styles.date}>{formatDate(now)}</span>
    </div>
  );
}
