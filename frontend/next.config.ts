import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8147";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
};

export default nextConfig;
