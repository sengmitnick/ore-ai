import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const TOKEN = "ore-ai_token";

export async function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get(TOKEN)?.value;

  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (pathname === "/home" && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home"],
};
