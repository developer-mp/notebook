import { useState } from "react";

export const NoteCard = ({
  onSave,
}: {
  onSave: (note: { title: string; content: string }) => void;
}) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  return (
    <div className="flex min-w-min">
      <div className="flex flex-col rounded-md bg-white p-4 shadow-lg">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            className="w-full rounded-md border border-solid border-indigo-300 p-2 text-sm"
          />
        </div>
        <div>
          <textarea
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            className="h-48 w-full resize-none rounded-md border border-solid border-indigo-300 p-2 text-sm"
          />
        </div>
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => {
              onSave({
                title,
                content,
              });
              setTitle("");
              setContent("");
            }}
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm text-white"
            disabled={title.trim().length === 0 || content.trim().length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
