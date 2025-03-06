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
    <div className="flex gap-4 text-base text-muted-foreground">
      {(detailTabs || []).map((i: any) => {
        return type === i.key ? (
          <div
            key={`detail-tab-${i.key}`}
            className="relative h-12 leading-[44px] font-bold text-highlight"
          >
            {i.label}
            <b className="absolute inset-x-0 bottom-0 h-[3px] bg-highlight" />
          </div>
        ) : (
          <Link
            key={`detail-tab-${i.key}`}
            href={`/applications/${id}?type=${i.key}`}
            className="hover:text-primary/80 transition-colors"
          >
            <div className="relative h-12 leading-[44px]">
              {i.label}
              <b className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
