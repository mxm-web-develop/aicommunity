'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';

export interface Banner {
    _id: string;
    title: string;
    description: string;
    coverImg: string;
    url: string;
    status: string;
}

interface Props {
    banners: Banner[];
    autoplayDelay?: number;
    height?: number;
}

export default function SwiperBanner({ banners, autoplayDelay = 3000, height = 400 }: Props) {
    console.log('SwiperBanner received banners:', banners);

    const isValidImageUrl = (url: string) => {
        if (!url) return false;
        // 只过滤掉包含 undefined 的 https URLs
        if (url.startsWith('https://') && url.includes('undefined')) return false;
        // 允许特定的 IP 地址
        if (url.includes('45.77.12.232')) return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const getFullImageUrl = (coverImg: string) => {
        if (!coverImg) return '';
        if (coverImg.startsWith('http://') || coverImg.startsWith('https://')) {
            return coverImg;
        }
        const endpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT;
        const port = process.env.NEXT_PUBLIC_MINIO_PORT;
        
        if (!endpoint || !port) {
            console.warn('MinIO configuration is incomplete');
            return '';
        }
        
        return `http://${endpoint}:${port}${coverImg}`;
    };

    const getSafeUrl = (url: string) => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    if (!banners.length) {
        return null;
    }

    return (
        <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                autoplay={{
                    delay: autoplayDelay,
                    disableOnInteraction: false,
                }}
                // navigation
                pagination={{ clickable: true }}
                loop={banners.length > 1}
                className="h-full"
            >
                {banners.map((banner) => {
                    const imageUrl = getFullImageUrl(banner.coverImg);
                    
                    return (
                        <SwiperSlide key={banner._id}>
                            <Link href={getSafeUrl(banner.url)} target="_blank" rel="noopener noreferrer">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={imageUrl || '/images/default.png'}
                                        alt={banner.title || 'Banner图片'}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        priority
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 h-full w-full text-white p-4" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0))' }}>
                                        <div className='flex flex-col justify-center items-start pl-16 h-full w-full relative'>
                                            <h3 className="text-3xl font-bold">{banner.title}</h3>
                                            {banner.description && (
                                                <p className="text-sm mt-2 text-gray-200">{banner.description}</p>
                                            )}
                                        <div className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-colors duration-200 cursor-pointer">
                                            查看更多
                                        </div>
                                        </div>
                                      
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
} 