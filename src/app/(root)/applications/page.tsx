// import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import applicationsBanner from "@/static/img/applications_bg.png";
import IconCategory from "@/static/img/icon-category.png";
import IconCategoryActive from "@/static/img/icon-category-active.png";
import AppItem from "./item";
import SearchBar from "@/components/ui/searchBar";
import { categorys, sceneList, cardList, allRow } from "@/constants";
interface ApplicationPageQueryProps {
  category?: string;
  scene?: string;
  keyWord?: string;
}

// const SearchBarCmp = dynamic(
//   () => import("@/components/ui/searchBar").then((mod) => mod.default),
//   {
//     loading: () => <p>Loading search bar...</p>
//   }
// );

const ApplicationsPage = async ({
  searchParams
}: {
  searchParams: ApplicationPageQueryProps;
}) => {
  const {
    category = categorys[0].key,
    scene = allRow.id,
    keyWord = ""
  } = await searchParams;
  const _category =
    Number(category) >= Number(categorys[0].key) &&
    Number(category) <= Number(categorys[categorys.length - 1].key)
      ? category
      : categorys[0].key;

  let _sceneList = [...sceneList];
  if (_sceneList.length) {
    // 添加全部
    _sceneList.unshift(Object.assign({}, allRow, { type: category }));
  }

  if ([categorys[1].key, categorys[2].key].includes(_category)) {
    _sceneList = (_sceneList || []).filter((i: any) => i.type === _category);
  }

  const _scene = _sceneList.some((i: any) => i.id === scene)
    ? scene
    : allRow.id;

  let _list = [] as any[];
  if (_sceneList.length) {
    switch (category) {
      case allRow.id:
        _list =
          _scene === allRow.id
            ? cardList
            : cardList.filter((j: any) => j.sceneId === _scene);
        break;
      default:
        _list =
          _scene === allRow.id
            ? cardList.filter((j: any) =>
                sceneList
                  .filter((i: any) => i.type === category)
                  .map((i: any) => i.id)
                  .includes(j.sceneId)
              )
            : cardList.filter((j: any) => j.sceneId === _scene);
        break;
    }
    _list = _list.filter((i: any) => JSON.stringify(i).indexOf(keyWord) >= 0);
  }

  return (
    <div className="w-full">
      <div className="select-none h-[248px] relative w-full mb-10">
        <div className="absolute top-12 left-0 right-0 z-10">
          <div className="container">
            <div className="text-[40px]">
              <b>源启AI+产品</b>
            </div>
            <div className="text-[#333] mb-4">
              突破性AI技术，开启无限创新机遇-{category}
            </div>
            <SearchBar category={_category} scene={_scene} kWord={keyWord} />
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
      <div className="container">
        <div className="flex mb-10 items-start ">
          <div className="flex-1 max-w-[334px] min-w-[194px] bg-white rounded-xl p-5 mr-8 shadow-sidebar">
            <div className="font-bold text-llg text-[#333]">全部产品</div>

            <div className="mt-5">
              <div className="flex mb-5">
                {(categorys || []).map((i: any, idx: number) => {
                  return _category === i.key ? (
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
                      href={`/applications?${category ? "category=" + i.key : ""}`}
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
              {_sceneList.map((i: any, idx: number) => {
                return _scene === i.id ? (
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
                      src={_scene !== i.id ? IconCategory : IconCategoryActive}
                      alt=""
                      className="absolute top-3 left-4 h-4 w-4 mr-3 select-none"
                      priority
                    />
                    {i.content}
                  </div>
                ) : (
                  <Link
                    key={`scene-${i.id}-${idx}`}
                    href={`/applications?category=${_category}&scene=${i.id}`}
                  >
                    <div
                      className={`relative truncate h-[42px] mb-1 text-sm text-[#333] leading-10 pl-[44px] pr-4 rounded-lg cursor-pointer hover:opacity-85`}
                      style={{
                        background: "transparent"
                      }}
                      title={i.content}
                    >
                      <Image
                        src={
                          _scene !== i.id ? IconCategory : IconCategoryActive
                        }
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
          </div>
          {/* <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(_list || []).map((i: any, idx: number) => (
              <AppItem
                key={`card-${category}-${_scene}-${i.cardId}-${idx}`}
                itemData={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
