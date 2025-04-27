import { NextRequest, NextResponse } from 'next/server';
import https from 'node:https';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/db/mongo/connect';

// 创建忽略证书验证的HTTPS代理
const agent = new https.Agent({
  rejectUnauthorized: false
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, fileId: string } }
) {
  try {
    const isLocalServer = process.env.NEXT_PUBLIC_LOCAL_SERVER !== 'true';
    const minioEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT;
    const minioPort = process.env.NEXT_PUBLIC_MINIO_PORT;

    // 1. 获取参数
    const bucketId = params.id;
    const encodedFileName = params.fileId;
    let fileName = decodeURIComponent(encodedFileName);
    fileName = fileName.replace(/^\//, '');
    fileName = fileName.replace(`${bucketId}/`, '');

    // 2. 查询 MongoDB，校验 assets
    await connectToDatabase();
    const app = await mongoose.connection.db.collection('applications').findOne({ _id: new ObjectId(bucketId) });
    if (!app) {
      return new NextResponse('应用不存在', { status: 404 });
    }
    if (!app.assets || !Array.isArray(app.assets) || !app.assets.includes(fileName)) {
      return new NextResponse('文件未授权', { status: 403 });
    }

    // 3. 拼接 MinIO 文件 URL
    const questUrl =  isLocalServer 
      ? `https://developer.gientech.com/files/${bucketId}/${fileName}` 
      : `http://${minioEndpoint}:${minioPort}/${bucketId}/${fileName}`;

    // 4. 请求文件（使用agent忽略证书验证）
    const response = await fetch(questUrl,{
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Minio fetch failed: ${response.status} at ${questUrl}`);
    }

    // 5. 返回文件内容
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        'Content-Length': response.headers.get('Content-Length') || '',
      }
    });

  } catch (error) {
    console.error('Error in file route:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Error fetching file', 
        details: error.message,
        cause: error.cause?.message 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}