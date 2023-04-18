import { type IconType } from "react-icons";

export interface IPopupWindow {
  icon: IconType | null;
  iconDisplay: IconType | null;
  title: string;
  content: React.ReactNode;
  marginLeft: string;
  selectedNoteId: string | null;
}
