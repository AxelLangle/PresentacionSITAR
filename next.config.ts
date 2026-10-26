import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: ['192.168.100.5', 'localhost']
};

export default nextConfig;
