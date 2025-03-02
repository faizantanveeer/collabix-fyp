"use client";

import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  message: string;
  // add other notification fields you need
}

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
      setSocket(newSocket);

      newSocket.emit("joinRoom", session.user.id);

      // Listen for new notifications
      newSocket.on("newNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [session?.user?.id]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
