import { NextResponse } from "next/server";
import { Server as SocketServer, Socket } from "socket.io";
import { createServer } from "http";

let io: SocketServer;

export async function GET(req: Request) {
  if (io) {
    console.log("Socket.IO server already started");
    return NextResponse.json({ success: true }, { status: 200 });
  } else {
    const httpServer = createServer();
    let onlineUsers: { userId: string; socketId: string }[] = [];

    io = new SocketServer(httpServer, {
      path: "/api/server",
      cors: {
        origin: `${process.env.NEXT_APP_URL}:${process.env.NEXT_APP_PORT}`,
      },
    });

    io.on("connection", (socket: Socket) => {
      // add user
      socket.on("addNewUser", (userId) => {
        console.log("data>>", userId);
        !onlineUsers.some((user) => user.userId === userId) &&
          onlineUsers.push({
            userId,
            socketId: socket.id,
          });

        console.log("Connected Users:", onlineUsers);

        // send active users
        io.emit("getUsers", onlineUsers);
      });

      socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected:", onlineUsers);

        // send active users
        io.emit("getUsers", onlineUsers);
      });
    });

    // Starting the server and returning a response immediately
    httpServer.listen(process.env.NEXT_PUBLIC_SOCKET_PORT, () => {
      console.log("Socket.IO server started");
    });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
