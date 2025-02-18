import { headers } from 'next/headers';

export async function getBaseUrl() {
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = (await headers()).get("host");
  return `${protocol}://${host}`;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    cache: 'no-store', // 默认禁用缓存
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}