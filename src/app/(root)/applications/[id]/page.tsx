'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image";
import applicationDetailBanner from "@/static/img/application_details_banner.png";
import CollectPraiseBtn from "@/components/ui/collect-praise-btn";
import DetailTabs from "@/components/applications/detail/detail-tabs";
import DetailPannel from "@/components/client/DetailPannel";
import { detailTabs } from "@/constants";
import { Github, Globe, Play } from 'lucide-react';

export default function ApplicationPage() {
  const params = useParams();
  const id = params?.id as string;
  const [itemData, setItemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/applications/${id}`)
      .then(res => res.json())
      .then(res => {
        setItemData(res.data);
        console.log(res.data)
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="container py-10">
      {/* Banner 区域骨架 */}
      <div className="relative h-[248px] w-full mb-4">
        <div className="absolute inset-0 z-0 bg-gray-200 animate-pulse rounded-lg" />
        <div className="container relative z-10 h-full flex flex-col">
          <div className="self-end pt-6">
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-3xl">
              <div className="h-10 w-2/3 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="h-6 w-1/4 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="flex gap-4 mb-2">
                <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      {/* 下方内容骨架 */}
      <div className="container">
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-40 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
  if (!itemData) return <div className="container py-10 text-center">未找到应用</div>;

  return (
    <div className="w-full">
      <div className="relative h-[248px] w-full mb-4">
        <div className="absolute inset-0 z-0">
          <Image
            src={applicationDetailBanner}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container relative z-10 h-full flex flex-col">
          <div className="self-end pt-6">
            <CollectPraiseBtn praiseNum={0} collectNum={0} isCollect={false} />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-3xl">
              <h1 className="text-2xl md:text-4xl font-bold mb-2 text-foreground">
                {itemData.name}
              </h1>
              <div className="my-4">
                <span className="inline-block rounded px-4 py-1 bg-tag/40 text-muted-foreground text-sm">
                  {itemData.gientechType}
                </span>
              </div>
              <div className="flex gap-4 mb-2">
              {itemData.links?.demo && (
    <a
      href={itemData.links.demo}
      target="_blank"
      className="inline-flex items-center gap-2 h-8 px-3 text-sm rounded-full font-semibold bg-blue-100 text-blue-700 shadow transition-all duration-200 hover:bg-blue-200 hover:scale-105"
    >
      <Play className="w-5 h-5" />
      立即体验
    </a>
  )}
  {itemData.links?.website && (
    <a
      href={itemData.links.website}
      target="_blank"
      className="inline-flex items-center gap-2 h-8 px-3 text-sm rounded-full font-semibold bg-teal-100 text-teal-700 shadow transition-all duration-200 hover:bg-teal-200 hover:scale-105"
    >
      <Globe className="w-5 h-5" />
      产品网站
    </a>
  )}
  {itemData.links?.github && (
    <a
      href={itemData.links.github}
      target="_blank"
      className="inline-flex items-center gap-2 h-8 px-3 text-sm rounded-full font-semibold bg-gray-100 text-gray-700 shadow transition-all duration-200 hover:bg-gray-200 hover:scale-105"
    >
      <Github className="w-5 h-5" />
      Git 仓库
    </a>
  )}
  {!itemData.links?.demo && !itemData.links?.website && !itemData.links?.github && (
    <button
      className="inline-flex items-center justify-center h-10 px-8 rounded-full font-semibold bg-muted text-muted-foreground cursor-not-allowed"
      disabled
    >
      暂无可用链接
    </button>
  )}
              </div>
              <DetailTabs detailTabs={detailTabs} />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <DetailPannel
          keywords={itemData.keywords}
          gientechType={itemData.gientechType}
          shortIntro={itemData.shortIntro}
          richIntro={itemData.productIntro_id}
          contact={itemData.contact}  
          organizationId={itemData.organizationId}
          appId={id}
        />
      </div>
    </div>
  );
}

