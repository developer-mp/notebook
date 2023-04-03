import { signIn, signOut, useSession } from "next-auth/react";

export const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex bg-blue-900 text-white">
      <div className="ml-5 flex-1 p-2 text-lg font-bold">
        {sessionData?.user?.name ? `Notebook of ${sessionData.user.name}` : ""}
      </div>
      <div className="mr-5 flex text-sm">
        {sessionData?.user ? (
          <button onClick={() => void signOut()}>Sign out</button>
        ) : (
          <button onClick={() => void signIn()}>Sign in</button>
        )}
      </div>
    </div>
  );
};
