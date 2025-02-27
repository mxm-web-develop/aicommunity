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
  const { id } = params; // 直接解构params
  
  // 使用解构后的id
  const itemData = await getApplicationDetails(id) as unknown as Application;
  
  if (!itemData) {
    return notFound();
  }
   console.log(itemData);
  // 4. 使用数据渲染UI
  return (
    <div className="w-full">
      <div className="select-none h-[248px] relative w-full mb-4">
        <div className="container relative right-0 top-10 z-20 text-right">
          <CollectPraiseBtn
            praiseNum={0}
            collectNum={0}
            isCollect={false}
          />
        </div>
        <div className="absolute top-10 left-0 right-0 z-10">
          <div className="container">
            <div className=" text-2xl md:text-4xl mb-1">
              <b>{itemData.name}</b>
            </div>
            <div className="mb-4 mt-5 ">
              <span
                className="inline-block rounded-[2px] px-4 py-1 bg-[#f8f1e8] text-sm text-[#c08c8c]  truncate"
                title={itemData.gientechType}
              >
                {itemData.gientechType}
              </span>
            </div>

            <div className="flex gap-4 text-sm mb-4">
              {itemData.links?.website ? (
                <a 
                  href={itemData.links.website}
                  target="_blank"
                  className="cursor-pointer h-9 px-8 w-[120px] rounded-sm font-bold text-white leading-9 hover:opacity-85 text-center"
                  style={{
                    background:
                      "linear-gradient(99.9deg, #2B69FF -4.18%, #8F91FF 59.48%, #EC8FFF 105.42%)"
                  }}
                >
                  立即体验
                </a>
              ) : (
                <div
                  className="cursor-not-allowed h-9 px-8 w-[120px] rounded-sm font-bold text-white leading-9 bg-gray-400 text-center"
                >
                  暂无试用
                </div>
              )}
       
            </div>
            <DetailTabs detailTabs={detailTabs}  />
          </div>
        </div>
        <Image
          src={applicationDetailBanner}
          alt=""
          fill
          className="object-cover h-[248px]"
          priority
        />
      </div>
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
            
            {/* {(!type || type === detailTabs[0].key) ? (
              <DetailIntroduce
                keywords={itemData.keywords}
                gientechType={itemData.gientechType}
                shortIntro={itemData.shortIntro}
                richIntro={itemData.productIntro_id}
                contact={itemData.contact}
                organizationId={itemData.organizationId}
              />
            ) : type === detailTabs[1].key ? (
              <DetailAssets detail={itemData.assets} />
            ) : null} */}
          </div>
    </div>
  );
}

