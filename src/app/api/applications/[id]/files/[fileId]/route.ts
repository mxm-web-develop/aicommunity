import { NextRequest, NextResponse } from 'next/server';
import https from 'node:https';

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

    // 1. 正确使用await获取params
    const bucketId = await params.id;
    const encodedFileName = await params.fileId;
    // const { bucketId, encodedFileName } = await params;
    // 2. 解码文件名（移除可能的前导斜杠和重复的 bucket ID）
    let fileName = decodeURIComponent(encodedFileName);
    // 移除可能的前导斜杠
    fileName = fileName.replace(/^\//, '');
    // 移除可能重复的 bucket 路径
    fileName = fileName.replace(`${bucketId}/`, '');
    const questUrl =  isLocalServer ? `https://developer.gientech.com/files/${bucketId}/${fileName}` : `http://${minioEndpoint}:${minioPort}/${bucketId}/${fileName}`;


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