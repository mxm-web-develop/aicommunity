// import { NextRequest, NextResponse } from "next/server";
// import { Client } from "minio";

// const minioClient = new Client({
//   endPoint: process.env.MINIO_ENDPOINT!,
//   port: Number(process.env.MINIO_PORT),
//   useSSL: process.env.MINIO_USE_SSL === "true",
//   accessKey: process.env.MINIO_ACCESS_KEY!,
//   secretKey: process.env.MINIO_SECRET_KEY!,
// });
// function getFileCategory(mimeType: string, fileName: string): string {
//   // 首先检查 MIME 类型
//   if (mimeType.startsWith('video/')) return 'videos';
//   if (mimeType.startsWith('image/')) return 'images';
//   if (mimeType.startsWith('audio/')) return 'audios';
  
//   // 对于文档类型，可以通过文件扩展名进行更细致的判断
//   const extension = fileName.toLowerCase().split('.').pop();
  
//   switch (extension) {
//     case 'pdf':
//     case 'doc':
//     case 'docx':
//     case 'txt':
//     case 'rtf':
//       return 'documents';
//     case 'xls':
//     case 'xlsx':
//     case 'csv':
//       return 'spreadsheets';
//     case 'ppt':
//     case 'pptx':
//       return 'presentations';
//     default:
//       return 'others';
//   }
// }
// function validatePathComponent(component: string): boolean {
//   // 只允许字母、数字、下划线和横杠
//   return /^[a-zA-Z0-9_\-]+$/.test(component);
// }
// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as File;
//     const applicationId = formData.get("applicationId") as string;
//     const overwrite = formData.get("overwrite") === "true";

//     if (!file) {
//       return NextResponse.json(
//         { error: "缺少文件" },
//         { status: 400 }
//       );
//     }

//     if (!applicationId) {
//       return NextResponse.json(
//         { error: "缺少应用ID" },
//         { status: 400 }
//       );
//     }

//     // 验证 applicationId 格式
//     if (!validatePathComponent(applicationId)) {
//       return NextResponse.json(
//         { error: "应用ID格式不正确" },
//         { status: 400 }
//       );
//     }

//     // 根据文件 MIME 类型确定文件类别
//     const fileCategory = getFileCategory(file.type, file.name);

//     const objectName = `${applicationId}/${fileCategory}/${file.name}`;

//     // 确保 bucket 存在
//     const bucketExists = await minioClient.bucketExists(process.env.MINIO_BUCKET_NAME || "test");
//     if (!bucketExists) {
//       await minioClient.makeBucket(process.env.MINIO_BUCKET_NAME || "test");
//     }

//     // 上传文件
//     const buffer = Buffer.from(await file.arrayBuffer());
//     await minioClient.putObject(
//       process.env.MINIO_BUCKET_NAME || "test",
//       objectName,
//       buffer,
//       file.size,
//       { "Content-Type": file.type }
//     );

//     // 生成预签名 URL
//     const url = await minioClient.presignedGetObject(
//       process.env.MINIO_BUCKET_NAME || "test",
//       objectName,
//       24 * 60 * 60
//     );

//     return NextResponse.json({ success: true, url });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ error: "上传失败" }, { status: 500 });
//   }
// }
