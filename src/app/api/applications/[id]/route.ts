import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db/mongo/connect';
import { Application } from '@/db/mongo/schemas/Applications';
import { Contact } from '@/db/mongo/schemas/Contacts';
import mongoose from 'mongoose';

// GET 获取单个应用详情
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        // 验证 ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: '无效的应用 ID' },
                { status: 400 }
            );
        }

        const application = await Application.findById(id)
            .populate({
                path: 'contact',
                model: Contact,
                options: { lean: true }
            })
            .lean();

        if (!application) {
            return NextResponse.json(
                { success: false, error: '未找到应用' },
                { status: 404 }
            );
        }

        // 确保 contact 始终是数组
        if (application.contact && !Array.isArray(application.contact)) {
            application.contact = [application.contact];
        }

        return NextResponse.json({ success: true, data: application });
    } catch (error) {
        console.error('Error fetching application:', error);
        return NextResponse.json(
            { success: false, error: '获取应用失败' },
            { status: 500 }
        );
    }
}

// PUT 更新应用
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const data = await request.json();

        // 验证 ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: '无效的应用 ID' },
                { status: 400 }
            );
        }

        // 转换布尔值为数字并更新时间戳
        const updateData = {
            ...data,
            status: data.status ? 1 : 0,
            updatedAt: new Date()
        };

        const application = await Application.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate({
            path: 'contact',
            model: Contact
        }).lean();

        if (!application) {
            return NextResponse.json(
                { success: false, error: '未找到应用' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: application });
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json(
            { success: false, error: '更新应用失败' },
            { status: 500 }
        );
    }
}

// DELETE 删除应用
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        // 验证 ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: '无效的应用 ID' },
                { status: 400 }
            );
        }

        const application = await Application.findByIdAndDelete(id).lean();

        if (!application) {
            return NextResponse.json(
                { success: false, error: '未找到应用' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: '删除成功' });
    } catch (error) {
        console.error('Error deleting application:', error);
        return NextResponse.json(
            { success: false, error: '删除应用失败' },
            { status: 500 }
        );
    }
} 