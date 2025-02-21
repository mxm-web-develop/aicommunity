import { NextRequest, NextResponse } from 'next/server';
import { RichPost } from '@/db/mongo/schemas/RichPosts';
import { connectToDatabase } from '@/db/mongo/connect';

// GET /api/rich-posts/[id] - 获取单个富文本帖子
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const post = await RichPost.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/rich-posts/[id] - 更新富文本帖子
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const post = await RichPost.findByIdAndUpdate(params.id, body, { new: true });
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update post' },
      { status: 400 }
    );
  }
}

// DELETE /api/rich-posts/[id] - 删除富文本帖子
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const post = await RichPost.findByIdAndDelete(params.id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 