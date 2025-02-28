import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, fileId: string } }
) {
  try {
    // 1. 等待 params
    const bucketId = await params.id;
    const encodedFileName = await params.fileId;
    
    // 2. 解码文件名（移除可能的前导斜杠和重复的 bucket ID）
    let fileName = decodeURIComponent(encodedFileName);
    // 移除可能的前导斜杠
    fileName = fileName.replace(/^\//, '');
    // 移除可能重复的 bucket 路径
    fileName = fileName.replace(`${bucketId}/`, '');

    console.log('Bucket ID:', bucketId);
    console.log('File Name:', fileName);

    // 3. 构建正确的 Minio URL
    const minioEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'developer.gientech.com';
    const minioUrl = `https://${minioEndpoint}/files/${bucketId}/${fileName}`;
    console.log('Minio URL:', minioUrl);

    // 4. 请求文件
    const response = await fetch(minioUrl);
    if (!response.ok) {
      throw new Error(`Minio fetch failed: ${response.status}`);
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
      JSON.stringify({ error: 'Error fetching file' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}