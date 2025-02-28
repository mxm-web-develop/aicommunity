import type { NextRequest, NextResponse } from "next/server";

const loginApi = "/login";
const logoutApi = "/logout";
const ticketKey = "ticket";
const storageName = "memberId";
const _host = "http://developer.gientech.com";
export const isCheckLogin = true;

export const checkAuthorization = async (cookieStore: any) => {
  const memberObj = getAuthorization(cookieStore) || {};
  const { value } = memberObj;
  return value;
};

export const redirectToLoginUrl = (url: string) => {
  const _url = new URL(url);
  return `${process.env.NEXT_VALIDATE_API_BASE_URL || process.env.NEXT_PUBLIC_VALIDATE_API_BASE_URL}${loginApi}?service=${_host}/auth`;
};

export const getAuthorization = (cookieStore: any) => {
  return cookieStore.get(storageName) || null;
};

export const setAuthorization = (cookieStore: any, value: string) => {
  try {
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    // const expires = new Date(Date.now() + 30 * 1000);
    cookieStore.set(storageName, value, {
      expires,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
  } catch (err) {
    console.log(err);
  }
};

export const checkTokenExpiration = (cookieStore: any) => {
  try {
    const obj = getAuthorization(cookieStore);
    const expires = obj.options.expires;
    if (expires && new Date(expires) < new Date()) {
      return true;
    }
    return false;
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

export const fetchToken = async (ticket: string, url: string) => {
  try {
    const _url = new URL(url);
    const service = _url.origin;
    const params = new URLSearchParams({
      ticket,
      service
    }).toString();
    const apiUrl = `${_host}/api/serviceValidate?${params}`;
    console.log("apiUrl:", apiUrl);

    const data = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => response.json());
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const resetCookie = (cookieStore: any, value: string) => {
  try {
    const expires = new Date(Date.now() + 1 * 1000);
    cookieStore.set(storageName, value, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
  } catch (err) {
    console.log(err);
  }
};

export const checkAuthorizationByClient = () => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");

    if (key === storageName) {
      return decodeURIComponent(value);
    }
  }

  return null;
};
