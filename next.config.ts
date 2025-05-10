import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "s3.eu-west-3.amazonaws.com",
        protocol: "https"
      }
    ]
  }
}

export default nextConfig
