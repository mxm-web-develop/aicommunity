import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname.startsWith("/myproxy")) {
    // 重写URL
    url.pathname = url.pathname.replace(/^\/myproxy/, "");
    // 设置新的主机
    url.host = "api.dify.ai";
    url.protocol = "https";
    url.port = "";

    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: "/myproxy/:path*",
};
