// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable styled-components transform in SWC
  compiler: {
    styledComponents: true,
  },

  // You said Image Optimization is not needed
  images: {
    unoptimized: true,
  },

  webpack(config) {
    // Import SVGs as React components
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    // Emit .webp files via webpack 5 asset modules
    config.module.rules.push({
      test: /\.webp$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/images/[name].[contenthash][ext]',
      },
    });

    return config;
  },

  // async rewrites() {
  //   const HOST_TO_PREFIX = {
  //     'staging-production.centra.ca': '/orders',
  //     'production.centra.ca': '/orders',

  //     'staging-invoice.centra.ca': '/invoice',
  //     'invoice.centra.ca': '/invoice',

  //     'staging-remake.centra.ca': '/remake',
  //     'remake.centra.ca': '/remake',

  //     // local dev with ports
  //     'localhost:1730': '/orders',
  //     'localhost:1731': '/invoice',
  //     'localhost:1732': '/remake',
  //   };

  //   const before = [];
  //   const after = [];

  //   for (const [host, prefix] of Object.entries(HOST_TO_PREFIX)) {
  //     // Root → /prefix (only when the host matches)
  //     before.push({
  //       source: '/',
  //       has: [{ type: 'host', value: host }],
  //       destination: `${prefix}`,
  //     });

  //     // Any non-existing path → /prefix/:path* (host-specific)
  //     // Placed in afterFiles so that real files like /_next/*, /public/*, or
  //     // already-prefixed routes (e.g. /orders/*) resolve first and are NOT rewritten.
  //     after.push({
  //       source: '/:path*',
  //       has: [{ type: 'host', value: host }],
  //       destination: `${prefix}/:path*`,
  //     });
  //   }

  //   return {
  //     beforeFiles: before,
  //     afterFiles: after,
  //     fallback: [],
  //   };
  // },
};

module.exports = nextConfig;
