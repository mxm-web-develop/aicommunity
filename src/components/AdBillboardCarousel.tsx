'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

import Image from 'next/image'

// interface Ad {
//   id: string
//   imageUrl: string
//   title: string
//   description: string
// }

// interface BillboardCarouselProps {
//   ads: Ad[]
// }

export default function AdBillboardCarousel({ ads }: any) {
  console.log(ads, 'zhzhzhzh')

  const handleClick = () => {
    console.log('1111')
  }
  return (
    <div className="relative w-full h-[320px]">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectCards]}
        effect="cards"
        // grabCursor={true}
        spaceBetween={5}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {ads.map((ad: any) => (
          <SwiperSlide key={ad._id} onPointerDown={handleClick}>
            <div className="relative w-full h-full">
              <Image
                src={ad.url}
                alt={ad._id}
                width={500}
                height={270}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-2">{ad.title}</h2>
                <p className="text-sm">{ad.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
