/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  // 🔒 Hide readable source maps (prevents exposed .map files)
  productionBrowserSourceMaps: false,
  // 🔒 Ensure code is fully minified and obfuscated
  swcMinify: true,
  // 🔐 Add extra security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Permissions-Policy", value: "camera=(), microphone=()" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; connect-src 'self' https://infinitask.click http://localhost:8000; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src * blob: data:;",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
