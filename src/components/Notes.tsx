import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { Note } from "./Note";
import { useState, useEffect } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineSearch, AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import { NoteCard } from "~/components/NoteCard";
import { EmailCard } from "./EmailCard";
import Popup from "reactjs-popup";
import emailjs from "emailjs-com";

export type Note = {
  id: string;
  title: string;
  content: string;
};

export const Notes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isNoteCardOpen, setIsNoteCardOpen] = useState<boolean>(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedNoteTitle, setSelectedNoteTitle] = useState<string>("");
  const [selectedNoteContent, setSelectedNoteContent] = useState<string>("");

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

  const updateNote = api.note.update.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const handleNoteClick = (noteId: string): void => {
    if (noteId === selectedNoteId) {
      setSelectedNoteId(null);
      setSelectedNoteTitle("");
      setSelectedNoteContent("");
    } else {
      const selectedNote = notes?.find((note) => note.id === noteId);
      if (selectedNote) {
        setSelectedNoteId(selectedNote.id);
        setSelectedNoteTitle(selectedNote.title);
        setSelectedNoteContent(selectedNote.content);
      }
    }
  };

  const filteredNotes = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const selectedNote = notes?.find((note) => note.id === selectedNoteId);
    if (selectedNote) {
      setSelectedNoteTitle(selectedNote.title);
      setSelectedNoteContent(selectedNote.content);
    } else {
      setSelectedNoteId(null);
    }
  }, [selectedNoteId, notes]);

  const EMAIL_SERVICE_ID = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID;
  const EMAIL_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID;
  const EMAIL_USER_ID = process.env.NEXT_PUBLIC_EMAIL_USER_ID;

  function sendEmail(title: string, content: string, recipientEmail: string) {
    const templateParams = {
      user_name: "Notebook App",
      user_email: recipientEmail,
      user_subject: title,
      message: content,
      to_email: recipientEmail,
    };
    if (EMAIL_SERVICE_ID && EMAIL_TEMPLATE_ID && EMAIL_USER_ID) {
      emailjs
        .send(
          EMAIL_SERVICE_ID,
          EMAIL_TEMPLATE_ID,
          templateParams,
          EMAIL_USER_ID
        )
        .then(
          (result) => {
            console.log(
              "Email sent successfully:",
              (result as { text: string }).text
            );
          },
          (error) => {
            console.log(
              "Error sending email:",
              (error as { text: string }).text
            );
          }
        );
    } else {
      throw new Error("Missing environment variables for email service");
    }
  }

  return (
    <div className="flex">
      <div className="h-screen w-1/5 border-r-2">
        <div className="w-screen border-b-2 p-2 font-bold">
          <div className="ml-32">Notes</div>
        </div>
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
            id={note.id}
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
                    <div className="flex">
                      <IoCreateOutline className="mr-2" title="Create note" />
                    </div>
                  </button>
                }
                arrow={false}
                onOpen={() => setIsNoteCardOpen(true)}
                onClose={() => setIsNoteCardOpen(false)}
              >
                {isNoteCardOpen && (
                  <div className="mt-4 ml-96 flex flex-col place-items-center">
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
              <Popup
                trigger={
                  <button>
                    <div className="flex">
                      <AiOutlineEdit
                        className={`${
                          selectedNoteId
                            ? "mr-2"
                            : "mr-2 cursor-not-allowed opacity-50"
                        }`}
                        title="Edit note"
                      />
                    </div>
                  </button>
                }
                arrow={false}
                onOpen={() => setIsNoteCardOpen(true)}
                onClose={() => setIsNoteCardOpen(false)}
              >
                {isNoteCardOpen && (
                  <div className="ml-96 mt-4 flex flex-col place-items-center">
                    <NoteCard
                      defaultTitle={selectedNoteTitle}
                      defaultContent={selectedNoteContent}
                      onSave={({ title, content }) => {
                        if (selectedNoteId) {
                          void updateNote.mutate({
                            id: selectedNoteId,
                            title,
                            content,
                          });
                          setIsNoteCardOpen(false);
                        }
                      }}
                    />
                  </div>
                )}
              </Popup>
              <Popup
                trigger={
                  <button>
                    <div className="flex">
                      <AiOutlineMail
                        className={`${
                          selectedNoteId
                            ? "mr-2"
                            : "mr-2 cursor-not-allowed opacity-50"
                        }`}
                        title="Email note"
                      />
                    </div>
                  </button>
                }
                arrow={false}
                onOpen={() => setIsNoteCardOpen(true)}
                onClose={() => setIsNoteCardOpen(false)}
              >
                {isNoteCardOpen && (
                  <div className="mt-4 ml-96 flex flex-col place-items-center">
                    <EmailCard
                      recipientEmail={"gg"}
                      defaultTitle={selectedNoteTitle}
                      defaultContent={selectedNoteContent}
                      onSave={({ title, content, recipientEmail }) => {
                        sendEmail(title, content, recipientEmail);
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
          <div className="mt-4 ml-2 max-w-sm rounded-lg border bg-gray-100 p-8 shadow-md">
            <h2 className="mb-2 text-xl font-bold">{selectedNoteTitle}</h2>
            <p className="whitespace-pre-wrap text-gray-700">
              {selectedNoteContent}
            </p>
          </div>
        ) : (
          <div className="items-left ml-2 mt-4 flex max-w-sm justify-center rounded-lg border p-12 text-lg text-gray-400 shadow-md">
            <p>No note selected</p>
          </div>
        )}
      </div>
    </div>
  );
};
