import type { NextConfig } from "next";

// Set only while previewing on the GitHub Pages project URL. Unset once the
// real domain is cut over, since the site will then serve from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
