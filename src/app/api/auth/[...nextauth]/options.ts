import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

/**
 * NextAuth.js Credentials Provider
 * 
 * This provider allows users to sign in by providing their email and
 * password directly. Credentials are validated through the User model
 * and the hashed password is compared to the stored password hash.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect("AnonSync");
        try {
          // Find user by email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("User not found");
          }

          // Make sure user is verified
          if (!user.isVerified) {
            throw new Error("User not verified");
          }

          // Compare provided password with stored hash
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          // If everything is correct, return user
          return user;
        } catch (error: any) {
          // If there was an error, throw it
          throw new Error(error);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

      async session({ session, token }) {
        
          if (token) {
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
            session.user.username = token.username;
          }
          
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
