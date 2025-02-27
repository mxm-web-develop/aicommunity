import { Client } from "minio";

if (!process.env.NEXT_PUBLIC_MINIO_ENDPOINT) {
  throw new Error("MinIO configuration is missing");
}
process.env.TZ = 'UTC'

export const minioClient = new Client({
  endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT!,
  port: parseInt(process.env.NEXT_PUBLIC_MINIO_PORT!),
  useSSL: process.env.NEXT_PUBLIC_MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!, // 使用服务端专用变量
  secretKey: process.env.MINIO_SECRET_KEY!,
  region: 'us-east-1' // 必须与创建bucket时的region一致
});
