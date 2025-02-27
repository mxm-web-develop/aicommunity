export const dynamic = 'force-static'
export const revalidate = 43200  // 12小时缓存

import Image from "next/image";
import homeBg from "@/static/img/home_bg.png";
import AppCard from "@/components/server/AppCard";
import Link from "next/link";
import { getApplications } from "@/lib/service/getApplications";

export default async function Home() {
  const ai_applications = await getApplications({
    organizationId: "67af16e967cff211db44c6db",
    limit: 8,
  });
  const aiplus_applications = await getApplications({
    organizationId: "67b291be1ad598b265fce6b6",
    limit: 8,
  });

  return (
    <div className="relative w-full h-full mb-12">
      <div className="banner  relative h-[280px] md:h-[420px] w-full">
        <div className="absolute top-[100px] md:top-[140px] left-[30px] md:left-[80px] z-10 text-black">
          <div className="container">
          <div className="flex flex-col text-foreground items-start justify-center h-full">
            <div className="text-2xl md:text-4xl font-bold">源启AI+</div>
            <div className="text-sm md:text-xl">智能引领未来，AI为您赋能</div>
          </div>
          </div>
        </div>
        <Image
          src={homeBg}
          alt="Home background"
          fill
          className="object-cover " // 使用 brightness 或其他滤镜
          priority
        />
      </div>
      <div className="container">
        {/* <div className="hot-applications py-5 ">
          <div className="hot-applications-title text-2xl font-bold text-center">
            热门应用
          </div>
          <div>热门应用轮播组件</div>
        </div> */}
        <div className="application-displayer py-5 ">
          <div className="application-displayer-title text-2xl font-bold text-center">
            AI产品与服务
          </div>
          <div className="text-sm pt-[8px] pb-[32px] text-gray-500 text-center">
            源启AI技术能力矩阵
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ai_applications.map((application: any) => (
              <AppCard key={application._id} data={application} />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Link href="/applications">
              <button className="px-6 py-2 text-sm bg-white text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                查看更多
              </button>
            </Link>
          </div>
        </div>
        <div className="application-displayer py-5 ">
          <div className="application-displayer-title text-2xl font-bold text-center">
            AI+产品与服务
          </div>
          <div className="text-sm pt-[8px] pb-[32px] text-gray-500 text-center">
            源启+应用智能化矩阵
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {aiplus_applications.map((application: any) => (
              <AppCard key={application._id} data={application} />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Link href="/applications">
              <button className="px-6 py-2 text-sm bg-white text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                查看更多
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
