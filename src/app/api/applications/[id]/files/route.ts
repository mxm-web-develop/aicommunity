import { apiHandler } from "@/lib/api/handlers";
import { getBucketFiles } from "@/lib/service/getFileslist";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // 确保使用await获取参数
    
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error('无效的应用ID', { cause: { status: 400 } });
    }

    const files = await getBucketFiles(id);
    return NextResponse.json({ data: files });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ error: '文件获取失败' }, { status: 500 });
  }
}       