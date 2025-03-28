import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/imgs/**",
      },
    ],
  },
};

export default nextConfig;
