"use client";
import Image from "next/image";
import IconFilePdf from "@/static/img/icon-pdf.png";
import IconView from "@/static/img/icon-view.png";
import IconDownload from "@/static/img/icon-download.png";
import { useEffect, useMemo, useState } from "react";
import FileView from "@/components/FileView";
import { registerPDFWorker } from "../../@mxmweb/fv";
import { useParams, useSearchParams } from "next/navigation";
registerPDFWorker("/worker/pdf.worker.min.js");
interface IAppDetailContacts {
  detail: any;
}
const BaseUrl = "http://45.77.12.232:9000";
export default function DetailAssets(props: IAppDetailContacts) {
  const params = useParams<{ id: string }>();
  const dynamicId = params.id;
  const { detail } = props;
  const assets = useMemo(() => {
    return (detail?.length ? detail : ["“两高一弱”问题规则-中电金信.pdf"]).map(
      (item: any) => {
        const arr = item.split("/");
        const arr2 = arr[arr.length - 1].split(".");
        return {
          name: arr2[0],
          url: `/${dynamicId}/${item}`,
          type: arr2[1]
        };
      }
    );
  }, [detail]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [curFileInfo, setCurFileInfo]: any = useState({});
  const handlerEvent = (type: string, data?: any) => {
    switch (type) {
      case "view":
        setCurFileInfo({
          fileName: data.name,
          filePath: `${BaseUrl}${data.url}`,
          fileSuffix: data.type
        });
        setShowPreviewModal(true);
        break;
      case "download":
        handleDownload(`${BaseUrl}${data.url}`, data.name);
        break;
    }
  };

  const handleDownload = (filePath: string, fileName: string) => {
    if (filePath) {
      fetch(filePath, {
        method: "GET",
        headers: {}
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob(); // 获取Blob对象
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `${fileName}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url); // 释放URL对象
          document.body.removeChild(a);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    }
  };
  const handleE = (type: string) => {
    switch (type) {
      case "close":
        setShowPreviewModal(false);
        break;

      default:
        break;
    }
  };
  useEffect(() => {
    console.log("assets", assets);
  }, [assets]);
  return (
    <div className="bg-white">
      <div
        className="w-full rounded-xl mb-4 overflow-hidden z-50 relative"
        style={{
          border: "1px solid #fff",
          background:
            "linear-gradient(0deg, #FFFFFF, #FFFFFF),linear-gradient(179.8deg, #E9EEFF 0.17%, #FFFFFF 8.4%)"
        }}
      >
        <div className="p-6 min-h-[calc(100vh-350px)] text-[#333] text-sm leading-[54px]">
          <div className="font-bold text-[#333] tex-llg mb-5">静态资源列表</div>
          <div className="flex h-[54px] leading-[54px] bg-[#fafafa] border-0 border-solid border-[#e8e8e8] border-b-[1px]">
            <div className="px-4 flex-1 min-w-[222px]">名称</div>
            <div className="px-4 w-32 text-right">大小</div>
            <div className="px-4 w-40">更新时间</div>
            <div className="px-4 w-32">操作</div>
          </div>
          {(assets || []).map((i: any, idx: number) => (
            <div
              key={`detail-asset-${idx}`}
              className="flex h-[54px] leading-[54px] bg-white border-0 border-solid border-[#e8e8e8] border-b-[1px]"
            >
              <div className="pr-4 flex-1 min-w-[222px] relative pl-10">
                <Image
                  src={IconFilePdf}
                  alt=""
                  className="object-cover absolute z-10 left-4 top-[18px] select-none w-4 h-4"
                  priority
                />
                <div className="truncate" title={i.name}>
                  {i.name}
                </div>
              </div>
              <div className="px-4 w-32 text-right">{i.fileSize}</div>
              <div className="px-4 w-40">{i.updateTime}</div>
              <div className="px-4 w-32 flex items-center gap-6">
                <Image
                  src={IconView}
                  alt="查看"
                  title="查看"
                  className="object-cover select-none w-4 h-4 cursor-pointer hover:opacity-85"
                  priority
                  onClick={() => handlerEvent("view", i)}
                />
                {/* <Image
                  src={IconDownload}
                  alt="下载"
                  title="下载"
                  className="object-cover select-none w-4 h-4 cursor-pointer hover:opacity-80"
                  priority
                  onClick={() => handlerEvent("download", i)}
                /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPreviewModal && (
        <div className="w-full h-full fixed top-0 left-0 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[900px] h-[70vh] flex items-center justify-center bg-white">
            <FileView curFileInfo={curFileInfo} handleEvent={handleE} />
          </div>
        </div>
      )}
    </div>
  );
}
