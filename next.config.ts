import type { NextConfig } from "next";
import path from "node:path";
import CopyWebpackPlugin from "copy-webpack-plugin";
const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const cMapsDir = path.join(pdfjsDistPath, "cmaps");
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    // !! 警告 !!
    // 仅在你确定类型错误不会影响生产构建时才启用此选项
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: [],
    esmExternals: 'loose',  // 使用 loose 模式处理 ESM
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: '/api/:path*'
      }
    ];
  },

  // transpilePackages: ["@mxmweb/difychat"],
  env: {
    NEXT_PUBLIC_CHAT_URL: process.env.NEXT_PUBLIC_CHAT_URL,
    NEXT_PUBLIC_CHAT_TOKEN: process.env.NEXT_PUBLIC_CHAT_TOKEN,
    NEXT_PUBLIC_CHAT_MOCK: process.env.NEXT_PUBLIC_CHAT_MOCK,
    API_URL: process.env.API_URL 
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
    // 添加这些配置来解决 vite-browser-external 问题
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname, 'src'),
      },
      fallback: {
        ...config.resolve.fallback,
        'vite-browser-external': false,
      }
    };
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
