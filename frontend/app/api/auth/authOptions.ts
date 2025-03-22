import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions, User } from "next-auth";

interface ExtendedUser extends User {
  _id?: string;
  token?: string;
  role?: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
            credentials: "include",
          });

          const user = await res.json();

          if (!res.ok || !user._id) {
            console.error("Auth Error:", user.message || "Invalid credentials");
            return null;
          }

          return user as ExtendedUser;
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // ✅ Google OAuth
      if (account?.provider === "google" && profile?.email) {
        try {
          const res = await fetch("http://localhost:5000/auth/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: profile.name,
              email: profile.email,
              image: profile.picture,
              googleId: profile.sub,
            }),
          });
    
          const data = await res.json();
    
          if (res.ok && data.user) {
                
            token.id = data.user._id;
            token.email = data.user.email;
            token.role = data.user.role || "influencer";
            token.accessToken = data.token; // ✅ Set accessToken from response
          } else {
            console.error("❌ Google user saving failed:", data);
          }
    
          // console.log("Google login backend response:", data);
        } catch (err) {
          console.error("Google login error:", err);
        }
      }
    
      // ✅ Credentials Login
      if (user && '_id' in user) {
        const u = user as ExtendedUser;
    
        
    
        token.id = u._id;
        token.email = u.email;
        token.role = u.role || "influencer";
        token.accessToken = u.token || token.accessToken; // keep fallback
      }
    
      return token;
    },
    

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.role = (token.role as string) || "influencer";
      session.accessToken = token.accessToken;
    
      // console.log("JWT Token:", token);
      // console.log("Session:", session);
    
      return session;
    },
  },
};

export default authOptions;
