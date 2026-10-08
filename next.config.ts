
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": [
      "./generated/prisma/**/*",
      "./node_modules/.prisma/client/**/*",
    ],
  },
};

export default nextConfig;
