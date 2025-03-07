export const dynamic = "force-static";
export const revalidate = 43200; // 12小时缓存

import Image from "next/image";
import homeBg from "@/static/img/home_bg.png";
import AppCard from "@/components/server/AppCard";
import Link from "next/link";
import { getApplications } from "@/lib/service/getApplications";
import RedirectCmp from "@/components/RedirectCmp";
import { isCheckLogin } from "@/lib/auth";
import { getHomeApplications } from "@/lib/service/getHomeApplications";
import CategorySection from "@/components/client/CategorySection";
import WaveBanner from "@/components/client/banners/Waves";
import Particlewaves from "@/components/client/banners/Particlewaves";
// 创建"查看更多"卡片 - 高级质感版本
const MoreCard = ({ type }: { type: string }) => (
  <div className="h-[268px]">
    <Link href={`/applications?type=${type}`}>
      <div className="bg-gradient-to-br from-[#f8faff] to-[#e8f1ff] p-6 rounded-xl cursor-pointer h-full flex flex-col justify-center items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#e0ebff] hover:shadow-[0_10px_40px_rgba(60,120,216,0.08)] transition-all duration-300">
        <div className="w-14 h-14 mb-6 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[#3c78d8]/5 rounded-full blur-xl"></div>
          <div className="relative w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-[#e0ebff] shadow-[0_4px_10px_rgba(60,120,216,0.1)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#3c78d8" className="w-5 h-5 opacity-70">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </div>
        <div className="font-medium text-lg text-[#3c78d8]/80 text-center mb-2">查看更多</div>
        <div className="font-normal text-[15px] text-[#3c78d8]/60 text-center">{type === 'llm' ? '大模型' : type === 'platform' ? '平台' : '应用'}</div>
      </div>
    </Link>
  </div>
);

// 创建"正在开发"卡片组件
const ComingSoonCard = () =>  (
  <div className="h-[268px]">
  <div className="bg-gradient-to-br from-[#f8faff] via-[#f0f6ff] to-[#e8f1ff] p-6 rounded-xl h-full flex flex-col justify-center items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#e0ebff]">
  <div className="w-14 h-14 mb-6 relative flex items-center justify-center">
  <div className="absolute inset-0 bg-[#3c78d8]/5 rounded-full blur-xl"></div>
  <div className="relative w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-[#e0ebff] shadow-[0_4px_10px_rgba(60,120,216,0.1)]">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#3c78d8" className="w-5 h-5 opacity-70">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
  </div>
  </div>
  <div className="font-medium text-lg text-[#3c78d8]/80 text-center mb-2">更多精彩</div>
  <div className="font-normal text-[15px] text-[#3c78d8]/60 text-center">敬请期待</div>
  </div>
  </div>
  );

const GoToAppList = () => (
  <div className="flex justify-center mt-8">
  <Link href="/applications?type=platform" className="inline-flex items-center px-6 py-2.5 rounded-full bg-gradient-to-r from-[#3c78d8] to-[#2196f3] text-white font-medium text-sm hover:shadow-lg hover:opacity-90 transition-all duration-300">
    查看更多
  </Link>
</div>
 )

export default async function Home() {
  // 按类型获取应用
  const applications = await getHomeApplications({ type: 'application', limit: 8 });
  const llms = await getHomeApplications({ type: 'llm', limit: 8 });
  const platforms = await getHomeApplications({ type: 'platform', limit: 8 });

  // 序列化处理函数 - 添加这个函数
  const serializeData = (items) => {
    return items.map(item => {
      if (!item || typeof item !== 'object') return item;
      
      // 处理特殊字段，如 MongoDB ObjectId
      return Object.keys(item).reduce((acc, key) => {
        // 如果是 ObjectId，转换为字符串
        if (key === '_id' && item[key] && typeof item[key].toString === 'function') {
          acc[key] = item[key].toString();
        } 
        // 如果是 organizationId 且是 ObjectId
        else if (key === 'organizationId' && item[key] && typeof item[key].toString === 'function') {
          acc[key] = item[key].toString();
        }
        // 其他字段原样保留
        else {
          acc[key] = item[key];
        }
        return acc;
      }, {});
    });
  };

  // 先序列化数据
  const serializedApplications = serializeData(applications);
  const serializedLlms = serializeData(llms);
  const serializedPlatforms = serializeData(platforms);

  // 处理应用展示逻辑
  const processApps = (apps: any[], type: string) => {
    const LAYOUT = {
      lg: { cols: 4, rows: 2, max: 8 }, // 大屏：4列2行=8个
      md: { cols: 3, rows: 3, max: 9 }, // 中屏：3列3行=9个
      sm: { cols: 2, rows: 3, max: 6 } // 小屏：2列3行=6个
      };
      // 如果没有应用，返回一行ComingSoonCard
      if (apps.length === 0) {
      return Array(LAYOUT.lg.cols).fill({ isComingSoon: true });
      }
      // 如果应用数量超过最大限制，显示比限制少1个的应用 + MoreCard
      if (apps.length > LAYOUT.md.max) {
      return [...apps.slice(0, LAYOUT.lg.max - 1), { isMore: true, type }];
      }
      const result = [...apps];
      // 如果应用数量不足一行（4个），补齐到一行
      if (result.length < LAYOUT.lg.cols) {
      const needToFill = LAYOUT.lg.cols - result.length;
      for (let i = 0; i < needToFill; i++) {
      result.push({ isComingSoon: true });
      }
      return result;
      }
      // 如果应用数量大于一行但小于最大限制，补齐到当前行
      const currentRow = Math.ceil(result.length / LAYOUT.lg.cols);
      const targetCount = currentRow * LAYOUT.lg.cols;
      const needToFill = targetCount - result.length;
      if (needToFill > 0) {
      for (let i = 0; i < needToFill; i++) {
      result.push({ isComingSoon: true });
      }
      }
      return result;
      
  };

  const processedApplications = processApps(serializedApplications, 'application');
  const processedLlms = processApps(serializedLlms, 'llm');
  const processedPlatforms = processApps(serializedPlatforms, 'platform');

  return (
    <div className="relative w-full h-full mb-12">
    {isCheckLogin ? <RedirectCmp /> : null}
    <div className="banner relative h-[280px] md:h-[420px] w-full">
      {/* <div className="absolute top-[100px] md:top-[140px] left-[30px] md:left-[80px] z-10 text-black">
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
        className="object-cover"
        priority
      /> */}
      <Particlewaves />
    </div>
    <div className="container bg-white/80 backdrop-blur-sm mt-6 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#e0ebff] px-6 py-8 relative z-[1]">
             {/* 平台展示 */}
             <CategorySection 
               title="AI平台" 
               subtitle="搭建完整AI生态系统" 
               data={processedPlatforms} 
               type="platform" 
             />
            {/* 大模型展示 */}
            <CategorySection 
              title="AI大模型" 
              subtitle="强大的AI引擎，赋能各行各业" 
              data={processedLlms} 
              type="llm" 
            />
            {/* 应用类别展示 */}
            <CategorySection 
              title="AI应用" 
              subtitle="简化工作流程，提升效率" 
              data={processedApplications} 
              type="application" 
            />
      </div>
    </div>
  );
}
