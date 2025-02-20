import dynamic from "next/dynamic";
import AppItem from "@/components/applications/item";
// import FileView from "@/components/FileView";

interface Contact {
  email: string;
  label: string;
  name: string;
  _v?: number;
  _id: string;
}

interface IAppDetailIntroduce {
  // sameTypeItems: any[];
  keywords: any[];
  gientechType?: string;
  organizationId?: string;
  shortIntro?:string
  richIntro?:string
  contact?: Contact[];
  // detail: any;
}

// const FileViewCmp = dynamic(() =>
//   import("@/components/FileView").then((mod) => mod.default)
// );

export default function DetailIntroduce(props: IAppDetailIntroduce) {
  const { keywords, gientechType,organizationId, shortIntro } = props;
 
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
            <div className="text-lg py-3 font-medium">应用介绍</div>
            <article className="prose prose-sm md:prose-base  prose-slate max-w-none">
              {shortIntro || '没有应用介绍'}
            </article>
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
        {/* 添加联系人模块 */}
        
        <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">联系人</div>
            <div className="flex flex-col gap-3">
              {props.contact && props.contact.length > 0 ? (
                props.contact.map((contact) => (
                  <div key={contact._id} className="flex flex-col gap-1 p-3 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2">
                      <span className="">{contact.name}</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        {contact.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {contact.email}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">暂无联系人信息</div>
              )}
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}
