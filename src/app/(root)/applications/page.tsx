// 使用 dynamic = 'force-static' 来启用静态生成
// // 设置 revalidate
// export const revalidate = 43200  // 12小时缓存

'use client';

import Image from "next/image";
import applicationsBanner from "@/static/img/applications_bg.png";
import { ErrorBoundary } from '@/components/client/ErrorBoundary';
import { Suspense, useEffect, useState } from 'react';
import AppControlList from "@/components/client/AppControlList";

// 添加加载状态组件
const LoadingState = () => (
  <div className="container text-center py-10">
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3c78d8] mb-4"></div>
      <p className="text-[#3c78d8]/80">正在加载应用列表...</p>
    </div>
  </div>
);

interface ApplicationPageQueryProps {
  category?: string;
  scene?: string;
  keyWord?: string;
}

export default function ApplicationsPage() {
  // 添加客户端挂载检测
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
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
      
      {/* 使用客户端检测确保组件仅在客户端渲染 */}
      <ErrorBoundary fallback={<div className="container">加载应用失败，请刷新页面重试</div>}>
        {isClient ? (
          <Suspense fallback={<LoadingState />}>
            <AppControlList key={`app-control-list-${Date.now()}`} />
          </Suspense>
        ) : (
          <LoadingState />
        )}
      </ErrorBoundary>
    </div>
  );
}
