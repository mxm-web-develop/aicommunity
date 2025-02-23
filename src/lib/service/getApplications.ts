import { Application } from '@/db/mongo/schemas/Applications';
import { connectToDatabase } from '@/db/mongo/connect';

interface QueryOptions {
  organizationId?: string;
  limit?: number;
}

export async function getApplications({ organizationId, limit = 8 }: QueryOptions) {
  try {
    await connectToDatabase();
    
    const filter = organizationId ? { organizationId } : {};
    
    let query = Application.find(
      filter,
      'name gientechType status shortIntro _id'
    ).sort({ gientechType: 1 });
    
    query = query.limit(limit);
    
    return await query.lean();
  } catch (error) {
    throw error;
  }
}