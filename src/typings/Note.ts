export type INote = {
  id: string;
  title: string;
  content: string;
  onClick?: () => void;
  isSelected?: boolean;
  onNoteClick?: () => void;
};
