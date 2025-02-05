"use client"

import { SessionProvider } from "next-auth/react";
import "../styles/globals.css"; // Import global styles if needed

export default function RootLayout({
  children,
  // you can access the session if needed here
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the app with SessionProvider */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
