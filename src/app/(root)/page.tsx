import Image from "next/image";
import homeBg from "@/static/img/home_bg.png";
import AppCard from "@/scomponents/AppCard";
import { fetchApi } from "@/lib/fetchapi";

export default async function Home() {
  const { success, data: AIapplications } = await fetchApi('/api/applications/ai?limit=8',{  cache: 'no-store' });
  const { success: success2, data: AIapplications2 } = await fetchApi('/api/applications/aiplus?limit=8',{  cache: 'no-store' });
  if (!success) {
    console.error('Failed to fetch applications');
    return null;
  }
  console.log(AIapplications);
  // console.log(applications);
  return (
    <div className="relative w-full h-full ">
      <div className="banner relative h-[420px] w-full">
        <div className="absolute top-[140px] left-[80px] z-10 text-black">
          <div className="flex flex-col text-foreground items-start justify-center h-full">
            <div className="text-4xl font-bold">源启AI+</div>
            <div className="text-xl">智能引领未来，AI为您赋能</div>
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
            AI应用展示
          </div>
          <div className="text-sm pt-[8px] pb-[32px] text-gray-500 text-center">
            应用展示subtitle
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AIapplications.map((application: any) => (
              <AppCard key={application._id} data={application} />
            ))}

          </div>
        </div>
        <div className="application-displayer py-5 ">
        <div className="application-displayer-title text-2xl font-bold text-center">
            AI+应用展示
          </div>
          <div className="text-sm pt-[8px] pb-[32px] text-gray-500 text-center">
            应用展示subtitle
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AIapplications2.map((application: any) => (
              <AppCard key={application._id} data={application} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
