import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { Note } from "./Note";
import { useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { NoteCard } from "~/components/NoteCard";
import Popup from "reactjs-popup";

export const Notes: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const handleNoteClick = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  return (
    <div className="flex">
      <div className="h-screen w-1/5 border-r-2">
        <div className="border-b-2 p-2 text-center font-bold">Notes</div>
        <div className="border-b-2 p-2 text-center font-bold">Search</div>
        {notes?.map((note) => (
          <Note
            key={note.id}
            title={note.title}
            content={note.content}
            onClick={() => {
              void deleteNote.mutate({ id: note.id });
            }}
            isSelected={note.id === selectedNoteId}
            onNoteClick={() => handleNoteClick(note.id)}
          />
        ))}
      </div>
      <div className="p-2 text-2xl text-blue-900">
        <Popup
          trigger={
            <button>
              <IoCreateOutline />
            </button>
          }
        >
          <div className="ml-96 mt-4 flex flex-col place-items-center">
            <NoteCard
              onSave={({ title, content }) => {
                void createNote.mutate({
                  title,
                  content,
                });
              }}
            />
          </div>
        </Popup>
      </div>
    </div>
  );
};
