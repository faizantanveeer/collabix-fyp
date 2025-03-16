import Providers from "./provider";
import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css"; // Import global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers> {/* Wrap with Providers */}
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
