export interface INoteCard {
  defaultTitle?: string;
  defaultContent?: string;
  onSave: ({ title, content }: { title: string; content: string }) => void;
}
