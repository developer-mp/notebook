import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { Note } from "../components/Note";
import { useState, useEffect } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineSearch, AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import { NoteCard } from "~/components/NoteCard";
import { EmailCard } from "../components/EmailCard";
import Popup from "reactjs-popup";
import { sendEmail } from "~/services/email";
import React from "react";
import { type IconType } from "react-icons";

export const Content: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedNoteTitle, setSelectedNoteTitle] = useState<string>("");
  const [selectedNoteContent, setSelectedNoteContent] = useState<string>("");
  const [openWindow, setOpenWindow] = useState<boolean>(false);

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

  const updateNote = api.note.update.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const handleNoteClick = (noteId: string): void => {
    if (noteId === selectedNoteId) {
      setSelectedNoteId(null);
      setSelectedNoteTitle("");
      setSelectedNoteContent("");
      setOpenWindow(false);
    } else {
      const selectedNote = notes?.find((note) => note.id === noteId);
      if (selectedNote) {
        setSelectedNoteId(selectedNote.id);
        setSelectedNoteTitle(selectedNote.title);
        setSelectedNoteContent(selectedNote.content);
        setOpenWindow(true);
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

  const PopupIcon = ({
    icon: Icon,
    iconDisplay: IconDisplay,
    title,
    content,
    marginLeft,
  }: {
    icon: IconType | null;
    iconDisplay: IconType | null;
    title: string;
    content: React.ReactNode;
    marginLeft: string;
  }) => {
    return (
      <Popup
        arrow={false}
        trigger={
          <button>
            {Icon && (
              <Icon
                className={`mr-2 ${
                  selectedNoteId ? "" : "cursor-not-allowed opacity-50"
                }`}
                title={title}
              />
            )}
            {IconDisplay && <IconDisplay className="mr-2" title={title} />}
          </button>
        }
      >
        <div className={`absolute mt-4 ${marginLeft}`}>{content}</div>
      </Popup>
    );
  };

  const popupData = [
    {
      key: "create-note",
      popupComponent: (
        <PopupIcon
          icon={null}
          iconDisplay={IoCreateOutline}
          title="Create note"
          marginLeft="m-[28rem]"
          content={
            <React.Fragment>
              <NoteCard
                onSave={({ title, content }) => {
                  void createNote.mutate({
                    title,
                    content,
                  });
                }}
              />
            </React.Fragment>
          }
        />
      ),
    },
    {
      key: "edit-note",
      popupComponent: (
        <PopupIcon
          icon={AiOutlineEdit}
          iconDisplay={null}
          title="Edit note"
          marginLeft="m-[26rem]"
          content={
            <React.Fragment>
              {selectedNoteId && (
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
                    }
                  }}
                />
              )}
            </React.Fragment>
          }
        />
      ),
    },
    {
      key: "email-note",
      popupComponent: (
        <PopupIcon
          icon={AiOutlineMail}
          iconDisplay={null}
          title="Email note"
          marginLeft="m-[24rem]"
          content={
            <React.Fragment>
              {openWindow && selectedNoteId && (
                <EmailCard
                  recipientEmail={""}
                  defaultTitle={selectedNoteTitle}
                  defaultContent={selectedNoteContent}
                  onSubmit={({ title, content, recipientEmail }) => {
                    if (selectedNoteId) {
                      sendEmail(title, content, recipientEmail);
                    }
                    setOpenWindow(false);
                  }}
                />
              )}
            </React.Fragment>
          }
        />
      ),
    },
  ];

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
              {popupData.map((data) => (
                <React.Fragment key={data.key}>
                  {data.popupComponent}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        {selectedNoteId ? (
          <div className="mt-4 ml-8 max-w-sm rounded-lg border bg-gray-100 p-8 shadow-md">
            <h2 className="mb-2 text-xl font-bold">{selectedNoteTitle}</h2>
            <p className="whitespace-pre-wrap text-gray-700">
              {selectedNoteContent}
            </p>
          </div>
        ) : (
          <div className="items-left ml-8 mt-4 flex max-w-sm justify-center rounded-lg border p-12 text-lg text-gray-400 shadow-md">
            <p>No note selected</p>
          </div>
        )}
      </div>
    </div>
  );
};
