"use client";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import IconCategory from "@/static/img/icon-category.png";
import IconCategoryActive from "@/static/img/icon-category-active.png";
import { categorys, allRow } from "@/constants";

interface IAppCategory {
  sceneList: any[];
  sceneChangeHandler: (scene: number, category: string) => void;
}

const ApplicationCategory = (props: IAppCategory) => {
  const { sceneList, sceneChangeHandler } = props;
  const [category, setCategory] = useState<string>(String(categorys[0].key));
  const [scene, setScene] = useState<number>(Number(allRow.id));

  const categoryList = useMemo(() => {
    const _sceneList = [...sceneList];
    _sceneList.unshift(Object.assign({}, allRow, { type: category }));
    switch (category) {
      case categorys[1].key:
      case categorys[2].key:
        return (_sceneList || []).filter((i: any) => i.type === category);
      default:
        return _sceneList || [];
    }
  }, [sceneList, category]);

  const categoryTabClickHandler = (tabKey: string) => () => {
    if (category !== tabKey) {
      setCategory(tabKey);
      sceneChangeHandler(allRow.id, tabKey);
    }
  };

  const sceneClickHandle = (sceneId: number) => () => {
    if (scene !== sceneId) {
      setScene(sceneId);
      sceneChangeHandler(sceneId, category);
    }
  };

  useEffect(() => {
    if (categoryList.length) {
      setScene(categoryList[0].id);
    } else {
      setScene(Number(allRow.id));
    }
  }, [categoryList]);

  return (
    <div className="mt-5">
      <div className="flex mb-5">
        {(categorys || []).map((i: any, idx: number) => (
          <span
            className={`inline-block px-3 py-1 rounded-sm min-w-10 ${category === i.key ? "font-bold text-white" : "cursor-pointer text-[#333] hover:opacity-85"}`}
            style={{
              background:
                category === i.key
                  ? "linear-gradient(99.9deg, #2B69FF -4.18%, #8F91FF 59.48%, #EC8FFF 105.42%)"
                  : "transparent"
            }}
            key={`category-tab-${idx}`}
            onClick={categoryTabClickHandler(i.key)}
          >
            {i.label}
          </span>
        ))}
      </div>
      {categoryList.map((i: any, idx: number) => (
        <div
          className={`relative truncate h-[42px] mb-1 text-sm text-[#333] leading-10 pl-[44px] pr-4 rounded-lg ${scene === i.id ? "font-bold text-white" : " cursor-pointer hover:opacity-85"}`}
          key={`scene-${i.id}-${idx}`}
          style={{
            background:
              scene === i.id
                ? "linear-gradient(99.9deg, #2B69FF -4.18%, #8F91FF 59.48%, #EC8FFF 105.42%)"
                : "transparent"
          }}
          title={i.content}
          onClick={sceneClickHandle(i.id)}
        >
          <Image
            src={scene !== i.id ? IconCategory : IconCategoryActive}
            alt=""
            className="absolute top-3 left-4 h-4 w-4 mr-3 select-none" // 使用 brightness 或其他滤镜
            priority
          />
          {i.content}
        </div>
      ))}
    </div>
  );
};

export default ApplicationCategory;
