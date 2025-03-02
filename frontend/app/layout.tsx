"use client";

import { SessionProvider } from "next-auth/react";
import "../styles/globals.css"; // Import global styles
import { NotificationProvider } from "../components/Notification";
import { SocketProvider } from "../context/socketContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the entire app with authentication and notifications */}
        <SessionProvider>
          <SocketProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
