import Image from "next/image";
import applicationsBanner from "@/static/img/applications_bg.png";

export default async function ApplicationsPage() {
  return (
    <div className="w-full">
      <div className="select-none h-[248px] relative w-full">
        <div className="absolute "></div>
        <Image
          src={applicationsBanner}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">应用列表</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 应用卡片列表 */}
          {/* 这里可以从后端获取数据并渲染 */}
        </div>
      </div>
    </div>
  );
}
