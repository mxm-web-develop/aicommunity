import { headers } from "next/headers";

export async function getBaseUrl() {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = (await headers()).get("host");
  return `${protocol}://${host}`;
}

export async function fetchApi(
  endpoint: string,
  options: RequestInit & { next?: { revalidate?: number } } = {}
) {
  const headersList = await headers();
  const host = headersList.get("host");

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const url = new URL(endpoint, baseUrl).toString();

  try {
    console.log(`开始请求 API: ${url}`);
    console.log("请求参数:", {
      method: options.method || "GET",
      headers: options.headers,
      environment: process.env.NODE_ENV
    });

    const response = await fetch(url, {
      ...options,
      next: options.next,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 请求失败:", {
        status: response.status,
        statusText: response.statusText,
        url: url,
        errorText: errorText
      });

      throw new Error(`API 请求失败: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API 响应数据:", data);
    return data;
  } catch (error) {
    console.error("请求出错:", {
      error,
      url,
      host
    });
    throw error;
  }
}
