'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';

export interface Banner {
  id: number | string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface SwiperBannerProps {
  banners: Banner[];
  autoplayDelay?: number;
  height?: number;
}

export default function SwiperBanner({ 
  banners,
  autoplayDelay = 4000,
  height = 420
}: SwiperBannerProps) {
  if (!banners || banners.length === 0) return null;

  return (
    <div 
      className="relative w-full rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#e0ebff]"
      style={{ height: `${height}px` }}
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        className="h-full relative"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 text-white max-w-lg space-y-6">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold leading-tight tracking-tight">
                    {banner.title}
                  </h2>
                  <p className="text-xl leading-relaxed opacity-90">
                    {banner.description}
                  </p>
                </div>
                <a
                  href={banner.link}
                  className="inline-flex items-center px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-base hover:bg-white/30 transition-all duration-300 group"
                >
                  了解更多
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          background-color: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          padding: 2rem;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          transition: all 0.3s;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 1.2rem;
          color: white;
        }

        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
        }

        .swiper-pagination-bullet-active {
          background: white;
        }
      `}</style>
    </div>
  );
} 