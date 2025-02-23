'use client'
import Link from "next/link";
import { useParams, useSearchParams } from 'next/navigation';
interface IAppDetailContacts {
  detailTabs: any[];
  // type?: any;
  //id: string;
}

export default function DetailTabs(props: IAppDetailContacts) {
  const { detailTabs } = props;
  const params = useParams();
  const id = params.id;
  const searchParams = useSearchParams();
  const type = searchParams?.get('type');
  return (
    <div className="flex gap-8 text-[#333] text-base">
      {(detailTabs || []).map((i: any) => {
        return type === i.key ? (
          <div
            key={`detail-tab-${i.key}`}
            className={`relative h-12 leading-[44px] font-bold text-[#055aff]`}
          >
            {i.label}
            <b
              className={`inline-block w-full absolute bottom-1 left-0 right-0 border-none h-[2px] bg-[#055aff]`}
            ></b>
          </div>
        ) : (
          <Link
            key={`detail-tab-${i.key}`}
            href={`/applications/${id}?type=${i.key}`}
          >
            <div
              className={`relative h-12 leading-[44px] cursor-pointer hover:opacity-85`}
            >
              {i.label}
              <b
                className={`w-full absolute bottom-0 left-0 right-0 border-none h-[2px] bg-[#055aff] hidden`}
              ></b>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
