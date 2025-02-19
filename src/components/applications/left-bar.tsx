import Link from "next/link";
import Image from "next/image";
import IconCategory from "@/static/img/icon-category.png";
import IconCategoryActive from "@/static/img/icon-category-active.png";

interface IAppItem {
  categorys: any[];
  categoryId: string | number;
  scenes: any[];
  sceneId: string | number;
}

const LeftBar = (props: IAppItem) => {
  const { categorys, categoryId, scenes, sceneId } = props;

  return (
    <>
      <div className="font-bold text-llg text-[#333]">全部产品</div>

      <div className="mt-5">
        <div className="flex mb-5">
          {(categorys || []).map((i: any, idx: number) => {
            return categoryId === i.key ? (
              <span
                key={`category-tab-${idx}`}
                className={`inline-block px-3 py-1 rounded-sm min-w-10 font-bold text-white`}
                style={{
                  background:
                    "linear-gradient(99.9deg, #2B69FF -4.18%, #8F91FF 59.48%, #EC8FFF 105.42%)"
                }}
              >
                {i.label}
              </span>
            ) : (
              <Link
                key={`category-tab-${idx}`}
                href={`/applications?${categoryId ? "category=" + i.key : ""}`}
              >
                <span
                  className={`inline-block px-3 py-1 rounded-sm min-w-10 cursor-pointer text-[#333] hover:opacity-85`}
                  style={{
                    background: "transparent"
                  }}
                >
                  {i.label}
                </span>
              </Link>
            );
          })}
        </div>
        {scenes.map((i: any, idx: number) => {
          return sceneId === i.id ? (
            <div
              key={`scene-${i.id}-${idx}`}
              className={`relative truncate h-[42px] mb-1 text-sm leading-10 pl-[44px] pr-4 rounded-lg font-bold text-white`}
              style={{
                background:
                  "linear-gradient(99.9deg, #2B69FF -4.18%, #8F91FF 59.48%, #EC8FFF 105.42%)"
              }}
              title={i.content}
            >
              <Image
                src={sceneId !== i.id ? IconCategory : IconCategoryActive}
                alt=""
                className="absolute top-3 left-4 h-4 w-4 mr-3 select-none"
                priority
              />
              {i.content}
            </div>
          ) : (
            <Link
              key={`scene-${i.id}-${idx}`}
              href={`/applications?category=${categoryId}&scene=${i.id}`}
            >
              <div
                className={`relative truncate h-[42px] mb-1 text-sm text-[#333] leading-10 pl-[44px] pr-4 rounded-lg cursor-pointer hover:opacity-85`}
                style={{
                  background: "transparent"
                }}
                title={i.content}
              >
                <Image
                  src={sceneId !== i.id ? IconCategory : IconCategoryActive}
                  alt=""
                  className="absolute top-3 left-4 h-4 w-4 mr-3 select-none"
                  priority
                />
                {i.content}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default LeftBar;
