import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_EVENTS, SOCKET_URL } from "../config";
import { useUserContext } from "./UserContext";

type Message = { id: string; username: string; message: string; time: string };

interface Context {
  socket: Socket;
  rooms: Record<string, { name: string }>;
  onCreateRoom: (name: string) => void;
  selectedRoomId: string;
  onJoinRoom: (id: string) => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
  socket,
  rooms: {},
  onCreateRoom: () => {},
  selectedRoomId: "",
  onJoinRoom: () => {},
  messages: [],
  onSendMessage: () => {},
});

export function SocketContextProvider({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) {
  const { username } = useUserContext();
  const [rooms, setRooms] = useState<Record<string, { name: string }>>({});
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    window.onfocus = function () {
      document.title = "Chat app";
    };

    socket.on(SOCKET_EVENTS.ROOMS, (value) => {
      setRooms(value);
    });

    socket.on(SOCKET_EVENTS.JOINED_ROOM, (value) => {
      setSelectedRoomId(value);
    });

    socket.on(SOCKET_EVENTS.ROOM_MESSAGE, (value) => {
      if (!document.hasFocus()) {
        document.title = "New messages!";
      }

      setMessages((messages) => [...messages, value]);
    });

    return () => {
      socket.off(SOCKET_EVENTS.ROOMS);
      socket.off(SOCKET_EVENTS.JOINED_ROOM);
      socket.off(SOCKET_EVENTS.ROOM_MESSAGE);
    };
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [selectedRoomId]);

  const onCreateRoom = (name: string) => {
    if (!name.trim()) return;
    socket.emit(SOCKET_EVENTS.CREATE_ROOM, name);
  };

  const onJoinRoom = (id: string) => {
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, id);
  };

  const onSendMessage = (message: string) => {
    if (!message.trim()) return;
    socket.emit(SOCKET_EVENTS.SEND_ROOM_MESSAGE, {
      roomId: selectedRoomId,
      message,
      username,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        rooms,
        onCreateRoom,
        selectedRoomId,
        onJoinRoom,
        messages,
        onSendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);
