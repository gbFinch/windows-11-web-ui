import {
  DeleteRegular,
  DesktopRegular,
  GlobeRegular,
  FolderRegular,
  FolderOpenRegular,
} from '@fluentui/react-icons';
import { DesktopIconData } from '../types';

export const desktopIcons: DesktopIconData[] = [
  { id: 'recycle-bin', icon: <DeleteRegular />, label: 'Recycle Bin' },
  { id: 'this-pc', icon: <DesktopRegular />, label: 'This PC' },
  { id: 'edge', icon: <GlobeRegular />, label: 'Microsoft Edge' },
  { id: 'file-explorer', icon: <FolderOpenRegular />, label: 'File Explorer' },
  { id: 'documents', icon: <FolderRegular />, label: 'Documents' },
];
