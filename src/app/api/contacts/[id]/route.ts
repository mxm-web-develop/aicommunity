import { NextRequest, NextResponse } from 'next/server';
import { Contact } from '@/db/mongo/schemas/Contacts';
import { connectToDatabase } from '@/db/mongo/connect';

// GET /api/contacts/[id] - 获取单个联系人
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const contact = await Contact.findById(params.id);
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

// PUT /api/contacts/[id] - 更新联系人
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const contact = await Contact.findByIdAndUpdate(params.id, body, { new: true });
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(contact);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update contact' },
      { status: 400 }
    );
  }
}

// DELETE /api/contacts/[id] - 删除联系人
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const contact = await Contact.findByIdAndDelete(params.id);
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
} 