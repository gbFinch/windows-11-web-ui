import { DocumentRegular, ImageRegular, FolderRegular, NoteRegular } from '@fluentui/react-icons';
import { RecommendedItemData } from '../types';

export const recommendedItems: RecommendedItemData[] = [
  { id: 'doc-1', icon: <DocumentRegular />, name: 'Project Proposal.docx', timestamp: 'Yesterday at 3:42 PM' },
  { id: 'img-1', icon: <ImageRegular />, name: 'Screenshot 2026-02-27.png', timestamp: 'Yesterday at 11:15 AM' },
  { id: 'folder-1', icon: <FolderRegular />, name: 'Downloads', timestamp: '2/26/2026' },
  { id: 'note-1', icon: <NoteRegular />, name: 'Meeting Notes.txt', timestamp: '2/25/2026' },
];
