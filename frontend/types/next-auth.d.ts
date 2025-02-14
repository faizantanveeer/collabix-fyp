import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string; 
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string; 
}
}

import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Add accessToken to Session type
  }

  interface User extends DefaultUser {
    accessToken?: string; // Add accessToken to User type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string; // Add accessToken to JWT type
  }
}

