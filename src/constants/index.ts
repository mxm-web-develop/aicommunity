import { Organization } from "@/db/mongo/schemas/Organization";

export const categorys = [
  {
    key: "0",
    label: "全部"
  },
  {
    key: "1",
    label: "AI"
  },
  {
    key: "2",
    label: "AI+"
  }
];

export const sceneList = [
  { id: 1, type: categorys[1].key, content: categorys[1].label + " - 数据1" },
  { id: 2, type: categorys[1].key, content: categorys[1].label + " - 数据2" },
  { id: 3, type: categorys[1].key, content: categorys[1].label + " - 数据3" },
  { id: 4, type: categorys[1].key, content: categorys[1].label + " - 数据4" },
  { id: 5, type: categorys[1].key, content: categorys[1].label + " - 数据5" },
  { id: 6, type: categorys[1].key, content: categorys[1].label + " - 数据6" },
  { id: 7, type: categorys[1].key, content: categorys[1].label + " - 数据7" },
  { id: 8, type: categorys[1].key, content: categorys[1].label + " - 数据8" },
  { id: 9, type: categorys[1].key, content: categorys[1].label + " - 数据9" },
  {
    id: 10,
    type: categorys[1].key,
    content: categorys[1].label + " - 数据10"
  },
  {
    id: 11,
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据1"
  },
  {
    id: 12,
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据2"
  },
  {
    id: 13,
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据3"
  },
  {
    id: 14,
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据4"
  },
  {
    id: 15,
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据5"
  },
  {
    id: 16,
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据6"
  },
  {
    id: 17,
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据7"
  },
  {
    id: 18,
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据8"
  },
  {
    id: 19,
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据9"
  },
  {
    id: 20,
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据10"
  }
];
export const allRow = {
  id: 0,
  type: categorys[0].key,
  content: "全部"
};

export const cardList = new Array(100)
  .fill(1)
  .map((_: any, idx: number) => ({
    cardId: idx + 1,
    title: `产品名称-${idx}`,
    desc: `${idx}-产品简要介绍产品简要介绍产品简要介绍产品简要介绍产品简要介绍-产品简要介绍产品简要介绍产品简要介绍产品简要介绍产品简要介绍`,
    organization: "组织",
    scene: "写作",
    sceneId: Math.floor(Math.random() * 20) + 1
  }))
  .map((i: any) => {
    const sceneObj = sceneList.find((j: any) => j.id === i.sceneId);
    return Object.assign({}, i, {
      scene: sceneObj ? sceneObj.content : "暂无"
    });
  });
