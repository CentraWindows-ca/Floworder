// middleware.js
import { NextResponse } from "next/server";

const APPLICATIONS = {
  "staging-production": {
    prefix: "/orders",
    name: "Production",
  },
  production: {
    prefix: "/orders",
    name: "Production",
  },
  "staging-invoice": {
    prefix: "/invoice",
    name: "Invoice",
  },
  invoice: {
    prefix: "/invoice",
    name: "Invoice",
  },
};

// Map hostname → prefix
const HOST_TO_APP = {
  "staging-production": APPLICATIONS["staging-production"],
  production: APPLICATIONS["production"],

  "staging-invoice": APPLICATIONS["staging-invoice"],
  invoice: APPLICATIONS["invoice"],

  // local dev (with ports). We'll match using req.nextUrl.host (which includes the port).
  "localhost:1730": APPLICATIONS["staging-production"],
  "localhost:1731": APPLICATIONS["staging-invoice"],
};

export function middleware(req) {
  const { nextUrl } = req;

  // Use host/hostname from nextUrl (Edge-safe, no header access required)
  const hostWithPort = nextUrl.host || ""; // e.g., "localhost:1730"

  const subdomain = _getSubdomain(req);

  const app = HOST_TO_APP[subdomain] ?? HOST_TO_APP[hostWithPort];
  // Prefer an exact host:port match; fall back to hostname
  const prefix = app?.prefix;

  if (!prefix) return NextResponse.next();

  // Avoid loops if already under the correct prefix
  const pathname = nextUrl.pathname;
  if (pathname === prefix || pathname.startsWith(prefix + "/")) {
    return NextResponse.next();
  }

  // Rewrite page routes to the prefixed path (assets/api excluded by matcher)
  const url = nextUrl.clone();
  url.pathname = prefix + (pathname === "/" ? "" : pathname);

  const res = NextResponse.rewrite(url);
  const appName = app.name;
  if (appName) res.cookies.set("APP_NAME", appName, { path: "/" });
  return res;
}

// Apply to all except Next internals, API routes, and files with an extension.
export const config = {
  matcher: ["/((?!_next/|_vercel/|api/|.*\\..*).*)"],
};

// _getSubdomain(req)
// Rules:
// - If host is "localhost" (with or without port), return it AS-IS, keeping the port if present (e.g., "localhost:1730").
// - For Internet-style hostnames (dot-separated), return the left-most label (the smallest-level domain), e.g.:
//     "aaa.com.cn"            -> "aaa"
//     "aaa.bbb.com"           -> "aaa"
//     "ccc.aaa.bbb.com.cn"    -> "ccc"
// - Ignore IP hosts (e.g., "127.0.0.1", "::1") -> return "".
// - Prefer X-Forwarded-Host; fallback to Host. If multiple values, take the first. Port is only kept for localhost.
function _getSubdomain(req) {
  // Prefer forwarded host (from proxy), fallback to direct host
  let rawHost =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  if (!rawHost) return "";

  // If multiple proxies added a chain "a,b,c", take the first
  rawHost = rawHost.split(",")[0].trim().toLowerCase();

  // Keep full value (including port) for localhost
  if (rawHost.startsWith("localhost")) {
    return rawHost; // e.g., "localhost:1730" or "localhost"
  }

  // Strip trailing port for domain processing (e.g., "example.com:443" -> "example.com")
  const hostNoPort = rawHost.replace(/:\d+$/, "");

  // Ignore IPs (IPv4), per requirement
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostNoPort)) return "";

  // Ignore IPv6 or bracketed hosts (not dot-separated)
  if (hostNoPort.includes(":") || hostNoPort.startsWith("[")) return "";

  // Dot-separated Internet hostname: return the left-most label
  const labels = hostNoPort.split(".").filter(Boolean);
  return labels.length ? labels[0] : "";
}
