"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import DetailContactBg from "@/static/img/detail-contact-bg.png";

interface IAppDetailContacts {
  detail: any;
}
export default function DetailContacts(props: IAppDetailContacts) {
  const { detail } = props;
  const { contactList } = detail;
  return (
    <div className="w-full bg-white rounded-xl p-[1px] mb-4">
      <div
        className="overflow-hidden z-50 relative"
        style={{
          background: "linear-gradient(179.8deg, #E9EEFF 0.17%, #FFFFFF 8.4%)"
        }}
      >
        <div className="p-6 min-h-[calc(100vh-350px)]">
          <div className="font-bold text-[#333] tex-llg mb-5">联系人</div>
          {(contactList || []).map((i: any, idx: number) => (
            <div
              key={`detail-contact-${idx}`}
              className="bg-[#eee] rounded-lg p-[1px] overflow-hidden  mb-4"
            >
              <div className="bg-white rounded-lg h-[77px] leading-[77px]">
                {JSON.stringify(i)}
              </div>
            </div>
          ))}
        </div>
        <Image
          src={DetailContactBg}
          alt=""
          className="object-cover absolute z-10 left-40% right-[8%] -bottom-2 max-w-[714px]"
          priority
        />
      </div>
    </div>
  );
}
