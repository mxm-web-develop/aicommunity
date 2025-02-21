import { NextRequest, NextResponse } from 'next/server';
import { RichPost } from '@/db/mongo/schemas/RichPosts';
import { connectToDatabase } from '@/db/mongo/connect';

// GET /api/rich-posts - 获取所有富文本帖子
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    
    // 构建查询条件
    const query: any = {};
    
    // 类型筛选
    const type = searchParams.get('type');
    if (type) {
      query.type = type;
    }
    
    // 状态筛选
    const status = searchParams.get('status');
    if (status !== null) {
      query.status = parseInt(status);
    }

    const posts = await RichPost.find(query)
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ 
      success: true, 
      data: posts 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/rich-posts - 创建新富文本帖子
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const post = await RichPost.create(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 400 }
    );
  }
} 