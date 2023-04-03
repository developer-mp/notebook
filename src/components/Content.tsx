// import { useSession } from "next-auth/react";
// import { api } from "../utils/api";
// import { NoteCard } from "~/components/NoteCard";
// import Popup from "reactjs-popup";

// export const Content: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { refetch: refetchNotes } = api.note.getAll.useQuery(undefined, {
//     enabled: sessionData?.user !== undefined,
//   });

//   const createNote = api.note.create.useMutation({
//     onSuccess: () => {
//       void refetchNotes();
//     },
//   });

//   return (
//     <Popup trigger={<button>Trigger</button>} position="right center">
//       <div>
//         <div className="mt-4 flex flex-col place-items-center">
//           <NoteCard
//             onSave={({ title, content }) => {
//               void createNote.mutate({
//                 title,
//                 content,
//               });
//             }}
//           />
//         </div>
//       </div>
//     </Popup>
//   );
// };
