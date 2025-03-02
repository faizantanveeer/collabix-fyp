"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css"; // Import global styles



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
          
            {children} <Toaster richColors position="top-center" /> 
          
        </SessionProvider>
      </body>
    </html>
  );
}
