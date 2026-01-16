/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  // Explicitly define environment variables for build-time embedding
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
  },
  // Disable linting and type checking during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'picsum.photos', 'localhost', 'printoscar.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'printoscar.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'printoscar.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/wp-content/**',
      },
    ],
  },
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production'
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || (isProd ? 'https://printoscarapi.xendekweb.com/api' : 'http://localhost:5001/api')
    let apiOrigin = apiUrl
    try {
      const url = new URL(apiUrl)
      apiOrigin = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`
    } catch {
      if (apiOrigin.endsWith('/api')) {
        apiOrigin = apiOrigin.replace(/\/api$/, '')
      }
    }

    return [
      {
        source: '/uploads/:path*',
        destination: `${apiOrigin}/uploads/:path*`,
      },
      {
        source: '/productImages/uploads/:path*',
        destination: `${apiOrigin}/uploads/productImages/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
