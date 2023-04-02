import { useSession } from "next-auth/react";
import { api } from "../utils/api";

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

  return (
    <div className="mt-1 w-1/5 text-center font-bold">
      Notes
      <div>Search</div>
      <div className="mt-4 flex flex-col place-items-center">
        <ul className="mb-2">
          {notes?.map((note) => (
            <li key={note.id}>
              {note.title}
              {note.content}
              <button
                className="ml-2 rounded bg-red-500 px-1 py-0.5 text-xs text-white"
                onClick={() => {
                  void deleteNote.mutate({ id: note.id });
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
