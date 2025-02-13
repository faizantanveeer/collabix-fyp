import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Loader2 } from "lucide-react"; // Import an animated loader

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 shadow-lg bg-background">
      <Link href="/">
        <h1 className="text-xl font-bold">Collabix</h1>
      </Link>

      <div className="flex items-center gap-4">
        {/* Main Navigation Links */}
        <div className="hidden md:flex gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Button variant="ghost">Influencers</Button>
          <Button variant="ghost">Businesses</Button>
          <Button variant="ghost">Contact</Button>
        </div>

        {/* Authentication Buttons with Smooth UX */}
        {status === "loading" ? (
          <Button variant="outline" disabled>
            <Loader2 className="animate-spin h-5 w-5" /> {/* Subtle Loading Spinner */}
          </Button>
        ) : session ? (
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Log Out
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
