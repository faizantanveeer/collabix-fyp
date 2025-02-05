import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

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
          });
      
          const user = await res.json();
          console.log("Backend User Response:", user);  // Log the user response from backend
      
          if (!res.ok) throw new Error(user.error || "Invalid credentials");
      
          return user ? { id: user.id, email: user.email, token: user.token } : null;
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      }
      ,
    }),
  ],
  pages: {
    signIn: "/login", // Customize the route for the login page
    error: "/auth/error", // Customize the route for handling errors
  },
  session: {
    strategy: "jwt", // Use JWT for stateless authentication
    maxAge: 24 * 60 * 60, // Set session expiry if required
  },
  callbacks: {
    async jwt({ token, user }) {
        if (user) {
         
          token.id = user.id;
          token.email = user.email;
          token.token = user.token;
        }
        
        return token;
      }
      ,
      async session({ session, token }) {
    
        session.user = token;  // Attach the user data from the token to the session
    
        return session;
      },
  },
  redirect: async (url, baseUrl) => {
    return baseUrl + "/dashboard"; // Customize the redirect after successful login
  },
};

export default authOptions;
