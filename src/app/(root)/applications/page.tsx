// import dynamic from "next/dynamic";
import Image from "next/image";
import applicationsBanner from "@/static/img/applications_bg.png";
import LeftBar from "@/components/applications/left-bar";
import AppItem from "@/components/applications/item";
import SearchBar from "@/components/ui/searchBar";
import { categorys, sceneList, cardList, allRow } from "@/constants";
import { fetchApi } from "@/lib/fetchapi";
import AppCard from "@/scomponents/AppCard";

interface ApplicationPageQueryProps {
  category?: string;
  scene?: string;
  keyWord?: string;
}

export default async function ApplicationsPage() {
  try {
    const { success, data: AIapplications = [] } = await fetchApi('/api/applications/ai', {
      next: { revalidate: 3600 }
    });

    const { success: success2, data: AIapplications2 = [] } = await fetchApi('/api/applications/aiplus', {
      next: { revalidate: 3600 }
    });

    // 确保数据是数组
    const applications = Array.isArray(AIapplications) ? AIapplications : [];
    const applications2 = Array.isArray(AIapplications2) ? AIapplications2 : [];

    return (
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
    );
  } catch (error) {
    console.error('Error:', error);
    return <div>加载失败，请稍后重试</div>;
  }
}
