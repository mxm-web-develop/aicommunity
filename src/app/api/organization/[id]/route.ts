import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db/mongo/connect';
import { Organization } from '@/db/mongo/schemas/Organization';

// GET 获取单个组织
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const organization = await Organization.findById(params.id);

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch organization:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization' },
      { status: 500 }
    );
  }
}