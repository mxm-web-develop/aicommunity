"use client";
import React, { useState } from "react";
import AppItem from "../application-item";

interface IAppDetailIntroduce {
  sameTypeItems: any[];
  detail: any;
}
export default function DetailIntroduce(props: IAppDetailIntroduce) {
  const { sameTypeItems, detail } = props;
  return (
    <div className="w-full">
      <div className="flex mb-4 items-start">
        <div className="flex-1 rounded-xl bg-white overflow-hidden p-[1px]">
          <div
            className="p-6 min-h-[calc(100vh-350px)]"
            style={{
              background:
                "linear-gradient(179.8deg, #E9EEFF 0.17%, #FFFFFF 8.4%)"
            }}
          >
            detail.fileUrl:{detail.fileUrl}
          </div>
        </div>
        <div className="w-[194px] md:w-[234px] lg:w-[334px] rounded-xl bg-white ml-8 overflow-hidden p-[1px] shadow-sidebar">
          <div
            className="p-6 min-h-[calc(100vh-350px)] flex flex-col gap-5"
            style={{
              background: "linear-gradient(180deg, #ECEFFF 0%, #FFFFFF 51.5%)"
            }}
          >
            {(sameTypeItems || []).map((i: any, idx: number) => (
              <AppItem
                key={`same-type-card-${i.cardId}-${idx}`}
                itemData={i}
                hoverStyle={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
