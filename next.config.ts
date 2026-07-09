import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/learning-os",
  images: { unoptimized: true },
};

export default nextConfig;
