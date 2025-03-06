// 使用 dynamic = 'force-static' 来启用静态生成
// // 设置 revalidate
// export const revalidate = 43200  // 12小时缓存


import Image from "next/image";
import applicationsBanner from "@/static/img/applications_bg.png";

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/client/ErrorBoundary';
import { Suspense } from 'react';

// 使用 dynamic 导入，确保客户端组件正确加载


import AppControlList from "@/components/client/AppControlList";
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
      <Suspense fallback={<div className="container text-center py-10">加载中...</div>}>
        <AppControlList key="app-control-list" />
      </Suspense>
      </div>
    );
  
}
