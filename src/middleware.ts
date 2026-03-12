import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // 301 redirect www → non-www
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, "");
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher:
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
};
