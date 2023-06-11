import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import socket from "./socket";
import { version } from "../package.json";

const CORS_ORIGIN = "http://localhost:3000";
const HOST = "localhost";
const PORT = 4000;

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
});

app.get("/", (_, res) =>
  res.send(`Server version ${version} is up and running`)
);

httpServer.listen(PORT, HOST, () => {
  console.log(
    `🚀 Server version ${version} is listening http://${HOST}:${PORT} 🚀`
  );
  socket({ io });
});
