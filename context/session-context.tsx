import { useStorageState } from "@/hooks/useStorageState";
import { router } from "expo-router";
import { createContext, PropsWithChildren, useContext } from "react";

interface IUserSession {
  isLoading: boolean;
  session: string | null;
  signIn: (username: string, password: string) => Promise<void>;
}

const SessionContext = createContext<IUserSession>({
  signIn: async (username: string, password: string) => {},
  isLoading: true,
  session: null,
});

const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, session], setSession] = useStorageState("session");

  const signIn = async (username: string, password: string) => {
    try {
      const response = await fetch("https://soal.staging.id/oauth/token", {
        body: JSON.stringify({
          grant_type: "password",
          username: username,
          password: password,
          client_id: "e78869f77986684a",
          client_secret: "0a40f69db4e5fd2f4ac65a090f31b823",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setSession(JSON.stringify(data));
        console.log(session);
        router.replace("/");
      } else {
        setSession(null);
      }
    } catch (error) {
      console.log("error");
      setSession(null);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        isLoading,
        session,
        signIn: signIn,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

const useSessionContext = () => {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
};

export { SessionProvider, IUserSession, useSessionContext };
