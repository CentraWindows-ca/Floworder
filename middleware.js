// middleware.js
import { NextResponse } from "next/server";

// Map hostname → prefix
const HOST_TO_PREFIX = {
  "staging-production.centra.ca": "/orders",
  "production.centra.ca": "/orders",

  "staging-invoice.centra.ca": "/invoice",
  "invoice.centra.ca": "/invoice",

  "staging-remake.centra.ca": "/remake",
  "remake.centra.ca": "/remake",

  // local dev (with ports). We'll match using req.nextUrl.host (which includes the port).
  "localhost:1730": "/orders",
  "localhost:1731": "/invoice",
  "localhost:1732": "/remake",
};

export function middleware(req) {
  const { nextUrl } = req;

  // Use host/hostname from nextUrl (Edge-safe, no header access required)
  const hostWithPort = nextUrl.host || "";      // e.g., "localhost:1730"
  const hostnameOnly = nextUrl.hostname || "";  // e.g., "staging-production.centra.ca"

  // Prefer an exact host:port match; fall back to hostname
  const prefix =
    HOST_TO_PREFIX[hostWithPort] ?? HOST_TO_PREFIX[hostnameOnly];

    console.log(`[MW Host Debug] x-forwarded-host=${req.headers.get('x-forwarded-host')||''} | host=${req.headers.get('host')||''} | x-forwarded-proto=${req.headers.get('x-forwarded-proto')||''} | forwarded=${req.headers.get('forwarded')||''} | x-forwarded-port=${req.headers.get('x-forwarded-port')||''} | x-forwarded-server=${req.headers.get('x-forwarded-server')||''} | nextUrl.host=${req.nextUrl.host} | nextUrl.hostname=${req.nextUrl.hostname} | href=${req.nextUrl.href}`);

  if (!prefix) return NextResponse.next();

  // Avoid loops if already under the correct prefix
  const pathname = nextUrl.pathname;
  if (pathname === prefix || pathname.startsWith(prefix + "/")) {
    return NextResponse.next();
  }

  // Rewrite page routes to the prefixed path (assets/api excluded by matcher)
  const url = nextUrl.clone();
  url.pathname = prefix + (pathname === "/" ? "" : pathname);
  return NextResponse.rewrite(url);
}

// Apply to all except Next internals, API routes, and files with an extension.
export const config = {
  matcher: ["/((?!_next/|_vercel/|api/|.*\\..*).*)"],
};
