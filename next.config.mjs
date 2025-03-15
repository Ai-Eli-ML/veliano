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
}

export default nextConfig;
