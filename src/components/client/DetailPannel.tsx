'use client'
// import FileView from "@/components/FileView";
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import IconFilePdf from "@/static/img/icon-pdf.png";
import IconView from "@/static/img/icon-view.png";
import IconDownload from "@/static/img/icon-download.png";
import { useEffect, useMemo, useState } from "react";
import dynamic from 'next/dynamic';
import FileView from '@/components/FileView';
import * as React from 'react';


interface Contact {
  email: string;
  label: string;
  name: string;
  _v?: number;
  _id: string;
}
const minioProtocol = process.env.NEXT_PUBLIC_MINIO_PROTOCOL;
const minioEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT;
const minioPort = process.env.NEXT_PUBLIC_MINIO_PORT;

const baseUrl = `${minioProtocol}://${minioEndpoint}:${minioPort}`;
interface IAppDetailIntroduce {
  // sameTypeItems: any[];
  keywords: any[];
  gientechType?: string;
  organizationId?: string;
  shortIntro?:string
  richIntro?:string
  contact?: Contact[];
  // detail: any;
  appId: string;
}

// const FileViewCmp = dynamic(() =>
//   import("@/components/FileView").then((mod) => mod.default)
// );

// 添加文件类型定义
interface MinioFile {
  name: string;
  size: number;
  lastModified: string;
  url: string;
}

export default function DetailPannel(props: IAppDetailIntroduce) {
  const { keywords, gientechType,organizationId, shortIntro, appId } = props;
  const searchParams = useSearchParams();
  const type = searchParams?.get('type');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [curFileInfo, setCurFileInfo]: any = useState({});
  // 添加文件列表状态
  const [files, setFiles] = useState<MinioFile[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取文件列表
  const fetchFiles = async (appId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${appId}/files`);
      const result = await response.json();
      console.log("result", result);
      setFiles(result.data || []);
   
    } catch (error) {
      console.error('获取文件列表出错:', error);
    } finally {
      setLoading(false);
    }
  };

  // 在组件加载时获取文件列表
  useEffect(() => {
    if (type === '1' && appId) {
      fetchFiles(appId);
    }
  }, [type, appId]);

  const handlerEvent = (type: string, data?: any) => {
    console.log("拼了个啥", "data.url", data);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setCurFileInfo({});
  };

  return (
    <>
    {type == '0' && (
    <div className="w-full">
      <div className="flex flex-col flex-col-reverse md:flex-row mb-4 items-start">
        <div
          className="flex-1 rounded-xl overflow-hidden"
          style={{
            border: "1px solid #fff",
            background: "linear-gradient(179.8deg, #E9EEFF 0.17%, #FFFFFF 8.4%)"
          }}
        >
          <div className="flex-1  min-h-[calc(100vh-350px)] p-6">
            <div className="text-lg py-3 font-medium">应用介绍</div>
            <article className="prose prose-sm md:prose-base  prose-slate max-w-none">
              {shortIntro || '没有应用介绍'}
            </article>
          </div>
        </div>
        <div
          className="w-full md:w-[334px] mb-4 md:mb-0 rounded-sm md:rounded-xl ml-0 md:ml-8 overflow-hidden shadow-sidebar p-6  min-h-[250px]  md:min-h-[calc(100vh-350px)] flex flex-col gap-5"
          style={{
            border: "1px solid #fff",
            background: "linear-gradient(180deg, #ECEFFF 0%, #FFFFFF 51.5%)"
          }}
        >
        {/* 添加关键词模块 */}
        <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">关键词</div>
            <div className="flex flex-wrap gap-2">
              {(keywords || []).map((keyword: string, index: number) => (
                <span
                  key={`keyword-${index}`}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
        </div>
        {/* 添加联系人模块 */}
        
        <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">联系人</div>
            <div className="flex flex-col gap-3">
              {props.contact && props.contact.length > 0 ? (
                props.contact.map((contact) => {
                  // 转换ObjectId为字符串
                  const safeContact = {
                    ...contact,
                    _id: contact._id ? contact._id.toString() : 'unknown-id'
                  };
                  
                  return (
                    <div key={safeContact._id} className="flex flex-col gap-1 p-3 rounded-lg bg-blue-50">
                      <div className="flex items-center gap-2">
                        <span className="">{safeContact.name}</span>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          {safeContact.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {safeContact.email}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-gray-500 text-sm">暂无联系人信息</div>
              )}
            </div>
        </div>
        </div>
      </div>
    </div>
    )}
    {type == '1' && (
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
        <div className="font-bold text-[#333] text-base md:text-lg mb-5">静态资源列表</div>
        <div className="flex h-[54px] leading-[54px] bg-[#fafafa] border-0 border-solid border-[#e8e8e8] border-b-[1px]">
          <div className="px-4 flex-1 w-[222px] md:min-w-[222px]">名称</div>
          <div className="px-4 hidden md:block md:w-32 text-right">大小</div>
          <div className="px-4 hidden md:block md:w-40">更新时间</div>
          <div className="px-4 md:w-32">操作</div>
        </div>
     
        {loading ? (
          <div className="text-center py-8">加载中...</div>
        ) : files && files.length > 0 ? (
          files.map((file, idx) => {
            if (!file.name || !file.url) {
              console.error('Invalid file data at index', idx, file);
              return null;
            }
            return (
              <div
                key={`file-${idx}`}
                className="flex h-[54px] leading-[54px] bg-white border-0 border-solid
                 border-[#e8e8e8] border-b-[1px]"
              >
                <div className="pr-4 flex-1 w-[222px] md:min-w-[222px] truncate  relative pl-10">
                  <Image
                    src={IconFilePdf}
                    alt=""
                    className="object-cover absolute z-10 left-4 top-[18px] select-none w-4 h-4"
                    priority
                  />
                  <div className="truncate" title={file.name}>
                    {file.name}
                  </div>
                </div>
                <div className="px-4 w-32 text-right hidden md:block">
                  {file.size > 1024 * 1024 
                    ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                    : file.size > 1024 
                      ? `${(file.size / 1024).toFixed(2)} KB`
                      : `${file.size} B`}
                </div>
                <div className="px-4 w-40 hidden md:block">
                  {new Date(file.lastModified).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }).replace(/\//g, '-')}
                </div>
                <div className="px-4 w-32 flex justify-end items-center md:justify-start gap-6">
                  <Image
                    src={IconView}
                    alt="查看"
                    title="查看"
                    className="object-cover select-none w-4 h-4 cursor-pointer hover:opacity-85"
                    priority
                    onClick={() => {
                      // const baseUrl = process.env.NEXT_PUBLIC_MINIO_BASE_URL;
                      console.log("baseUrl", baseUrl,file.url);
                      window.open(`${baseUrl}${file.url}`, '_blank');
                    }}
                  />
                  {/* <a href={file.url} download>
                    <Image
                      src={IconDownload}
                      alt="下载"
                      title="下载"
                      className="object-cover select-none w-4 h-4 cursor-pointer hover:opacity-85"
                      priority
                    />
                  </a> */}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">暂无文件</div>
        )}
      </div>
    </div>
    {/* {showPreviewModal && (
      <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center">
        <div className="w-[90vw] h-[80vh] bg-white rounded-lg overflow-hidden shadow-xl">
          <FileView 
            fileUrl={curFileInfo.url}
            fileName={curFileInfo.name}
            onClose={handleClosePreview}
            fileType={curFileInfo.name.split('.').pop()}
          />
        </div>
      </div>
    )} */}
  </div>
    )}
    </>
  )}
