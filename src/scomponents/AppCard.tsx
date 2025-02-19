// export default function AppCard({ application }: { application: any }) {
//   return (
//     <div 
//       className="bg-white w-full py-[24px] shadow-none  rounded-lg p-4 hover:shadow-[0_8px_12px_-3px_rgba(141,155,193,0.4)] transition-all ease-in-out duration-300"
//     >
//       <div className="text-md">title</div>
//       <div className="text-sm text-gray-500 my-2 bg-[#f5f5f5] rounded p-2" style={{ height: '80px' }}>description</div>

//       <div className="flex items-center w-full justify-between ">
//         <div className="text-sm text-gray-500">left</div>
//         <div className="text-sm text-gray-500">right</div>
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import Image from "next/image";
import IconOrganization from "@/static/img/icon-organization.png";

interface IAppItem {
  data: any;
  hoverStyle?: boolean;
}

const AppCard = (props: any) => {
  const { data, hoverStyle = true } = props;

  return (
    <div className="h-[248px] ">
      <Link href={`/applications/${data.cardId}`}>
        <div
          className={`h-[246px] bg-white p-6 rounded-xl cursor-pointer text-[#333] shadow-sidebar ${hoverStyle ? "hover:shadow-cardHover  hover:h-[248px] hover:text-[#055aff]" : ""}`}
        >
          <div className="font-bold  text-llg mb-3">{data.title}</div>
          <div className="bg-[#fafafa] mb-10 rounded-lg p-5 text-sm text-[#666]">
            <div className="text-ellipsis line-clamp-2" title={data.desc}>
              {data.desc}
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
                className="inline-block rounded-[2px] px-4 py-1 bg-[#f8f1e8] text-sm text-[#c08c8c] max-w-32 truncate"
                title={data.scene}
              >
                {data.scene}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AppCard;
