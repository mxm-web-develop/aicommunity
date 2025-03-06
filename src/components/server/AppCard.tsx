import Link from "next/link";
import Image from "next/image";
import IconOrganization from "@/static/img/icon-organization.png";
import AI from "@/static/svg/AI.svg";
import AIplus from "@/static/svg/AIplus.svg";

// 类型图标SVG组件
const LlmIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00A19A" className="w-5 h-5">
<path d="M16.5 7.5h-9v9h9v-9z" />
<path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" clipRule="evenodd" />
</svg>
);

const ApplicationIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2196F3" className="w-5 h-5">
<path fillRule="evenodd" d="M2.25 6a3 3 0 013-3h13.5a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3V6zm3.97.97a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06zm4.28 4.28a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
</svg>
);

const PlatformIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7b3cda" className="w-5 h-5">
<path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
</svg>
);

interface IAppItem {
  data: any;
  hoverStyle?: boolean;
  simple?: boolean; // 简约模式参数
}

const AppCard = (props: IAppItem) => {
  const { data, hoverStyle = true, simple = false } = props;
  
  // 新增组织图标判断逻辑
  const OrganizationIcon = data.organizationId === '67af16e967cff211db44c6db' 
    ? AI 
    : data.organizationId === '67b291be1ad598b265fce6b6' 
      ? AIplus 
      : AI; // 默认值

  // 根据类型选择图标
  const TypeIcon = () => {
    const type = data.type?.toLowerCase() || '';
    if (type.includes('llm') || type.includes('模型')) return <LlmIcon />;
    if (type.includes('application') || type.includes('应用')) return <ApplicationIcon />;
    if (type.includes('platform') || type.includes('平台')) return <PlatformIcon />;
    return <ApplicationIcon />; // 默认图标
  };

  // 简约模式卡片
  if (simple) {
    return (
      <div className="h-[120px]">
        <Link href={`/applications/${data._id}?type=0`}>
          <div
            className={`bg-white px-4 py-3 rounded-xl cursor-pointer text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.05)] h-full ${
              hoverStyle ? "hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-[#e0ebff]" : ""
            } transition-all duration-300 border border-[#f0f0f0] flex items-center`}
          >
            {/* 类型图标 */}
            <div className="bg-[#f5f9ff] rounded-lg p-1.5 mr-3 shrink-0">
              <div className="text-[#3c78d8]"><TypeIcon /></div>
            </div>
            {/* 主内容区 */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1">
              {/* 名称和描述 */}
              <div>
                <div className="font-medium text-base text-[#2d3748] line-clamp-1 mb-1">
                  {data.name}
                </div>
                <div className="text-xs text-[#718096] line-clamp-1 mb-1">
                  {data.shortIntro}
                </div>
              </div>
              {/* 底部信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-[#718096]">
                  <Image
                    src={OrganizationIcon}
                    alt=""
                    className="h-4 w-4 mr-1"
                    priority
                  />
                  <span className="line-clamp-1">{data.organization}</span>
                </div>
                <div className="flex gap-1">
                  {data.keywords && Array.isArray(data.keywords) && data.keywords.slice(0, 2).map((keyword, index) => (
                    <span
                      key={index}
                      className="text-[10px] bg-[#f5f9ff] text-[#3c78d8]/70 px-1.5 py-0.5 rounded-sm whitespace-nowrap"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // 标准模式卡片
  return (
    <div className="h-[268px]">
      <Link href={`/applications/${data._id}?type=0`}>
        <div
          className={`bg-white p-6 rounded-xl cursor-pointer text-foreground shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full ${
            hoverStyle ? "hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:border-[#e0ebff]" : ""
          } transition-all duration-300 border border-[#f0f6ff]`}
        >
          {/* 首行：类型图标 + 应用名称 */}
          <div className="flex items-start gap-2 h-14 mb-3">
            <div className="bg-[#f5f9ff] rounded-full p-1.5 flex items-center justify-center">
              <div className="text-[#3c78d8]"><TypeIcon /></div>
            </div>
            <div className="font-bold line-clamp-2 text-lg flex-1 text-[#2d3748]">
              {data.name}
            </div>
          </div>

          {/* 第二行：关键词标签 */}
          <div className="flex flex-wrap gap-1 h-[22px] mb-3 overflow-hidden">
            {data.keywords && Array.isArray(data.keywords) && data.keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="text-[10px] bg-[#f5f9ff] text-[#3c78d8]/70 px-2 py-0.5 rounded-sm"
              >
                {keyword}
              </span>
            ))}
            {data.keywords && Array.isArray(data.keywords) && data.keywords.length > 3 && (
              <span
                className="text-[10px] bg-[#f5f9ff] text-[#3c78d8]/70 px-2 py-0.5 rounded-sm"
              >
                ...
              </span>
            )}
          </div>
          
          {/* 第三行：描述 */}
          <div className="bg-[#f8faff] mb-4 rounded-lg text-xs px-3 py-3">
            <div className="text-ellipsis h-16 line-clamp-4 text-[#4a5568]">
              {data.shortIntro}
            </div>
          </div>
          
          {/* 脚部：组织图标和名称 */}
          <div className="flex items-center">
            <div className="relative pl-7 text-sm text-[#718096] leading-7 min-w-[60px] h-7">
              <Image
                src={OrganizationIcon}
                alt=""
                className="absolute top-[2px] left-0 h-6 w-6 select-none"
                priority
              />
              {data.organization}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AppCard;
