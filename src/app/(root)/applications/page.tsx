import Image from "next/image";
import applicationsBanner from "@/static/img/applications_bg.png";
import IconSearch from "@/static/svg/icon-search.svg";

export default async function ApplicationsPage() {
  return (
    <div className="w-full">
      <div className="select-none h-[248px] relative w-full">
        <div className="absolute top-12 left-0 right-0 z-10">
          <div className="container">
            <div className="text-[40px]">
              <b>源启AI+产品</b>
            </div>
            <div className="text-[#333] mb-4">
              突破性AI技术，开启无限创新机遇
            </div>
            <div className="bg-white border-solid border-[1px] border-[#eee] h-10 w-[616px] rounded-sm overflow-hidden relative">
              <input
                type="text"
                className="outline-none border-none bg-transparent pl-4 pr-8 py-[8px] w-full text-sm text-[#888]"
                placeholder="输入产品名称"
              />
              <Image
                src={IconSearch}
                alt="搜索"
                className="absolute w-4 h-4 right-4 top-3 cursor-pointer hover:opacity-80"
              />
            </div>
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
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">应用列表</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 应用卡片列表 */}
          {/* 这里可以从后端获取数据并渲染 */}
        </div>
      </div>
    </div>
  );
}
