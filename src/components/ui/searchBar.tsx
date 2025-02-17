"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import IconSearch from "@/static/img/icon-search.png";

interface ISearchBar {
  category: string;
  scene: string;
  kWord?: string;
}

const ENTER_KEY = "Enter";
export default function SearchBar(props: ISearchBar) {
  const { category, scene, kWord = "" } = props;
  const [keyWord, setKeyWord] = useState<string>("");
  const router = useRouter();

  const searchHandler = () => {
    if (keyWord) {
      router.push(
        `/applications?category=${category}&secne=${scene}&keyWord=${keyWord}`
      );
    }
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

  useEffect(() => {
    if (kWord === "") {
      setKeyWord("");
    }
  }, [kWord]);

  return (
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
  );
}
