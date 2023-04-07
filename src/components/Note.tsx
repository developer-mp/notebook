import { useState } from "react";

export const Note = (props: {
  title: string;
  content: string;
  onClick?: () => void;
  isSelected?: boolean;
  onNoteClick?: () => void;
}) => {
  const { title, content, onClick, isSelected, onNoteClick } = props;
  const [isNoteSelected, setIsNoteSelected] = useState(isSelected);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const handleNoteClick = () => {
    setIsNoteSelected(!isNoteSelected);
    if (onNoteClick) {
      onNoteClick();
    }
  };

  return (
    <div
      className={`flex flex-col border-b-2 p-2 ${
        isNoteSelected ? "bg-teal-100" : ""
      }`}
      onClick={handleNoteClick}
    >
      <div className="ml-5 font-bold">{title}</div>
      <div className="ml-5 text-gray-500">{content}</div>
      {onClick && (
        <button
          className="ml-2 rounded bg-red-500 px-1 py-0.5 text-xs text-white"
          onClick={handleClick}
        >
          Delete
        </button>
      )}
    </div>
  );
};
