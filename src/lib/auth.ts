import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(
            `${process.env.API_BACKENDL_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );
          const data = await res.json();
          if (res.ok && data.user) {
            return {
              ...data.user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          user: {
            id: user.id,
            email: user.email,
            photo: user.photo,
            firstName: user.firstName,
            lastName: user.lastName,
            nickname: user.nickname,
            role: user.role,
            views: user.views,
            membership: user.membership,
          },
        };
      }
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const tokenData = JSON.parse(atob(token.accessToken.split(".")[1]));
      if (tokenData.exp < currentTimestamp) {
        try {
          const response = await fetch(
            `${process.env.API_BACKENDL_URL}/api/auth/refresh`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: token.refreshToken }),
            }
          );
          const data = await response.json();
          if (response.ok) {
            token.accessToken = data.accessToken;
            token.refreshToken = data.refreshToken;
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
};
