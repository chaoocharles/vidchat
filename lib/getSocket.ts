import { io, Socket } from "socket.io-client";

const URL = `${process.env.NEXT_PUBLIC_SOCKET_URL}:${process.env.NEXT_PUBLIC_SOCKET_PORT}`;
const socketPath = "/api/server";
let socket: Socket;

export const getSocket = async (): Promise<Socket> => {
  if (!socket) {
    await fetch(socketPath);
    socket = io(URL, { path: socketPath });
    console.log("Socket initialized:", socket);
  }
  return socket;
};
