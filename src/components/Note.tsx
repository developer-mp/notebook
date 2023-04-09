export const Note = (props: {
  id: string;
  title: string;
  content: string;
  onClick?: () => void;
  isSelected?: boolean;
  onNoteClick?: () => void;
}) => {
  const { title, content, onClick, isSelected, onNoteClick } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const handleNoteClick = () => {
    if (onNoteClick) {
      onNoteClick();
    }
  };

  return (
    <div
      className={`flex flex-col border-b-2 p-2 ${
        isSelected ? "bg-teal-100" : ""
      }`}
      onClick={handleNoteClick}
    >
      <div className="flex items-center justify-between">
        <div className="ml-5 font-bold">{title}</div>
        {onClick && (
          <button
            className="rounded bg-red-500 px-1 py-0.5 text-xs text-white"
            onClick={handleClick}
          >
            Delete
          </button>
        )}
      </div>
      <div className="ml-5 text-gray-500">{content}</div>
    </div>
  );
};
