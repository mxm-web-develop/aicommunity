"use client";
import Image from "next/image";
import IconCollectActive from "@/static/img/icon-collect-active.png";
import IconPraise from "@/static/img/icon-praise.png";

interface ICollectPraiseBtn {
  showPraise?: boolean;
  showCollect?: boolean;
  collectNum?: number;
  praiseNum?: number;
  isPraise?: boolean;
  isCollect?: boolean;
}

export default function CollectPraiseBtn(props: ICollectPraiseBtn) {
  const {
    showPraise = true,
    showCollect = true,
    collectNum = 0,
    praiseNum = 0,
    isPraise = false,
    isCollect = false
  } = props;
  return (
    <div className="flex flex-row-reverse gap-4 text-[#333]">
      {showCollect ? (
        <button className="relative h-[34px] pl-10 pr-4 leading-8 bg-white rounded-lg hover:opacity-85">
          <Image
            src={isPraise ? IconPraise : IconPraise}
            alt=""
            width={16}
            height={16}
            className="text-[#666] absolute left-4 top-2"
          />
          {praiseNum}
        </button>
      ) : null}
      {showPraise ? (
        <button className="relative h-[34px] pl-10 pr-4 leading-8 bg-white rounded-lg hover:opacity-85">
          <Image
            src={isCollect ? IconCollectActive : IconCollectActive}
            alt=""
            width={16}
            height={16}
            className="text-[#055aff] absolute left-4 top-2"
          />
          {collectNum}
        </button>
      ) : null}
    </div>
  );
}
