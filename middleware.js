import { NextResponse } from "next/server";

const HOST_TO_PREFIX = {
  'staging-production.centra.ca': '/orders',
  'production.centra.ca': '/orders',
  'localhost:1730': '/orders',
  
  'staging-invoice.centra.ca': '/invoice',
  'invoice.centra.ca': '/invoice',
  'localhost:1731': '/invoice',

  'staging-remake.centra.ca': '/remake',
  'remake.centra.ca': '/remake',
  'localhost:1732': '/remake',
};

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const prefix = HOST_TO_PREFIX[host];

  // Host not managed -> pass through
  if (!prefix) return NextResponse.next();

  // Already under the correct prefix -> avoid loops
  if (url.pathname === prefix || url.pathname.startsWith(prefix + '/')) {
    return NextResponse.next();
  }

  // Rewrite only page routes (matcher already excludes assets & /api)
  url.pathname = prefix + (url.pathname === '/' ? '' : url.pathname);
  return NextResponse.rewrite(url);
}

// Run middleware on all paths EXCEPT:
// - Next internals: /_next/*, /_vercel/*
// - API routes: /api/*
// - Any path containing a dot (likely a static file from /public: .css, .js, .png, etc.)
export const config = {
  matcher: [
    '/((?!_next/|_vercel/|api/|.*\\..*).*)',
  ],
};
