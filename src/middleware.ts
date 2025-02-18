import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAuthorization,
  checkTokenExpiration,
  getTicket,
  redirectToLoginUrl,
  fetchToken
} from "@/lib/auth";

export async function middleware(request: NextRequest, response: NextResponse) {
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

  let token = getAuthorization(request);
  const ticket = getTicket(request);

  if (!token) {
    if (!ticket) {
      console.log("未授权，去登录！");
      // return NextResponse.redirect(
      //   new URL(redirectToLoginUrl(request.url), request.url)
      // );
    } else {
      console.log("有ticket，获取token");
      token = await fetchToken(ticket, request.url, response);
      console.log("new token:", token);
    }
  }

  const isTokenExpired = checkTokenExpiration(token);
  if (isTokenExpired) {
    console.log("token失效");
    // return NextResponse.redirect(
    //   new URL(redirectToLoginUrl(request.url), request.url)
    // );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/myproxy/:path*", "/applications/:path*"]
};
