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
  isCheckLogin,
  resetCookie
} from "@/lib/auth";

export async function middleware(request: NextRequest, response: NextResponse) {
  const url = request.nextUrl;
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  if (isCheckLogin) {
    const cookieStore = await cookies();
    const { pathname, origin } = url;
    const _url = pathname === "/auth" ? "/" : "";
    // setAuthorization(cookieStore, "");
    // resetCookie(cookieStore, "aa");
    // console.log("重置cookie!");
    const memberObj = getAuthorization(cookieStore) || {};
    const { value } = memberObj;
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
            console.log("已授权1！");
            // console.log("urlurlurlurl:", origin, _url, pathname);
            if (_url) {
              return NextResponse.redirect(new URL(_url, request.url));
            }
          }
        }
      }
    } else {
      console.log("已授权2！");
      console.log("urlurlurlurl:", url, origin, _url, pathname);
      if (_url) {
        return NextResponse.redirect(new URL(_url, request.url));
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
  matcher: [ 
    '/applications/:path*',
    '/api/applications/:path*',  // 移除这行，让 API 路由自由通过
    '/auth/:path*',
    '/((?!api|_next|static|images|favicon.ico).*)'
  ]
  // matcher: ["/myproxy/:path*", "/:path*"]
};
