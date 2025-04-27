'use client';

import { useEffect, useState } from 'react';
import SwiperBanner, { Banner } from './SwiperBanner';

// 确保URL是完整的
function ensureFullUrl(url: string) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    if (url.startsWith('www.')) {
        return `https://${url}`;
    }
    return url;
}

export default function ClientBanner() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('/api/banners');
                if (!response.ok) throw new Error('获取banner数据失败');
                const result = await response.json();
                
                if (result.data) {
                    console.log('Fetched banners:', result.data);
                    setBanners(result.data);
                }
            } catch (error) {
                console.error('Banner fetch error:', error);
                setError(error instanceof Error ? error.message : '获取banner数据失败');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    console.log('Render state:', { isLoading, error, bannersLength: banners.length });

    if (isLoading) {
        return (
            <div className="w-11/12 lg:w-9/12 mx-auto relative" style={{ height: '420px' }}>
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-600">加载中...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || banners.length === 0) {
        return null;
    }

    return (
        <div className="w-11/12 lg:w-9/12 mx-auto">
            <SwiperBanner 
                banners={banners}
                autoplayDelay={4000}
                height={420}
            />
        </div>
    );
} 