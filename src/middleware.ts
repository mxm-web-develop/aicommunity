import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  getAuthorization,
  setAuthorization,
  // checkTokenExpiration,
  getTicket,
  redirectToLoginUrl,
  fetchToken,
  isCheckLogin
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

  if (isCheckLogin) {
    const cookieStore = await cookies();
    const memberObj = getAuthorization(cookieStore) || {};
    const { value } = memberObj;
    console.log("memberObj:", memberObj);
    const ticket = getTicket(request);

    if (!value) {
      if (!ticket) {
        console.log("未授权，去登录！");
        return NextResponse.redirect(
          new URL(redirectToLoginUrl(request.url), request.url)
        );
      } else {
        console.log("有ticket，获取token");
        const res = await fetchToken(ticket, request.url);
        console.log("new res:", res);
        const { success, data } = res;
        if (!success) {
          console.log("ticket不正确，去重新获取！");
          return NextResponse.redirect(
            new URL(redirectToLoginUrl(request.url), request.url)
          );
        } else {
          if (!data) {
            console.log("未获取到信息，去重新获取！");
            return NextResponse.redirect(
              new URL(redirectToLoginUrl(request.url), request.url)
            );
          } else {
            console.log("cookie设置", data);
            setAuthorization(cookieStore, data);
            // setTimeout(() => {
            //   console.log("!!!!----:", getAuthorization(cookieStore));
            // }, 5000);
          }
        }
      }
    }

    // const isTokenExpired = checkTokenExpiration(cookieStore);
    // if (isTokenExpired) {
    //   console.log("token失效");
    // return NextResponse.redirect(
    //   new URL(redirectToLoginUrl(request.url), request.url)
    // );
    // }
  }

  return NextResponse.next();
}

export const config = {
  // matcher: ["/myproxy/:path*", "/applications/:path*"]
  matcher: ["/myproxy/:path*", "/:path*"]
};
