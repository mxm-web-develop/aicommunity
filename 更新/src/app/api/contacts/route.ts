import { NextRequest, NextResponse } from 'next/server';
import { Contact } from '@/db/mongo/schemas/Contacts';
import { connectToDatabase } from '@/db/mongo/connect';

// GET /api/contacts - 获取所有联系人
export async function GET() {
  try {
    await connectToDatabase();
    const contacts = await Contact.find({});
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST /api/contacts - 创建新联系人
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const contact = await Contact.create(body);
    return NextResponse.json(contact, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create contact' },
      { status: 400 }
    );
  }
} 