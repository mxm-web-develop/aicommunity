import { apiHandler } from "@/lib/api/handlers";
import { getBucketFiles } from "@/lib/service/getFileslist";
import { NextRequest, NextResponse } from "next/server";


// 添加OPTIONS方法处理CORS预检请求
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // 确保使用await获取参数
    
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error('无效的应用ID', { cause: { status: 400 } });
    }

    const files = await getBucketFiles(id);
    return NextResponse.json({ data: files }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ error: '文件获取失败' }, { status: 500 });
  }
}       