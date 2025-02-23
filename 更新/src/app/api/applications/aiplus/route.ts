import { NextResponse } from "next/server";
import { Application } from "@/db/mongo/schemas/Applications";
import { connectToDatabase } from "@/db/mongo/connect";

export async function GET(request: Request) {
  console.log("111111111111111完");

  try {
    console.log("Attempting database connection...");
    await connectToDatabase();

    // 获取URL中的limit参数
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");

    let query = Application.find(
      { organizationId: "67b291be1ad598b265fce6b6" },
      "name gientechType status shortIntro _id"
    ).sort({ gientechType: 1 }); // 按 gientechType 升序排列

    // 如果传入了limit参数，则应用limit限制
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    // console.log('Query projection:', query.projection());

    const leanResults = await query.lean();

    return NextResponse.json({
      success: true,
      data: leanResults,
      message: "Query executed"
    });
  } catch (error: any) {
    console.error("Detailed error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
