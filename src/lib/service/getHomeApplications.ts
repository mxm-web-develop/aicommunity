import { Application } from '@/db/mongo/schemas/Applications';
import { connectToDatabase } from '@/db/mongo/connect';

interface QueryOptions {
  organizationId?: string;
  type?: string;
  limit?: number;
}

export async function getHomeApplications({ organizationId, type, limit = 8 }: QueryOptions) {
  try {
    await connectToDatabase();
    
    let filter: any = {};
    
    if (organizationId) {
      filter.organizationId = organizationId;
    }
    
    if (type) {
      // 使用正则表达式进行不区分大小写的模糊匹配
      filter.type = { $regex: type, $options: 'i' };
    }
    
    let query = Application.find(
      filter,
      'name type status shortIntro _id keywords organization'
    ).sort({ createdAt: -1 });
    
    query = query.limit(limit);
    
    return await query.lean();
  } catch (error) {
    throw error;
  }
}