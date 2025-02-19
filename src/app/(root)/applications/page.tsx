// import dynamic from "next/dynamic";
import Image from "next/image";
import applicationsBanner from "@/static/img/applications_bg.png";
import LeftBar from "@/components/applications/left-bar";
import AppItem from "@/components/applications/item";
import SearchBar from "@/components/ui/searchBar";
import { categorys, sceneList, cardList, allRow } from "@/constants";
import { fetchApi } from "@/lib/fetchapi";

interface ApplicationPageQueryProps {
  category?: string;
  scene?: string;
  keyWord?: string;
}

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
            <LeftBar
              categorys={categorys}
              categoryId={_category}
              scenes={_sceneList}
              sceneId={_scene}
            />
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
