import { Server, Socket } from "socket.io";

const EVENTS = {
  connection: "connection",
};

const rooms: Record<string, { name: string }> = {};

export default function socket({ io }: { io: Server }) {
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`User connected ${socket.id}`);
  });
}
