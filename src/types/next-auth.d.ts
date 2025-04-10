import { DefaultSession, DefaultUser } from "next-auth";
import { UserClient, View } from "./user.types";
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    refreshToken: string;
    error?: string;
    user: UserClient & DefaultSession["user"];
  }
  interface User extends DefaultUser, UserClient {
    accessToken: string;
    refreshToken: string;
    id: string;
    email: string;
    photo?: string;
    nickname?: string;
    role: {
      id: number;
      code: string;
      name: string;
    };
    views: View[];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    error?: string;
    user: UserClient;
    error?: string;
  }
}
