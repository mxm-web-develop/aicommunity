'use client'

import AppCard from "@/components/server/AppCard";
import Link from "next/link";

// 创建"查看更多"卡片
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
const ComingSoonCard = () => (
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

const GoToAppList = ({ type }: { type: string }) => (
  <div className="flex justify-center mt-8">
    <Link href={`/applications?type=${type}`} className="inline-flex items-center px-6 py-2.5 rounded-full bg-gradient-to-r from-[#3c78d8] to-[#2196f3] text-white font-medium text-sm hover:shadow-lg hover:opacity-90 transition-all duration-300">
      查看更多
    </Link>
  </div>
);

interface CategorySectionProps {
  title: string;
  subtitle: string;
  data: any[];
  type: 'platform' | 'llm' | 'application';
}

const CategorySection = ({ title, subtitle, data, type }: CategorySectionProps) => {
  return (
    <div className="application-displayer py-5">
      <div className="application-displayer-title text-2xl font-bold text-center text-foreground">
        {title}
      </div>
      <div className="text-sm pt-[8px] pb-[32px] text-muted-foreground text-center">
        {subtitle}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((item, index) => (
          item.isMore ? 
            <MoreCard key={`more-${type}-${index}`} type={type} /> :
            item.isComingSoon ? 
              <ComingSoonCard key={`coming-${type}-${index}`} /> :
              <AppCard key={item._id} data={item} />
        ))}
      </div>
      <GoToAppList type={type} />
    </div>
  );
};

export default CategorySection; 