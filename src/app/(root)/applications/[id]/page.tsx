// import dynamic from "next/dynamic";
import Image from "next/image";
import applicationDetailBanner from "@/static/img/application_details_banner.png";
import { cardList, detailTabs } from "@/constants";
import CollectPraiseBtn from "@/components/ui/collect-praise-btn";
import DetailIntroduce from "@/components/applications/detail/introduce";
import DetailAssets from "@/components/applications/detail/assets";
import DetailContacts from "@/components/applications/detail/contact";
import DetailTabs from "@/components/applications/detail/detail-tabs";
interface ApplicationPageProps {
  params: {
    id: string;
  };
  searchParams: {
    type?: string;
  };
}

// const ApplicationCmp = dynamic(
//   () =>
//     import("@/components/ui/applications/detail").then((mod) => mod.default),
//   {
//     loading: () => <p>Loading chat...</p>
//   }
// );

const ApplicationPage = async ({
  params,
  searchParams
}: ApplicationPageProps) => {
  const { id } = await params;
  const { type = detailTabs[0].key } = await searchParams;
  const itemData = await cardList.find((i: any) => i.cardId.toString() === id);

  const { sceneId } = itemData;
  const sameTypeItems = sceneId
    ? cardList.filter(
        (i: any) => i.sceneId === sceneId && i.cardId.toString() !== id
      )
    : [];

  return (
    <div className="w-full">
      <div className="select-none h-[248px] relative w-full mb-4">
        <div className="container relative right-0 top-10 z-20 text-right">
          <CollectPraiseBtn
            praiseNum={2356}
            collectNum={235}
            isCollect={true}
          />
        </div>
        <div className="absolute top-10 left-0 right-0 z-10">
          <div className="container">
            <div className="text-[40px] mb-1">
              <b>{itemData.title}</b>
            </div>
            <div className="mb-3">
              <span
                className="inline-block rounded-[2px] px-4 py-1 bg-[#f8f1e8] text-sm text-[#c08c8c] max-w-32 truncate"
                title={itemData.scene}
              >
                {itemData.scene}
              </span>
            </div>
            <div className="flex gap-4 text-sm mb-4">
              <div
                className="cursor-pointer h-9 px-8 w-[120px] rounded-sm font-bold text-white leading-9 hover:opacity-85"
                style={{
                  background:
                    "linear-gradient(99.9deg, #2B69FF -4.18%, #8F91FF 59.48%, #EC8FFF 105.42%)"
                }}
              >
                立即体验
              </div>
              <div className="w-[120px] text-center bg-white px-8 h-9 leading-9 text-[#055aff] cursor-pointer rounded-sm border-[1px] border-[#eee] border-solid hover:opacity-85">
                xxxxxx
              </div>
              <div className="w-[120px] text-center bg-white px-8 h-9 leading-9 text-[#055aff] cursor-pointer rounded-sm border-[1px] border-[#eee] border-solid hover:opacity-85">
                xxxxxx
              </div>
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
        {type === detailTabs[0].key ? (
          <DetailIntroduce
            sameTypeItems={sameTypeItems}
            detail={itemData.detail}
          />
        ) : type === detailTabs[1].key ? (
          <DetailAssets detail={itemData.detail} />
        ) : type === detailTabs[2].key ? (
          <DetailContacts detail={itemData.detail} />
        ) : null}
      </div>
    </div>
  );
};

export default ApplicationPage;
