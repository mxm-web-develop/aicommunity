"use client";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import applicationsBanner from "@/static/img/applications_bg.png";
import IconSearch from "@/static/img/icon-search.png";
import AppCategory from "./application-category";
import AppItem from "./application-item";
import { categorys, sceneList, cardList, allRow } from "@/constants";

const ENTER_KEY = "Enter";
export default function Applications(props: any) {
  const [keyWord, setKeyWord] = useState<string>("");
  const [category, setCategory] = useState<string>(categorys[0].key);
  const [scene, setScene] = useState<number>(allRow.id);
  const [filteredList, setFilteredList] = useState(cardList);

  useEffect(() => {
    let _list = [] as any[];
    switch (category) {
      case allRow.id.toString():
        _list =
          scene === allRow.id
            ? cardList
            : cardList.filter((j: any) => j.sceneId === scene);
        break;
      default:
        _list =
          scene === allRow.id
            ? cardList.filter((j: any) =>
                sceneList
                  .filter((i: any) => i.type === category)
                  .map((i: any) => i.id)
                  .includes(j.sceneId)
              )
            : cardList.filter((j: any) => j.sceneId === scene);
        break;
    }
    const filtered = _list.filter((i: any) => 
      JSON.stringify(i).indexOf(keyWord) >= 0
    );
    setFilteredList(filtered);
  }, [cardList, scene, category, keyWord]);

  const searchHandler = () => {
    console.log("搜索关键字:", keyWord);
  };

  const keyDownHandler = (e: any) => {
    const { key, code, keyCode } = e;
    if (key === ENTER_KEY && code === ENTER_KEY && keyCode === 13) {
      searchHandler();
    }
  };

  const keyWordChangeHandler = (e: any) => {
    setKeyWord(e.target.value.trim()); // 更新状态
  };

  const sceneChangeHandler = (sceneId: number, category: string) => {
    setCategory(category);
    setScene(sceneId);
  };

  const itemClickHandler = (item: any) => () => {
    console.log(item);
    // router.push(`/applications/${item.cardId}`);
  };

  return (
    <div className="w-full">
      <div className="select-none h-[248px] relative w-full mb-10">
        <div className="absolute top-12 left-0 right-0 z-10">
          <div className="container">
            <div className="text-[40px]">
              <b>源启AI+产品</b>
            </div>
            <div className="text-[#333] mb-4">
              突破性AI技术，开启无限创新机遇
            </div>
            <div className="bg-white border-solid border-[1px] border-[#eee] h-10 w-[616px] rounded-sm overflow-hidden relative">
              <input
                value={keyWord}
                type="text"
                className="outline-none border-none bg-transparent pl-4 pr-8 py-[8px] w-full text-sm text-[#888]"
                placeholder="输入产品名称"
                onKeyDown={keyDownHandler}
                onChange={keyWordChangeHandler}
              />
              <Image
                src={IconSearch}
                alt="搜索"
                className="absolute w-4 h-4 right-4 top-3 cursor-pointer text-red-500 hover:opacity-80"
                onClick={searchHandler}
                priority
              />
            </div>
          </div>
        </div>
        <Image
          src={applicationsBanner}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="container mx-auto">
        <div className="flex mb-10 items-start">
          <div className="w-[194px] md:w-[234px] lg:w-[334px] bg-white rounded-xl p-5 mr-8 shadow-sidebar">
            <div className="font-bold text-llg text-[#333]">全部产品</div>
            <AppCategory
              sceneList={sceneList}
              sceneChangeHandler={sceneChangeHandler}
            />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredList || []).map((i: any, idx: number) => (
              <AppItem
                key={`card-${i.cardId}-${idx}`}
                itemData={i}
                onClick={itemClickHandler(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
