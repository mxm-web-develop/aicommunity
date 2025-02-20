// import dynamic from "next/dynamic";
import Image from "next/image";
import applicationDetailBanner from "@/static/img/application_details_banner.png";
import { cardList, detailTabs } from "@/constants";
import CollectPraiseBtn from "@/components/ui/collect-praise-btn";
import DetailIntroduce from "@/components/applications/detail/introduce";
import DetailAssets from "@/components/applications/detail/assets";
import DetailContacts from "@/components/applications/detail/contact";
import DetailTabs from "@/components/applications/detail/detail-tabs";
import { fetchApi } from "@/lib/fetchapi";
import { redirect } from 'next/navigation';

interface ApplicationPageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
// export async function generateStaticParams() {
//   // 构建时返回一个空数组，允许所有路径在运行时动态生成
//   if (process.env.NODE_ENV === 'production') {
//     console.log('Production build: Skipping API calls during build');
//     return [];
//   }

//   try {
//     const { data: applications } = await fetchApi('/api/applications/ai', {
//       next: { revalidate: 43200 }
//     });
    
//     return applications?.map((app: any) => ({
//       id: app._id.toString()
//     })) || [];
    
//   } catch (error) {
//     console.error('Error in generateStaticParams:', error);
//     return [];
//   }
// }
export default async function ApplicationPage({ params, searchParams }: ApplicationPageProps) {

  const { id } = await params;
  const { type } = await searchParams;

  // 如果没有type参数，重定向到带有type=0的URL
  if (!type) {
    redirect(`/applications/${id}?type=0`);
  }

  try {
    // 获取应用详情数据
    console.log('Fetching application details for id:', id);
    const response = await fetchApi(`/api/applications?id=${id}`, {next: {revalidate: 7200}});
    console.log('API Response:', response);
    
    if (!response.success) {
      throw new Error(response.error || '获取应用详情失败');
    }
    
    const { data: itemData } = response;
    
    if (!itemData) {
      throw new Error('未找到应用数据');
    }

    return (
      <div className="w-full">
        <div className="select-none h-[248px] relative w-full mb-4">
          <div className="container relative right-0 top-10 z-20 text-right">
            <CollectPraiseBtn
              praiseNum={itemData.praiseCount || 0}
              collectNum={itemData.collectCount || 0}
              isCollect={itemData.isCollected || false}
            />
          </div>
          <div className="absolute top-10 left-0 right-0 z-10">
            <div className="container">
              <div className="text-[40px] mb-1">
                <b>{itemData.name}</b>
              </div>
              <div className="mb-3">
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
              <DetailTabs detailTabs={detailTabs} type={type} id={id} />
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
          {(!type || type === detailTabs[0].key) ? (
            <DetailIntroduce
              keywords={itemData.keywords}
              gientechType={itemData.gientechType}
              shortIntro={itemData.shortIntro}
              richIntro={itemData.productIntro_id}
              contact={itemData.contact}
              organizationId={itemData.organizationId}
              // detail={itemData.detail}
            />
          ) : type === detailTabs[1].key ? (
            <DetailAssets detail={itemData.assets} />
          ) : type === detailTabs[2].key ? (
            <DetailContacts detail={itemData.contact} />
          ) : null}
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('Error fetching application:', error);
    // 可以返回一个错误状态组件
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-red-500">加载失败</h1>
        <p>获取应用详情时出现错误，请稍后重试</p>
      </div>
    );
  }
};

