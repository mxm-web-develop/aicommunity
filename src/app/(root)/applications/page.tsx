// 使用 dynamic = 'force-static' 来启用静态生成
// // 设置 revalidate
// export const revalidate = 43200  // 12小时缓存


import Image from "next/image";
import applicationsBanner from "@/static/img/applications_bg.png";

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/client/ErrorBoundary';

// 使用 dynamic 导入，确保客户端组件正确加载
const AppControlListClient = dynamic(
  () => import('@/components/client/AppControlList'),
  { ssr: false }
);

interface ApplicationPageQueryProps {
  category?: string;
  scene?: string;
  keyWord?: string;
}

export default async function ApplicationsPage() {
  
    return (
      <div className="w-full">
      <div className="select-none h-[248px] relative w-full mb-10">
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="container">
            <div className="text-2xl md:text-4xl">
              <b>产品与服务</b>
            </div>
            <div className="text-[#333] mb-4">
              突破性AI技术，开启无限创新机遇
            </div>
            {/* <SearchBar /> */}
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
      
      <ErrorBoundary fallback={<div className="container">加载应用列表时出错，请检查控制台或刷新页面。</div>}>
        <AppControlListClient />
      </ErrorBoundary>
    
      </div>
    );
  
}
