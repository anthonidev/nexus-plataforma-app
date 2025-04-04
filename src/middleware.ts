import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === "/auth/login";
    const isRegisterPage = req.nextUrl.pathname.startsWith("/register");

    // Permitir acceso a la página de registro independientemente del estado de autenticación
    if (isRegisterPage) {
      return NextResponse.next();
    }

    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (!isAuthPage && !isAuth) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|imgs/.*|register/).*)",
  ],
};
