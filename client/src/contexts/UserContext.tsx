import { createContext, useContext, useEffect, useState } from "react";
import { LOCAL_STORAGE_USERNAME_KEY } from "../config";

interface Context {
  username: string;
  setUsername: (username: string) => void;
}

const UserContext = createContext<Context>({
  username: "",
  setUsername: () => {},
});

export function UserContextProvider({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const username = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
    if (username) {
      setUsername(username);
    }
  }, []);

  const onUsernameChange = (username: string) => {
    localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, username);
    setUsername(username);
  };

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername: onUsernameChange,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
