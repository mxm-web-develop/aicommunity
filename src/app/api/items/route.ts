import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// MongoDB connection
const MONGODB_URI = 'mongodb://admin:password@mxm-ai.com:27017/testmongo?authSource=admin';

export const config = {
  api: {
    bodyParser: false,
  },
};


// Define the Schema (复用已有的 Schema)
const aiItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['model', 'service', 'application', 'essay']
  },
  // ... 其他字段定义
});

// Create the model
const AIItem = mongoose.models.AIItem || mongoose.model('AIItem', aiItemSchema);

// 连接数据库
async function connectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// GET /api/items - 获取所有项目，支持搜索和过滤
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search')?.trim();
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    await connectDB();

    // 构建查询条件
    const query: any = {};

    // 添加模糊搜索条件
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { 'post.rawString': { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // 添加类型过滤
    if (type) {
      query.type = type;
    }

    // 添加状态过滤
    if (status) {
      query.status = status;
    }

    const items = await AIItem.find(query);
    return NextResponse.json(items);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

// POST /api/items - 创建新项目
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const newItem = await AIItem.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 

// PUT /api/items - 根据ID更新项目
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await connectDB();
    
    const updatedItem = await AIItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}


// DELETE /api/items - 根据ID删除项目
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await connectDB();
    
    const deletedItem = await AIItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}