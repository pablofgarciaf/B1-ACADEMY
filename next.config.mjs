import path from 'path';
import { fileURLToPath } from 'url';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const baseConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true, // Deshabilitar optimización agresiva en Vercel
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Content-Security-Policy', value: `default-src 'self'; base-uri 'self'; frame-ancestors 'self'; object-src 'none'; form-action 'self'; img-src 'self' data: blob: https:; media-src 'self' blob:; font-src 'self' data:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://integrate.api.nvidia.com https://www.google-analytics.com https://www.googletagmanager.com; frame-src 'self' https://www.googletagmanager.com https://apis.google.com https://*.firebaseapp.com; script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://apis.google.com; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests` },
    ];
    return [
      {
        source: '/admin/:path*',
        headers: [
          ...securityHeaders,
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [...securityHeaders, { key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
      {
        source: '/((?!admin(?:/|$)|api(?:/|$)).*)',
        headers: [...securityHeaders, { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }],
      },
    ];
  },
};

export default function nextConfig(phase) {
  return {
    ...baseConfig,
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  };
}
