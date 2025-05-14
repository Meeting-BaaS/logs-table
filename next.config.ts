import type { NextConfig } from "next"

if (!process.env.API_SERVER_BASEURL) {
  throw new Error(
    "API_SERVER_BASEURL is not defined in the environment variables. Please set it in your .env file."
  )
}

const nextConfig: NextConfig = {
  async rewrites() {
    const apiServerBaseUrl = process.env.API_SERVER_BASEURL
    return [
      {
        source: "/api/logs",
        destination: `${apiServerBaseUrl}/bots/all`
      },
      {
        source: "/api/retry-webhook",
        destination: `${apiServerBaseUrl}/bots/retry_webhook`
      },
      {
        source: "/api/bots/:bot_uuid/screenshots",
        destination: `${apiServerBaseUrl}/bots/:bot_uuid/screenshots`
      }
    ]
  },
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
