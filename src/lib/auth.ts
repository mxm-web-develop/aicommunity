import type { NextRequest, NextResponse } from "next/server";
// import { fetchApi } from "@/lib/fetchapi";

// export const authDomain = "https://login.pacteratech.com“;
export const authDomain = "https://login-test.pacteratech.com";
export const authApi = "/serviceValidate";
const loginApi = "/login";
const ticketKey = "ticket";
const storageName = "Authorization";

export const redirectToLoginUrl = (url: string) => {
  const _url = new URL(url);
  return `${authDomain}${loginApi}?service=${_url.origin}`;
};

export const getAuthorization = (req: NextRequest) => {
  const token = req.cookies.get(storageName)?.value || null;
  return token;
};

export const setAuthorization = (res: NextResponse, token: string) => {
  try {
    res.cookies.set(storageName, token);
  } catch (err) {
    console.log(err);
  }
};

export const checkTokenExpiration = (token: string | null) => {
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() > expirationTime;
    }
    return true;
  } catch (error) {
    return true;
  }
};

export const getTicket = (req: NextRequest) => {
  // const _url = new URL(url);
  // const queryParams = Object.fromEntries(_url.searchParams.entries());
  const queryParams = req.nextUrl.searchParams;
  // return queryParams[ticketKey] || null;
  return queryParams.get(ticketKey) || null;
};

export const fetchToken = async (
  ticket: string,
  url: string,
  response: NextResponse
) => {
  const _url = new URL(url);
  const service = _url.origin;
  const params = new URLSearchParams({
    // ticket: "ST-3478307-O76pTqa0086HrK7-D2QV8F3ruAE-login",
    ticket,
    service
  }).toString();
  const apiUrl = `${authDomain}${authApi}?${params}`;

  try {
    console.log("fetch token:", apiUrl);
    // const res = await fetchApi(apiUrl);
    const res = await fetch(apiUrl);
    console.log("res:", res);
    if (!res.ok) {
      throw new Error("Failed to fetch token data from cas API");
    }
    const data = await res.json();
    const { authenticationSuccess } = data;
    console.log("data:", authenticationSuccess);
    const { token } = authenticationSuccess;
    setAuthorization(response, token);
    return token;
  } catch (err) {
    console.log(err);
    return null;
  }
};
