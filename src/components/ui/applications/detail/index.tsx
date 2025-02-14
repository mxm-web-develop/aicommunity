"use client";
import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import applicationDetailBanner from "@/static/img/application_details_banner.png";
import DetailIntroduce from "./introduce";
import DetailAssets from "./assets";
import DetailContacts from "./contact";
import { detailTabs } from "@/constants";

interface IAppDetail {
  sameTypeItems: any[];
  itemData: any;
}
export default function ApplicationDetail(props: IAppDetail) {
  const { itemData, sameTypeItems } = props;
  const [curTab, setCurTab] = useState<string>(detailTabs[0].key);

  const detailTabClickHandler = (tabKey: string) => () => {
    if (curTab !== tabKey) {
      setCurTab(tabKey);
    }
  };

  const RenderContent = useCallback(() => {
    switch (curTab) {
      case detailTabs[0].key:
        return (
          <DetailIntroduce
            sameTypeItems={sameTypeItems}
            detail={itemData.detail}
          />
        );
      case detailTabs[1].key:
        return <DetailAssets />;
      case detailTabs[2].key:
        return <DetailContacts detail={itemData.detail} />;
    }
  }, [curTab, itemData]);

  return (
    <div className="w-full">
      <div className="select-none h-[248px] relative w-full mb-4">
        <div className="absolute top-10 left-0 right-0 z-10">
          <div className="container">
            <div className="text-[40px]">
              <b>{itemData.title}</b>
            </div>
            <div className="mb-3">
              <span
                className="inline-block rounded-[2px] px-4 py-1 bg-[#f8f1e8] text-sm text-[#c08c8c] max-w-32 truncate"
                title={itemData.scene}
              >
                {itemData.scene}
              </span>
            </div>
            <div className="flex gap-4 text-sm mb-5">
              <div
                className="cursor-pointer h-9 px-8 w-[120px] rounded-sm font-bold text-white leading-9 hover:opacity-85"
                style={{
                  background:
                    "linear-gradient(99.9deg, #2B69FF -4.18%, #8F91FF 59.48%, #EC8FFF 105.42%)"
                }}
              >
                立即体验
              </div>
              <div className="w-[120px] text-center bg-white px-8 h-9 leading-9 text-[#055aff] cursor-pointer rounded-sm border-[1px] border-[#eee] border-solid hover:opacity-85">
                xxxxxx
              </div>
              <div className="w-[120px] text-center bg-white px-8 h-9 leading-9 text-[#055aff] cursor-pointer rounded-sm border-[1px] border-[#eee] border-solid hover:opacity-85">
                xxxxxx
              </div>
            </div>
            <div className="flex gap-8 text-[#333] text-base">
              {(detailTabs || []).map((i: any) => (
                <div
                  key={`detail-tab-${i.key}`}
                  className={`relative h-12 leading-[48px] ${curTab === i.key ? "font-bold text-[#055aff]" : "cursor-pointer"}`}
                  onClick={detailTabClickHandler(i.key)}
                >
                  {i.label}
                  <b
                    className={`inline-block w-full absolute bottom-0 left-0 right-0 border-none h-[2px] bg-[#055aff] ${curTab === i.key ? "" : "hidden"}`}
                  ></b>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Image
          src={applicationDetailBanner}
          alt=""
          fill
          className="object-cover h-[248px]"
          priority
        />
      </div>
      <div className="container mx-auto">
        <RenderContent />
      </div>
    </div>
  );
}
