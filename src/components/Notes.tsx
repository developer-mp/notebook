import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { Note } from "./Note";
import { useState } from "react";

export const Notes: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

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
  );
};
