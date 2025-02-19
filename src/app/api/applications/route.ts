import { NextRequest, NextResponse } from 'next/server';
import { Application } from '@/db/mongo/schemas/Applications';
import { Contact } from '@/db/mongo/schemas/Contacts';
import { connectToDatabase } from '@/db/mongo/connect';

// GET - 获取应用列表，支持多种查询条件
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // 获取查询参数
    const id = request.nextUrl.searchParams.get('id');
    const giantechType = request.nextUrl.searchParams.get('giantechType');
    
    if (id) {
      // 如果有 id 参数，查询单个应用
      const application = await Application.findById(id)
        .populate({
          path: 'contact',
          model: Contact
        })
        .lean();
        
      if (!application) {
        return NextResponse.json(
          { success: false, error: '未找到应用' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: application });
    }
    
    // 构建查询条件
    const query: any = {};
    if (giantechType) {
      query.giantechType = giantechType;
    }
    
    // 使用查询条件返回应用列表
    const applications = await Application.find(query)
      .populate({
        path: 'contact',
        model: Contact
      })
      .lean();
      
    return NextResponse.json({ success: true, data: applications });
  } catch (error: any) {
    console.error('Applications API Error:', error);
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