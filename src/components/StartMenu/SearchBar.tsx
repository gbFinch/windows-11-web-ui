import { SearchRegular } from '@fluentui/react-icons';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  void onSearch;
  return (
    <div className={styles.wrapper}>
      <SearchRegular className={styles.searchIcon} />
      <input className={styles.input} type="text" placeholder="Search" readOnly />
    </div>
  );
}
