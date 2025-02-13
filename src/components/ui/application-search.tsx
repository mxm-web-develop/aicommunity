"use client";
import React, { useState, useRef } from "react";

const ENTER_KEY = "Enter";
const ApplicationSearch = () => {
  const [keyWord, setKeyWord] = useState<string>("");

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
      <img
        src="/icon-search.svg"
        alt="搜索"
        className="absolute w-4 h-4 right-4 top-3 cursor-pointer hover:opacity-80"
        onClick={searchHandler}
      />
    </div>
  );
};

export default ApplicationSearch;
