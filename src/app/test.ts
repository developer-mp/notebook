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
                {isNoteCardOpen && selectedNoteId && (
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
                {isNoteCardOpen && selectedNoteId && (
                  <div className="mt-4 ml-96 flex flex-col place-items-center">
                    <EmailCard
                      recipientEmail={""}
                      defaultTitle={selectedNoteTitle}
                      defaultContent={selectedNoteContent}
                      onSubmit={({ title, content, recipientEmail }) => {
                        sendEmail(title, content, recipientEmail);
                        setIsNoteCardOpen(false);
                      }}
                    />
                  </div>
                )}
              </Popup>