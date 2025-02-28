import { Types } from 'mongoose';
import { minioClient } from '../../db/minio/instant';


export interface MinioFile {
  name: string;
  size: number;
  lastModified: Date;
  url: string;
}

export async function  getBucketFiles(bucketId: string): Promise<MinioFile[]> {
  try {
    // 检查存储桶是否存在，不存在则自动创建
    if (!await minioClient.bucketExists(bucketId)) {
      console.log(`Creating missing bucket: ${bucketId}`);
      await minioClient.makeBucket(bucketId, 'us-east-1'); // 添加地区参数
    }

    return new Promise((resolve, reject) => {
      const files: MinioFile[] = [];
      console.log('Starting to list objects for bucket:', bucketId); // 调试日志

      const stream = minioClient.listObjects(bucketId);

      stream.on('data', (obj) => {
        console.log('Found object:', obj.name); // 调试日志
        files.push({
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
          url: `/${bucketId}/${obj.name}`
        });
      });

      stream.on('error', (err) => {
        console.error('Error listing objects:', err); // 调试日志
        reject(err);
      });

      stream.on('end', () => {
        console.log('Finished listing objects, found:', files.length); // 调试日志
        resolve(files);
      });
    });
  } catch (error) {
    console.error('Error in getBucketFiles:', error);
    throw new Error(`文件获取失败: ${error instanceof Error ? error.message : '未知错误'}`); // 更友好的错误提示
  }
}