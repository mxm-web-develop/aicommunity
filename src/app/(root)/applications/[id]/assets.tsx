import Image from "next/image";
import IconFilePdf from "@/static/img/icon-pdf.png";
import IconView from "@/static/img/icon-view.png";
import IconDownload from "@/static/img/icon-download.png";

interface IAppDetailContacts {
  detail: any;
}
export default function DetailAssets(props: IAppDetailContacts) {
  const { detail } = props;
  const { assets } = detail;
  return (
    <div className="bg-white">
      <div
        className="w-full rounded-xl mb-4 overflow-hidden z-50 relative"
        style={{
          border: "1px solid #fff",
          background:
            "linear-gradient(0deg, #FFFFFF, #FFFFFF),linear-gradient(179.8deg, #E9EEFF 0.17%, #FFFFFF 8.4%)"
        }}
      >
        <div className="p-6 min-h-[calc(100vh-350px)] text-[#333] text-sm leading-[54px]">
          <div className="font-bold text-[#333] tex-llg mb-5">静态资源列表</div>
          <div className="flex h-[54px] leading-[54px] bg-[#fafafa] border-0 border-solid border-[#e8e8e8] border-b-[1px]">
            <div className="px-4 flex-1 min-w-[222px]">名称</div>
            <div className="px-4 w-32 text-right">大小</div>
            <div className="px-4 w-40">更新时间</div>
            <div className="px-4 w-32">操作</div>
          </div>
          {(assets || []).map((i: any, idx: number) => (
            <div
              key={`detail-asset-${idx}`}
              className="flex h-[54px] leading-[54px] bg-white border-0 border-solid border-[#e8e8e8] border-b-[1px]"
              title={i.fileName}
            >
              <div className="pr-4 flex-1 min-w-[222px] relative pl-10">
                <Image
                  src={IconFilePdf}
                  alt=""
                  className="object-cover absolute z-10 left-4 top-[18px] select-none w-4 h-4"
                  priority
                />
                <div className="truncate">{i.fileName}</div>
              </div>
              <div className="px-4 w-32 text-right">{i.fileSize}</div>
              <div className="px-4 w-40">{i.updateTime}</div>
              <div className="px-4 w-32 flex items-center gap-6">
                <Image
                  src={IconView}
                  alt=""
                  className="object-cover select-none w-4 h-4 cursor-pointer hover:opacity-85"
                  priority
                />
                <Image
                  src={IconDownload}
                  alt=""
                  className="object-cover select-none w-4 h-4 cursor-pointer hover:opacity-85"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
