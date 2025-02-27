import { Types } from 'mongoose';
import { minioClient } from '../../db/minio/instant';


export interface MinioFile {
  name: string;
  size: number;
  lastModified: Date;
  url: string;
}

export async function getBucketFiles(bucketId: string): Promise<MinioFile[]> {
  try {
    // 调整1：增强存储桶存在性检查
    const bucketExists = await minioClient.bucketExists(bucketId);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketId, 'us-east-1');
      console.log(`Created new bucket: ${bucketId}`);
    }

    return new Promise((resolve, reject) => {
      // 调整2：添加30秒超时机制
      const timeout = setTimeout(() => {
        stream.destroy();
        reject(new Error('MinIO操作超时（30秒）'));
      }, 30000);

      const files: MinioFile[] = [];
      console.log('Starting to list objects for bucket:', bucketId); // 调试日志

      const stream = minioClient.listObjects(bucketId);

      stream.on('data', async (obj) => {
        try {
          // 调整3：生成带签名的临时访问URL
          const url = await minioClient.presignedGetObject(
            bucketId,
            obj.name,
            3600 // 1小时有效期
          );
          
          files.push({
            name: obj.name,
            size: obj.size,
            lastModified: obj.lastModified,
            url: url // 替换硬编码路径
          });
        } catch (err) {
          console.error('生成签名URL失败:', err);
        }
      });

      // 调整4：增强错误处理
      stream.on('error', (err) => {
        clearTimeout(timeout);
        console.error('流错误:', err);
        reject(new Error(`文件列表获取失败: ${err.message}`));
      });

      stream.on('end', () => {
        clearTimeout(timeout);
        console.log(`成功获取 ${files.length} 个文件`);
        resolve(files);
      });
    });
  } catch (error) {
    // 调整5：规范化错误输出
    console.error('获取存储桶文件失败:', error);
    throw new Error(`文件服务不可用: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}