import { createContext, useContext } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config";

interface Context {
  socket: Socket;
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
  socket,
});

export function SocketContextProvider({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) {
  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSockets = () => useContext(SocketContext);
