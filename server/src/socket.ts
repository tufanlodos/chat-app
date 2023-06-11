import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";

const EVENTS = {
  CONNECTION: "connection",
  ROOMS: "rooms",
  CREATE_ROOM: "create_room",
  JOIN_ROOM: "join_room",
  JOINED_ROOM: "joined_room",
  SEND_ROOM_MESSAGE: "send_room_message",
  ROOM_MESSAGE: "room_message",
};

const rooms: Record<string, { name: string }> = {};

export default function socket({ io }: { io: Server }) {
  io.on(EVENTS.CONNECTION, (socket: Socket) => {
    console.log(`User connected ${socket.id}`);

    io.emit(EVENTS.ROOMS, rooms);

    socket.on(EVENTS.CREATE_ROOM, (roomName: string) => {
      const roomId = nanoid();
      rooms[roomId] = { name: roomName };

      // broadcast to all sockets including the one that initiated the event:
      io.emit(EVENTS.ROOMS, rooms);
      // join the room:
      socket.join(roomId);
      // emit event back the room creator with the room id:
      socket.emit(EVENTS.JOINED_ROOM, roomId);
    });

    socket.on(EVENTS.JOIN_ROOM, (roomId) => {
      // join the room:
      socket.join(roomId);
      // emit event back the room joiner with the room id:
      socket.emit(EVENTS.JOINED_ROOM, roomId);
    });

    socket.on(EVENTS.SEND_ROOM_MESSAGE, ({ roomId, message, username }) => {
      const date = new Date();
      const messageId = nanoid();

      io.in(roomId).emit(EVENTS.ROOM_MESSAGE, {
        id: messageId,
        username,
        message,
        time: `${date.getHours().toString().padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      });
    });
  });
}
