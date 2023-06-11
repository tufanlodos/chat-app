import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_EVENTS, SOCKET_URL } from "../config";

interface Context {
  socket: Socket;
  rooms: Record<string, { name: string }>;
  onCreateRoom: (name: string) => void;
  selectedRoomId: string;
  onJoinRoom: (id: string) => void;
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
  socket,
  rooms: {},
  onCreateRoom: () => {},
  selectedRoomId: "",
  onJoinRoom: () => {},
});

export function SocketContextProvider({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) {
  const [rooms, setRooms] = useState<Record<string, { name: string }>>({});
  const [selectedRoomId, setSelectedRoomId] = useState("");

  useEffect(() => {
    socket.on(SOCKET_EVENTS.EXISTING_ROOMS, (value) => {
      setRooms(value);
    });

    socket.on(SOCKET_EVENTS.JOINED_ROOM, (value) => {
      setSelectedRoomId(value);
    });

    return () => {
      socket.off(SOCKET_EVENTS.EXISTING_ROOMS);
      socket.off(SOCKET_EVENTS.JOINED_ROOM);
    };
  }, []);

  const onCreateRoom = (name: string) => {
    if (!name.trim()) return;
    socket.emit(SOCKET_EVENTS.CREATE_ROOM, name);
  };

  const onJoinRoom = (id: string) => {
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, id);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        rooms,
        onCreateRoom,
        selectedRoomId,
        onJoinRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);
