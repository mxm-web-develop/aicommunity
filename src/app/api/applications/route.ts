import { NextRequest, NextResponse } from 'next/server';
import { Application } from '@/db/mongo/schemas/Applications';
import { connectToDatabase } from '@/db/mongo/connect';

// GET - 获取应用列表，支持多种查询条件
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    
    // 构建查询条件
    const query: any = {};
    
    // 状态筛选
    const status = searchParams.get('status');
    if (status !== null) {
      query.status = parseInt(status);
    }
    
    // 分类筛选
    const classify = searchParams.get('classify');
    if (classify !== null) {
      query.classify = parseInt(classify);
    }
    
    // 组织筛选
    const organizationId = searchParams.get('organizationId');
    if (organizationId) {
      query['organization.id'] = organizationId;
    }

    const applications = await Application.find(query)
      .populate('contact')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: applications });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - 创建新应用
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const application = new Application(body);
    await application.save();
    
    return NextResponse.json(
      { success: true, data: application },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// PUT - 更新应用
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const application = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE - 删除应用
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const id = request.nextUrl.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const application = await Application.findByIdAndDelete(id);
    
    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Application deleted successfully' }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}