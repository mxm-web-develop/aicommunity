"use client";
import Link from "next/link";
import Image from "next/image";
import IconOrganization from "@/static/img/icon-organization.png";

interface IAppItem {
  itemData: any;
  hoverStyle?: boolean;
  onClick?: () => void;
}

const ApplicationItem = (props: IAppItem) => {
  const { itemData, onClick, hoverStyle = true } = props;
  const cardClickHandler = () => {
    onClick && onClick();
  };

  return (
    <div className="h-[248px]">
      <Link href={`/applications/${itemData.cardId}`}>
        <div
          className={`h-[246px] bg-white  p-6 rounded-xl cursor-pointer text-[#333] shadow-sidebar ${hoverStyle ? "hover:shadow-cardHover  hover:h-[248px] hover:text-[#055aff]" : ""}`}
          onClick={cardClickHandler}
        >
          <div className="font-bold  text-llg mb-3">{itemData.title}</div>
          <div className="bg-[#fafafa] mb-10 rounded-lg p-5 text-sm text-[#666]">
            <div className="text-ellipsis line-clamp-2" title={itemData.desc}>
              {itemData.desc}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="relative pl-7 text-sm text-[#888] leading-6">
              <Image
                src={IconOrganization}
                alt=""
                className="absolute top-0 left-0 h-6 w-6 select-none"
                priority
              />
              {itemData.organization}
            </div>
            <div>
              <span
                className="inline-block  rounded-[2px] px-4 py-1 bg-[#f8f1e8] text-sm text-[#c08c8c] max-w-32 truncate"
                title={itemData.scene}
              >
                {itemData.scene}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ApplicationItem;
