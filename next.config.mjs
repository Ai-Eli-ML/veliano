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
  // Configure for production
  experimental: {
    // Suppress client-side navigation bailout warnings
    missingSuspenseWithCSRBailout: false
  },
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
}

export default nextConfig;
