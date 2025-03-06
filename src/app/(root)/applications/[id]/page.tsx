// 使用 dynamic = 'force-static' 来启用静态生成，但首次访问时生成
export const dynamic = 'force-static'
export const revalidate = 43200  // 12小时缓存

import Image from "next/image";
import applicationDetailBanner from "@/static/img/application_details_banner.png";
import { cardList, detailTabs } from "@/constants";
import CollectPraiseBtn from "@/components/ui/collect-praise-btn";
// import DetailIntroduce from "@/components/applications/detail/introduce";
// import DetailAssets from "@/components/applications/detail/assets";
// import DetailContacts from "@/components/applications/detail/contact";
// import DetailTabs from "@/components/applications/detail/detail-tabs";
// import { fetchApi } from "@/lib/fetchapi";
// import { redirect, useSearchParams } from 'next/navigation';
import { getApplications } from "@/lib/service/getApplications";
import { getApplicationDetails } from "@/lib/service/getApplicationDetails";
import { notFound } from "next/navigation";
import DetailTabs from "@/components/applications/detail/detail-tabs";
import DetailIntroduce from "@/components/client/DetailPannel";
import DetailAssets from "@/components/applications/detail/assets";
import DetailPannel from "@/components/client/DetailPannel";

interface ApplicationPageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
export interface Application {
  _id: string;
  name: string;
  gientechType: string;
  shortIntro: string;
  links?: {
    website?: string;
  };
  contact?: any;
  assets?: any;
  productIntro_id?: string;
  keywords?: string[];
  organizationId: string;
}
// 1. 生成所有可能的路径
export async function generateStaticParams() {
  try {
    const applications = await getApplications({
      limit: 1000
    });
    
    return applications.map((app: any) => ({
      id: app._id.toString()
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// 2. 页面组件会为每个 id 执行一次
export default async function ApplicationPage({ params }: ApplicationPageProps) {
  // 正确获取动态路由参数（移除await）
  const { id } = await params; // 直接解构params
  
  // 使用解构后的id
  const itemData = await getApplicationDetails(id) as unknown as Application;
  
  if (!itemData) {
    return notFound();
  }
   console.log(itemData);
  // 4. 使用数据渲染UI
  return (
    <div className="w-full">
      <div className="relative h-[248px] w-full mb-4">
        {/* 背景图容器 */}
        <div className="absolute inset-0 z-0">
          <Image
            src={applicationDetailBanner}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 内容容器 */}
        <div className="container relative z-10 h-full flex flex-col">
          <div className="self-end pt-6">
            <CollectPraiseBtn
              praiseNum={0}
              collectNum={0}
              isCollect={false}
            />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-3xl">
              <h1 className="text-2xl md:text-4xl font-bold mb-2 text-foreground">
                {itemData.name}
              </h1>
              
              {/* 标签样式更新 */}
              <div className="my-4">
                <span className="inline-block rounded px-4 py-1 bg-tag/40 text-muted-foreground text-sm">
                  {itemData.gientechType}
                </span>
              </div>

              {/* 按钮样式更新 */}
              <div className="flex gap-4 mb-2">
                {itemData.links?.website ? (
                  <a 
                    href={itemData.links.website}
                    target="_blank"
                    className="inline-flex items-center justify-center h-9 px-6 rounded-sm font-medium bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    立即体验
                  </a>
                ) : (
                  <button 
                    className="inline-flex items-center justify-center h-9 px-6 rounded-sm font-medium bg-muted text-muted-foreground cursor-not-allowed"
                    disabled
                  >
                    暂无试用
                  </button>
                )}
              </div>

              {/* Tab组件样式 */}
              <DetailTabs detailTabs={detailTabs} />
            </div>
          </div>
        </div>
      </div>

      {/* 下方内容区域 */}
      <div className="container">
        <DetailPannel
          keywords={itemData.keywords}
          gientechType={itemData.gientechType}
          shortIntro={itemData.shortIntro}
          richIntro={itemData.productIntro_id}
          contact={itemData.contact}  
          organizationId={itemData.organizationId}
          appId={id}
        />
      </div>
    </div>
  );
}

