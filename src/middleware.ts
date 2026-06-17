import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Domains that should serve the Ava Vale public landing page at root
const AVA_VALE_DOMAINS = ["avavaleauthor.com", "www.avavaleauthor.com"];

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  // If visiting avavaleauthor.com at root ("/"), rewrite to the Ava Vale page
  if (AVA_VALE_DOMAINS.includes(hostname) && pathname === "/") {
    return NextResponse.rewrite(new URL("/p/ava-vale", request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
