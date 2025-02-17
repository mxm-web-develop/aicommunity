"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import DetailContactBg from "@/static/img/detail-contact-bg.png";
import IconPerson from "@/static/img/icon-person.png";
import IconPhone from "@/static/img/icon-phone.png";
import IconMail from "@/static/img/icon-mail.png";

interface IAppDetailContacts {
  detail: any;
}
export default function DetailAssets(props: IAppDetailContacts) {
  const { detail } = props;
  const { contactList } = detail;
  return (
    <div
      className="w-full rounded-xl mb-4 overflow-hidden z-50 relative"
      style={{
        border: "1px solid #fff",
        background: "linear-gradient(179.8deg, #E9EEFF 0.17%, #FFFFFF 8.4%)"
      }}
    >
      <div className="p-6 min-h-[calc(100vh-350px)]">
        <div className="font-bold text-[#333] tex-llg mb-5">静态资源列表</div>

        {(contactList || []).map((i: any, idx: number) => (
          <div
            key={`detail-contact-${idx}`}
            className="bg-[#eee] rounded-lg p-[1px] mb-4"
          >
            <div className="bg-white rounded-lg h-[77px] leading-[45px] p-4 flex text-black text-sm">
              <div className="relative pl-[60px] flex-1">
                <div className="absolute z-10 left-0 select-none w-11 h-11 bg-[#f5f9ff] rounded-full pl-[5px] pt-2">
                  <Image
                    src={IconPerson}
                    alt=""
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="min-w-20">
                  <div className="text-[#333] text-base">{i.name}</div>
                  <div className="text-[#999] text-xs leading-6">{i.role}</div>
                </div>
              </div>
              <div className="relative pl-9 flex-1">
                <div className="absolute z-10 left-0 top-3 select-none w-6 h-6 bg-[#f5f9ff] rounded-full pl-1 pt-1">
                  <Image
                    src={IconPhone}
                    alt=""
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="min-w-20">{i.phone}</div>
              </div>
              <div className="relative pl-9 flex-1">
                <div className="absolute z-10 left-0 top-3 select-none w-6 h-6 bg-[#f5f9ff] rounded-full pl-1 pt-1">
                  <Image
                    src={IconMail}
                    alt=""
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="min-w-40">{i.mail}</div>
              </div>
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
  );
}
