// next.config.js

module.exports = {
  // eslint: {
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },
  webpack(config, { dev }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    config.module.rules.push({
      test: /\.webp$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
            outputPath: 'static/images/',
            publicPath: '/_next/static/images/',
          },
        },
      ],
    });
    return config
  },
  images: {
    unoptimized: true,
  },
  styledComponents: true,
  // basePath: '/production',
  // assetPrefix: '/production'
};