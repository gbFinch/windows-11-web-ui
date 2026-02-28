import {
  SearchRegular,
  AppFolderRegular,
  WeatherSunnyRegular,
  GlobeRegular,
  FolderOpenRegular,
  StoreMicrosoftRegular,
  SettingsRegular,
} from '@fluentui/react-icons';
import { TaskbarIconData } from '../types';

export const taskbarIcons: TaskbarIconData[] = [
  { id: 'search', icon: <SearchRegular />, label: 'Search' },
  { id: 'task-view', icon: <AppFolderRegular />, label: 'Task View' },
  { id: 'widgets', icon: <WeatherSunnyRegular />, label: 'Widgets' },
  { id: 'edge', icon: <GlobeRegular />, label: 'Microsoft Edge' },
  { id: 'file-explorer', icon: <FolderOpenRegular />, label: 'File Explorer' },
  { id: 'store', icon: <StoreMicrosoftRegular />, label: 'Microsoft Store' },
  { id: 'settings', icon: <SettingsRegular />, label: 'Settings' },
];
