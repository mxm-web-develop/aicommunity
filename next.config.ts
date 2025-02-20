import type { NextConfig } from "next";
import path from "node:path";
import CopyWebpackPlugin from "copy-webpack-plugin";
const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const cMapsDir = path.join(pdfjsDistPath, "cmaps");
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*"
      }
    ];
  },

  transpilePackages: ["@mxmweb/difychat"],
  env: {
    NEXT_PUBLIC_CHAT_URL: process.env.NEXT_PUBLIC_CHAT_URL,
    NEXT_PUBLIC_CHAT_TOKEN: process.env.NEXT_PUBLIC_CHAT_TOKEN,
    NEXT_PUBLIC_CHAT_MOCK: process.env.NEXT_PUBLIC_CHAT_MOCK,
    API_URL: "http://localhost:3000"
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: cMapsDir,
              to: "cmaps/"
            }
          ]
        })
      );
    }
    return config;
  }
  // experimental: {
  //   esmExternals: "loose",
  // },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/myproxy/:path*',
  //       destination: 'https://api.dify.ai/v1/:path*',
  //     },
  //   ]
  // },
};

export default nextConfig;
