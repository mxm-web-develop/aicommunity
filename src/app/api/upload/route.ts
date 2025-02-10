import { NextRequest, NextResponse } from "next/server";
import { Client } from "minio";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "没有文件" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const bucketName = process.env.MINIO_BUCKET_NAME || "test";
    const objectName = `${Date.now()}-${file.name}`;

    // 确保 bucket 存在
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName);
    }

    // 上传文件
    await minioClient.putObject(
      bucketName,
      objectName,
      Buffer.from(buffer),
      file.size,
      { "Content-Type": file.type }
    );

    // 生成预签名 URL
    const url = await minioClient.presignedGetObject(
      bucketName,
      objectName,
      24 * 60 * 60
    );

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
