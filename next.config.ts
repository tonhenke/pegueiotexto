import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**/*": ["./data/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/termos",
        destination: "/termos-de-uso",
        permanent: true,
      },
      {
        source: "/blog/transcricao-de-audio-como-funciona-guia-completo",
        destination: "/blog/transcricao-de-audio",
        permanent: true,
      },
      {
        source: "/blog/tiktok-video-download",
        destination: "/blog/baixar-video-tiktok",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
