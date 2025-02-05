import NextAuth from "next-auth";
import authOptions from "../authOptions"; // Ensure correct import

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
