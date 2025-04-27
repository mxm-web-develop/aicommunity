import { NextRequest, NextResponse } from "next/server";
import { minioClient } from "@/db/minio/instant";

// 添加日志记录
function log(...args: any[]) {
  console.log("[Upload API]", ...args);
}

function validatePathComponent(component: string): boolean {
  // 只允许字母、数字、下划线和横杠
  return /^[a-zA-Z0-9_\-]+$/.test(component);
}

// 设置 bucket 的 public 访问策略
async function setBucketPublicPolicy(bucketName: string) {
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          AWS: ['*']
        },
        Action: [
          's3:GetBucketLocation',
          's3:ListBucket',
          's3:GetObject'
        ],
        Resource: [
          `arn:aws:s3:::${bucketName}`,
          `arn:aws:s3:::${bucketName}/*`
        ]
      }
    ]
  };
  
  await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
}

const ASSETS_BUCKET = 'assets'; // 统一的静态资源 bucket
const BANNER_PATH = 'banners/'; // banner 存储路径
const MAX_BANNER_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_BANNER_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    log("开始处理上传请求");
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const applicationId = formData.get("applicationId") as string;
    const isBanner = formData.get("isBanner") === 'true';

    log("请求参数:", { 
      fileName: file?.name, 
      fileType: file?.type,
      fileSize: file?.size,
      applicationId,
      isBanner 
    });

    if (!file) {
      return NextResponse.json(
        { error: "缺少文件" },
        { status: 400 }
      );
    }

    // 只有不是 banner 上传时才校验 applicationId
    if (!isBanner) {
        if (!applicationId) {
            return NextResponse.json(
                { error: "缺少应用ID" },
                { status: 400 }
            );
        }
        if (!validatePathComponent(applicationId)) {
            return NextResponse.json(
                { error: "应用ID格式不正确" },
                { status: 400 }
            );
        }
    }

    // Banner 图片的特殊处理
    if (isBanner) {
      // 验证文件类型
      if (!ALLOWED_BANNER_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Banner只支持JPG、PNG、GIF和WebP格式" },
          { status: 400 }
        );
      }

      // 验证文件大小
      if (file.size > MAX_BANNER_SIZE) {
        return NextResponse.json(
          { error: "Banner图片大小不能超过5MB" },
          { status: 400 }
        );
      }

      try {
        // 确保 assets bucket 存在
        const assetsBucketExists = await minioClient.bucketExists(ASSETS_BUCKET);
        if (!assetsBucketExists) {
          log("创建 assets bucket");
          await minioClient.makeBucket(ASSETS_BUCKET);
          await setBucketPublicPolicy(ASSETS_BUCKET);
        }

        // 生成唯一的文件名（使用时间戳和随机数）
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop();
        const fileName = `${timestamp}-${random}.${extension}`;
        
        // banner 完整路径
        const objectName = `${BANNER_PATH}${fileName}`;
        
        // 上传文件
        const buffer = Buffer.from(await file.arrayBuffer());
        await minioClient.putObject(
          ASSETS_BUCKET,
          objectName,
          buffer,
          file.size,
          { "Content-Type": file.type }
        );

        log("Banner上传成功:", objectName);

        console.log(`${process.env.NEXT_PUBLIC_MINIO_PROTOCOL}://${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}:${process.env.NEXT_PUBLIC_MINIO_PORT}/${ASSETS_BUCKET}/${objectName}`)
        // 返回banner URL
        const publicUrl = `${process.env.NEXT_PUBLIC_MINIO_PROTOCOL}://${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}:${process.env.NEXT_PUBLIC_MINIO_PORT}/${ASSETS_BUCKET}/${objectName}`;
        return NextResponse.json({ 
          success: true, 
          url: publicUrl,
          bucket: ASSETS_BUCKET,
          path: objectName
        });
      } catch (error: any) {
        log("Banner上传错误:", error);
        return NextResponse.json(
          { 
            error: "Banner上传失败",
            details: error.message || error.code || "未知错误"
          },
          { status: 500 }
        );
      }
    }

    // 普通文件上传逻辑（使用应用自己的 bucket）
    const bucketName = applicationId;

    try {
      log("检查 bucket 是否存在:", bucketName);
      const bucketExists = await minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        log("创建新的 bucket:", bucketName);
        await minioClient.makeBucket(bucketName);
        await setBucketPublicPolicy(bucketName);
      }
    } catch (error: any) {
      log("Bucket 操作错误:", error);
      return NextResponse.json(
        { 
          error: "Bucket 操作失败",
          details: error.message || error.code || "未知错误"
        },
        { status: 500 }
      );
    }

    try {
      log("开始上传文件:", { bucketName, fileName: file.name, fileType: file.type });
      const buffer = Buffer.from(await file.arrayBuffer());
      await minioClient.putObject(
        bucketName,
        file.name,
        buffer,
        file.size,
        { "Content-Type": file.type }
      );
      log("文件上传成功");
    } catch (error: any) {
      log("文件上传错误:", error);
      return NextResponse.json(
        { 
          error: "文件上传失败",
          details: error.message || error.code || "未知错误"
        },
        { status: 500 }
      );
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_MINIO_PROTOCOL}://${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}:${process.env.NEXT_PUBLIC_MINIO_PORT}/${bucketName}/${file.name}`;
    log("生成公共访问URL:", publicUrl);

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      bucket: bucketName,
      path: file.name
    });
    
  } catch (error: any) {
    log("处理请求时发生错误:", error);
    return NextResponse.json(
      { 
        error: "上传失败",
        details: error.message || error.code || "未知错误"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "缺少文件URL" }, { status: 400 });
    }

    // 解析 bucket 和 objectName
    const match = url.match(/https?:\/\/[^/]+\/([^/]+)\/(.+)/);
    if (!match) {
      return NextResponse.json({ error: "URL格式不正确" }, { status: 400 });
    }
    const bucket = match[1];
    const objectName = match[2];

    // 删除文件
    await minioClient.removeObject(bucket, objectName);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "删除失败", details: error.message || error.code || "未知错误" },
      { status: 500 }
    );
  }
}
