// import dynamic from "next/dynamic";
import Image from "next/image";
import applicationsBanner from "@/static/img/applications_bg.png";
import LeftBar from "@/components/applications/left-bar";
import AppItem from "@/components/applications/item";
import SearchBar from "@/components/ui/searchBar";
import { categorys, sceneList, cardList, allRow } from "@/constants";
import { fetchApi } from "@/lib/fetchapi";
import AppCard from "@/scomponents/AppCard";

interface ApplicationPageQueryProps {
  category?: string;
  scene?: string;
  keyWord?: string;
}

const ApplicationsPage = async ({
  searchParams
}: {
  searchParams: ApplicationPageQueryProps;
}) => {
  const { success, data: AIapplications } = await fetchApi(
    "/api/applications/ai",
    { next: { revalidate: 3600 } }
  );
  const { success: success2, data: AIapplications2 } = await fetchApi(
    "/api/applications/aiplus",
    { next: { revalidate: 3600 } }
  );

  return (
    <div className="w-full">
      <div className="select-none h-[248px] relative w-full mb-10">
        <div className="absolute top-12 left-0 right-0 z-10">
          <div className="container">
            <div className="text-[40px]">
              <b>产品与服务</b>
            </div>
            <div className="text-[#333] mb-4">
              突破性AI技术，开启无限创新机遇
            </div>
            <SearchBar />
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
      <div className="container">
        <div className="flex flex-col  mb-10 items-start ">
          <div>
            <div className="text-[24px] font-bold mb-4">AI产品与服务</div>
            <div className="h-[1px] w-full bg-gray-200 m-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AIapplications.map((application: any) => (
                <AppCard key={application._id} data={application} />
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="text-[24px] font-bold mb-4">AI+产品与服务</div>
            <div className="h-[1px] w-full bg-gray-200 m-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AIapplications2.map((application: any) => (
                <AppCard key={application._id} data={application} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
