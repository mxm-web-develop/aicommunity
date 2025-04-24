import { NextResponse } from 'next/server';
import { Organization } from '@/db/mongo/schemas/Organization';
import { connectToDatabase } from '@/db/mongo/connection';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        await connectToDatabase();
        
        const organization = await Organization.findByIdAndUpdate(
            params.id,
            {
                name: body.name,
                description: body.description,
                url: body.url,
                logo: body.logo,
            },
            { new: true }
        );
        
        if (!organization) {
            return NextResponse.json(
                { success: false, message: '组织不存在' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ 
            success: true, 
            data: organization 
        });
    } catch (error) {
        console.error('Error updating organization:', error);
        return NextResponse.json(
            { success: false, message: '更新组织失败' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        
        const organization = await Organization.findByIdAndDelete(params.id);
        
        if (!organization) {
            return NextResponse.json(
                { success: false, message: '组织不存在' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ 
            success: true, 
            message: '删除组织成功' 
        });
    } catch (error) {
        console.error('Error deleting organization:', error);
        return NextResponse.json(
            { success: false, message: '删除组织失败' },
            { status: 500 }
        );
    }
} 