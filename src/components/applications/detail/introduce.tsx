import dynamic from "next/dynamic";
import AppItem from "@/components/applications/item";
// import FileView from "@/components/FileView";

interface IAppDetailIntroduce {
  // sameTypeItems: any[];
  keywords: any[];
  gientechType?: string;
  organizationId?: string;
  shortIntro?:string
  richIntro?:string
  // detail: any;
}

// const FileViewCmp = dynamic(() =>
//   import("@/components/FileView").then((mod) => mod.default)
// );

export default function DetailIntroduce(props: IAppDetailIntroduce) {
  const { keywords, gientechType } = props;

  return (
    <div className="w-full">
      <div className="flex mb-4 items-start">
        <div
          className="flex-1 rounded-xl overflow-hidden"
          style={{
            border: "1px solid #fff",
            background: "linear-gradient(179.8deg, #E9EEFF 0.17%, #FFFFFF 8.4%)"
          }}
        >
          <div className="flex-1  min-h-[calc(100vh-350px)] p-6">
     
            {/* {detail.fileUrl} */}
            {/* <FileView fileSuffix="pdf" filePath={detail.fileUrl} /> */}
            {/* <FileViewCmp fileSuffix="pdf" filePath={detail.fileUrl} /> */}
          </div>
        </div>
        <div
          className="w-[334px] rounded-xl ml-8 overflow-hidden shadow-sidebar p-6 min-h-[calc(100vh-350px)] flex flex-col gap-5"
          style={{
            border: "1px solid #fff",
            background: "linear-gradient(180deg, #ECEFFF 0%, #FFFFFF 51.5%)"
          }}
        >
     {/* 添加关键词模块 */}
     <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">关键词</div>
            <div className="flex flex-wrap gap-2">
              {(keywords || []).map((keyword: string, index: number) => (
                <span
                  key={`keyword-${index}`}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          {/* {(sameTypeItems || []).map((i: any, idx: number) => (
            <AppItem
              key={`same-type-card-${i.cardId}-${idx}`}
              itemData={i}
              hoverStyle={false}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
}
