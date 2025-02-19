import { NextRequest, NextResponse } from 'next/server';
import { Application } from '@/db/mongo/schemas/Applications';
import { Contact } from '@/db/mongo/schemas/Contacts';
import { connectToDatabase } from '@/db/mongo/connect';

// GET - 获取应用列表，支持多种查询条件
export async function GET() {
  console.log('难道？')
  try {
    await connectToDatabase();
    
    const applications = await Application.find()
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