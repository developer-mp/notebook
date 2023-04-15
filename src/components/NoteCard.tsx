import { useState } from "react";
import { type INoteCard } from "~/typings/NoteCard";

export const NoteCard: React.FC<INoteCard> = (props) => {
  const [title, setTitle] = useState<string>(props.defaultTitle ?? "");
  const [content, setContent] = useState<string>(props.defaultContent ?? "");

  return (
    <div className="flex">
      <div className="flex flex-col rounded-md bg-white p-4 shadow-lg">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            className="w-80 rounded-md border border-solid border-blue-900 p-2 text-sm focus:outline-blue-900"
          />
        </div>
        <div>
          <textarea
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            className="h-40 w-80 resize-none rounded-md border border-solid border-blue-900 p-2 text-sm focus:outline-blue-900"
          />
        </div>
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => {
              props.onSave({
                title,
                content,
              });
              setTitle("");
              setContent("");
            }}
            className={`rounded-md bg-blue-900 px-4 py-2 text-sm text-white ${
              title.trim().length === 0 || content.trim().length === 0
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            disabled={title.trim().length === 0 || content.trim().length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
