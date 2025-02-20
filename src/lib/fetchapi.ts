export async function fetchApi(
  endpoint: string,
  options: RequestInit & { next?: { revalidate?: number } } = {}
) {
  // 只在构建阶段跳过请求，但保持缓存配置
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('构建阶段跳过 API 请求:', endpoint);
    return {
      success: true,
      data: endpoint.includes('limit=') ? [] : {} // 根据请求类型返回合适的空数据
    };
  }

  const url = endpoint.startsWith('http') ? endpoint : endpoint;

  try {
    console.log(`开始请求 API: ${url}`);
    console.log("请求参数:", {
      method: options.method || "GET",
      headers: options.headers,
      environment: process.env.NODE_ENV,
      cache: options.next?.revalidate ? `缓存${options.next.revalidate}秒` : '不缓存'
    });

    const response = await fetch(url, {
      ...options,
      next: options.next, // 保持缓存配置
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
    // console.log("API 响应数据:", data);
    return data;
  } catch (error) {
    console.error("请求出错:", {
      error,
      url,
    });
    throw error;
  }
}
