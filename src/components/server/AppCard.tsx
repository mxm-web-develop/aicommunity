import Link from "next/link";
import Image from "next/image";
import IconOrganization from "@/static/img/icon-organization.png";

interface IAppItem {
  data: any;
  hoverStyle?: boolean;
}

const AppCard = (props: any) => {
  const { data, hoverStyle = true } = props;
  // console.log(data);
  return (
    <div className="h-[248px] ">
      <Link href={`/applications/${data._id}?type=0`}>
        <div
          className={` bg-white p-6 rounded-xl cursor-pointer text-[#333] shadow-sidebar ${hoverStyle ? "hover:shadow-cardHover  hover:h-[248px] hover:text-[#055aff]" : ""}`}
        >
          <div className="font-bold h-14 line-clamp-2  text-lg mb-3">
            {data.name}
          </div>
          <div className="bg-secondary  mb-3 rounded-lg text-xs px-2 py-3 text-sm ">
            <div
              className="text-ellipsis  h-16 line-clamp-4"
              title={data.shortIntro}
            >
              {data.shortIntro}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="relative pl-7 text-sm text-[#888] leading-7 min-w-[60px] h-7">
              <Image
                src={IconOrganization}
                alt=""
                className="absolute top-[2px] left-0 h-6 w-6 select-none"
                priority
              />
              {data.organization}
            </div>
            <div>
              <span
                className="inline-block text-[10px] rounded-[2px] px-4 py-1 bg-[#f8f1e8] text-sm text-[#c08c8c] max-w-32 truncate whitespace-nowrap overflow-hidden"
                title={data.gientechType}
              >
                {data.gientechType.length > 5
                  ? data.gientechType.slice(0, 5) + "..."
                  : data.gientechType}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AppCard;
