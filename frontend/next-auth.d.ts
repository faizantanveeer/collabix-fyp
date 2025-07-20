// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            role: string;
        };
        accessToken: string;
    }

    interface User {
        _id?: string;
        token?: string;
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        email?: string;
        role?: string;
        accessToken?: string;
    }
}
