/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip type checking during production build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable static exports for pages using client-side features
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Use the new JSX transform
  reactStrictMode: true,
  experimental: {
    // Add any experimental features you need here
  },
}

export default nextConfig;
