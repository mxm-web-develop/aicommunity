import type { NextConfig } from "next";
import path from "node:path";
import url from 'url';

import CopyWebpackPlugin from "copy-webpack-plugin";
const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const cMapsDir = path.join(pdfjsDistPath, "cmaps");

// 解析MinIO URL
const minioUrl = process.env.NEXT_PUBLIC_MINIO_BASE_URL 
  ? new URL(process.env.NEXT_PUBLIC_MINIO_BASE_URL)
  : null;

// 获取协议，确保类型正确
const getProtocol = (url: URL | null): 'http' | 'https' => {
  if (!url) return 'http';
  return url.protocol === 'https:' ? 'https' : 'http';
};

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  env: {
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  },
  // 配置允许的图片域名
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || '',
        port: process.env.NEXT_PUBLIC_MINIO_PORT || '',
        pathname: '/assets/**'
      }
    ]
  },
  // 确保静态资源路径正确
  typescript: {
    // !! 警告 !!
    // 仅在你确定类型错误不会影响生产构建时才启用此选项
    ignoreBuildErrors: true
  },
  experimental: {},
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*"
      }
    ];
  },

  // transpilePackages: ["@mxmweb/difychat"],

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
        "@": require("path").resolve(__dirname, "src")
      },
      fallback: {
        ...config.resolve.fallback,
        "vite-browser-external": false
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
