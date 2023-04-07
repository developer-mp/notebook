import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { Note } from "./Note";
import { useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineSearch } from "react-icons/ai";
import { NoteCard } from "~/components/NoteCard";
import Popup from "reactjs-popup";

export type Note = {
  id: string;
  title: string;
  content: string;
};

export const Notes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNoteCardOpen, setIsNoteCardOpen] = useState(false);

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
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("");
  const [selectedNoteContent, setSelectedNoteContent] = useState("");

  const handleNoteClick = (noteId: string) => {
    const selectedNote = notes?.find((note) => note.id === noteId);
    if (selectedNote) {
      setSelectedNoteId(selectedNote.id);
      setSelectedNoteTitle(selectedNote.title);
      setSelectedNoteContent(selectedNote.content);
    }
  };

  const filteredNotes = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="h-screen w-1/5 border-r-2">
        <div className="border-b-2 p-2 text-center font-bold">Notes</div>
        <div className="flex items-center border-b-2 p-2">
          <div className="ml-5 text-xl font-bold text-gray-500">
            <AiOutlineSearch />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search"
            className="ml-2 focus:outline-none"
          />
        </div>
        {filteredNotes?.map((note) => (
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
      <div className="w-full p-2">
        <div className="mb-2 flex items-center">
          <div className="text-xl font-bold text-gray-500">
            <div className="text-2xl text-blue-900">
              <Popup
                trigger={
                  <button>
                    <IoCreateOutline />
                  </button>
                }
                onOpen={() => setIsNoteCardOpen(true)}
                onClose={() => setIsNoteCardOpen(false)}
              >
                {isNoteCardOpen && (
                  <div className="ml-96 mt-4 flex flex-col place-items-center">
                    <NoteCard
                      onSave={({ title, content }) => {
                        void createNote.mutate({
                          title,
                          content,
                        });
                        setIsNoteCardOpen(false);
                      }}
                    />
                  </div>
                )}
              </Popup>
            </div>
          </div>
        </div>
        {selectedNoteId ? (
          <div className="p-10">
            <h2 className="mb-2 text-xl font-bold">{selectedNoteTitle}</h2>
            <p className="whitespace-pre-wrap">{selectedNoteContent}</p>
          </div>
        ) : (
          <p className="p-20 text-lg text-gray-400">No note selected</p>
        )}
      </div>
    </div>
  );
};
