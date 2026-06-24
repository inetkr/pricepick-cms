/**
 * @type {import('next').NextConfig}
 */

const isStaticExport = 'false';

const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,
  images: {
    unoptimized: true,
    domains: [
        'server.fansome.co.kr',
        'server-dev.fansome.biz',
        'server-stg.fansome.biz',
        'images.pexels.com',
        'fansomftp.flexcloud.co.kr',
        'fansomecdn.flexcloud.co.kr',
        'server-prod.fansome.co.kr',
        'server-prod.fansome.biz',
    ],
},
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  ...(isStaticExport === 'true' && {
    output: 'export',
  }),
};

export default nextConfig;
