/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
    memoryBasedWorkersCount: true
  },
}

export default nextConfig 