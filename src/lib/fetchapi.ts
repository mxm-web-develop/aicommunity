import { headers } from 'next/headers';

export async function getBaseUrl() {
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = (await headers()).get("host");
  return `${protocol}://${host}`;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : '');
  
  const url = baseUrl + endpoint;
  
  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error('API error:', {
        status: response.status,
        statusText: response.statusText,
        url: url
      });
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