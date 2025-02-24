// 使用 dynamic = 'force-static' 来启用静态生成
// // 设置 revalidate
// export const revalidate = 43200  // 12小时缓存
export const dynamic = 'force-dynamic'

import Image from "next/image";
import applicationsBanner from "@/static/img/applications_bg.png";
import LeftBar from "@/components/applications/left-bar";
import AppItem from "@/components/applications/item";
import SearchBar from "@/components/ui/searchBar";
import { categorys, sceneList, cardList, allRow } from "@/constants";
import { fetchApi } from "@/lib/fetchapi";
import AppCard from "@/components/server/AppCard";
import { getApplications } from "@/lib/service/getApplications";

interface ApplicationPageQueryProps {
  category?: string;
  scene?: string;
  keyWord?: string;
}

export default async function ApplicationsPage() {
  
    const ai_applications = await getApplications({
      organizationId: "67af16e967cff211db44c6db",
      limit: 1000,
    });
    const aiplus_applications = await getApplications({
      organizationId: "67b291be1ad598b265fce6b6",
      limit: 1000,
    });
    

    // 确保数据是数组
    const applications = Array.isArray(ai_applications) ? ai_applications : [];
    const applications2 = Array.isArray(aiplus_applications) ? aiplus_applications : [];

    return (
      <div className="w-full">
      <div className="select-none h-[248px] relative w-full mb-10">
        <div className="absolute top-12 left-0 right-0 z-10">
          <div className="container">
            <div className="text-[40px]">
              <b>产品与服务</b>
            </div>
            <div className="text-[#333] mb-4">
              突破性AI技术，开启无限创新机遇
            </div>
            <SearchBar />
          </div>
        </div>
        <Image
          src={applicationsBanner}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>      
      <div className="container mx-auto py-8">
        <div className="application-displayer py-5">
          <div className="application-displayer-title text-2xl font-bold text-center">
            AI产品与服务
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {applications.map((application: any) => (
              <AppCard key={application._id} data={application} />
            ))}
          </div>
        </div>

        <div className="application-displayer py-5">
          <div className="application-displayer-title text-2xl font-bold text-center">
            AI+产品与服务
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {applications2.map((application: any) => (
              <AppCard key={application._id} data={application} />
            ))}
          </div>
        </div>
      </div>
      </div>
    );
  
}
