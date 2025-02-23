export async function fetchApi(
  endpoint: string,
  options: RequestInit & { next?: { revalidate?: number } } = {}
) {
  // // 修改条件判断逻辑
  // if (
  //   // 精确判断构建阶段
  //   process.env.NEXT_PHASE === 'phase-production-build'
  // ) {
  //   console.log('[预渲染] 使用模拟数据:', endpoint);
  //   return {
  //     success: true,
  //     data: endpoint.includes('limit=') ? [] : {}
  //   };
  // }

  try {
    // 使用 NEXT_PUBLIC_API_URL 或 API_URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:80';
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    
    console.log(`开始请求 API: ${fullUrl}`, {
      环境: process.env.NODE_ENV,
      baseUrl,
      endpoint
    });
    
    const response = await fetch(fullUrl, {
      ...options,
      next: options.next,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("请求出错:", {
      error,
      环境: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
    });
    throw error;
  }
}
