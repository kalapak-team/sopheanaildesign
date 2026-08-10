import type { NextConfig } from "next";

const r2PublicHost = process.env.NEXT_PUBLIC_R2_HOST?.replace(/^https?:\/\//, "").split("/")[0];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
      { protocol: "http", hostname: "localhost", port: "8000" },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      // Cloudflare R2 public bucket (*.r2.dev)
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      ...(r2PublicHost
        ? [
            {
              protocol: "https" as const,
              hostname: r2PublicHost,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
