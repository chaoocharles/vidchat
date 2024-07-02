import { getSocket } from "@/lib/getSocket";
import { useCallback, useEffect, useState } from "react";
import { createContext } from "react";
import { Socket, io } from "socket.io-client";

interface iSocketContext {
    socket: Socket | null
}

interface Props {
    [propName: string]: any;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = (props: Props) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const user = { id: 123 }

    console.log("onlineUsers>>", onlineUsers)

    // initialize socket
    useEffect(() => {
        const initializeSocket = async () => {
            const socketInstance = await getSocket();
            setSocket(socketInstance);
        };

        if (!socket) {
            initializeSocket();
        }

        if (socket && !isSocketConnected) {
            socket.connect();
        }

        const onConnect = () => {
            setIsSocketConnected(true);
            console.log("CONNECTED");
        };

        const onDisconnect = () => {
            setIsSocketConnected(false);
            console.log("DISCONNECTED");
        };

        if (socket) {
            socket.on("connect", onConnect);
            socket.on("disconnect", onDisconnect);
        }

        return () => {
            if (socket) {
                socket.off("connect", onConnect);
                socket.off("disconnect", onDisconnect);
            }
        };
    }, [socket, isSocketConnected]);

    useEffect(() => {
        if (!socket) return;

        console.log("here>>")
        socket.emit("addNewUser", user.id);
        socket.on("getUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getUsers");
        };
    }, [socket]);

    return (
        <SocketContext.Provider
            value={{
                socket
            }}
            {...props}
        />
    );
};
