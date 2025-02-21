import { NextRequest, NextResponse } from "next/server";

export const authApi = "/serviceValidate";
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    console.log("searchParams:", req.nextUrl.searchParams);
    const queryParams = req.nextUrl.searchParams;
    const ticket = queryParams.get("ticket");
    const service = queryParams.get("service");
    console.log("ticket:", ticket);
    console.log("service:", service);
    const response = await fetch(
      `${process.env.NEXT_VALIDATE_API_BASE_URL}${authApi}?ticket=${ticket}&service=${service}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.text();
    const startFlag = "<cas:user>";
    const endFlag = "</cas:user>";
    const memberId =
      data.indexOf(startFlag) >= 0
        ? data.substring(
            data.indexOf(startFlag) + startFlag.length,
            data.indexOf(endFlag)
          )
        : null;

    if (memberId) {
      return NextResponse.json(
        { success: true, data: memberId },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "获取用户失败" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Failed to fetch userId:", error);
    return NextResponse.json(
      { error: "Failed to fetch userId" },
      { status: 500 }
    );
  }
}
