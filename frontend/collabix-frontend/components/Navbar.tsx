import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";


export function Navbar() {
  const { data: session, status } = useSession();
  console.log("Session Data:", session);
  console.log("Session Status:", status);

  return (
    <nav className="flex justify-between items-center p-4 shadow-lg bg-background">
      <Link href="/">
        <h1 className="text-xl font-bold">Collabix</h1>
      </Link>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex gap-4">
          <Link href='/dashboard' passHref><Button variant="ghost" >Dashboard</Button></Link>
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Pricing</Button>
          <Button variant="ghost">Contact</Button>
        </div>
        <div>
          {session ? (
            <Button
              variant="destructive"
              onClick={() => {
                signOut({ callbackUrl: "/" }); // Logs out and redirects to home
              }}
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
      </div>
    </nav>
  );
}

export default Navbar;
