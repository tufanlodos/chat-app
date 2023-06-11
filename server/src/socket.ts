import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";

const EVENTS = {
  CONNECTION: "connection",
  EXISTING_ROOMS: "existing_rooms",
  CREATE_ROOM: "create_room",
  JOIN_ROOM: "join_room",
  JOINED_ROOM: "joined_room",
};

const rooms: Record<string, { name: string }> = {};

export default function socket({ io }: { io: Server }) {
  io.on(EVENTS.CONNECTION, (socket: Socket) => {
    console.log(`User connected ${socket.id}`);

    socket.emit(EVENTS.EXISTING_ROOMS, rooms);

    socket.on(EVENTS.CREATE_ROOM, (roomName: string) => {
      const roomId = nanoid();
      rooms[roomId] = { name: roomName };

      // broadcast to all sockets including the one that initiated the event:
      socket.emit(EVENTS.EXISTING_ROOMS, rooms);
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
  });
}
