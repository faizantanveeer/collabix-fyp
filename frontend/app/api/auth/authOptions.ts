import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import Cookies from "js-cookie";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
            credentials: "include", // ✅ Allows sending/receiving cookies  
          });

          const user = await res.json();

          if (!res.ok || !user.id) {
            console.error("Auth Error:", user.message || "Invalid credentials");
            return null;
          }

          // console.log("Login response:", user); 

           // ✅ Store the token in cookies
          Cookies.set("token", user.token, {
            expires: 7, // Expires in 7 days
            secure: true, // Set to true in production (HTTPS)
            sameSite: "Strict",
            path: "/", // Available on all pages
          });


          // console.log('User:', user);
          // console.log('User Token from Backend:', user.token);
          return user; // Ensure user object includes `role`
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.token || undefined; 
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.accessToken = token.accessToken || undefined;

      // console.log("Session:", session);
      return session;
    },
  },
};

export default authOptions;
