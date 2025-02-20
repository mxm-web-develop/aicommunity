import { headers } from "next/headers";

export async function getBaseUrl() {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = (await headers()).get("host");
  return `${protocol}://${host}`;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const headersList = await headers();
  const host = headersList.get("host");

  // 根据环境和主机构建 URL
  const protocol = "http";
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? `${protocol}://${host}` // 使用当前主机和端口
      : `${protocol}://localhost:3000`; // 生产环境使用本地地址

  const url = new URL(endpoint, baseUrl).toString();

  try {
    console.log(`Fetching ${url} in ${process.env.NODE_ENV} environment`);
    console.log("MongoDB Host:", process.env.MONGO_HOST); // 添加调试信息

    const response = await fetch(url, {
      ...options,
      next: { revalidate: 0 },
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    if (!response.ok) {
      // 添加更详细的错误信息
      console.error("API error details:", {
        status: response.status,
        statusText: response.statusText,
        url: url,
        host: host,
        environment: process.env.NODE_ENV,
        mongoHost: process.env.MONGO_HOST
      });

      const errorText = await response.text();
      console.error("Error response:", errorText);

      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", {
      error,
      url,
      host,
      environment: process.env.NODE_ENV,
      mongoHost: process.env.MONGO_HOST
    });
    throw error;
  }
}
