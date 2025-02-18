import { headers } from 'next/headers';

export async function getBaseUrl() {
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = (await headers()).get("host");
  return `${protocol}://${host}`;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // 获取当前请求的 host
  const headersList = await headers();
  const host = headersList.get('host');
  
  // 构建完整的 URL
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const url = new URL(endpoint, baseUrl).toString();

  try {
    console.log(`Fetching ${url} in ${process.env.NODE_ENV} environment`);
    
    const response = await fetch(url, {
      ...options,
      // Next.js 13 数据获取选项
      next: {
        revalidate: 0 // 禁用缓存
      },
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', {
      error,
      url,
      environment: process.env.NODE_ENV
    });
    throw error;
  }
}