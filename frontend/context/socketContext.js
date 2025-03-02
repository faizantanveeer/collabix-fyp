"use client"; // Required for Client Components

import { createContext, useContext, useEffect, useState } from "react";
import socket from "../lib/socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on("connect", () => {
            console.log(`Connected to WebSocket: ${socket.id}`);
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
            setIsConnected(false);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
