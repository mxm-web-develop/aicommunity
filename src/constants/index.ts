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
  { id: "1", type: categorys[1].key, content: categorys[1].label + " - 数据1" },
  { id: "2", type: categorys[1].key, content: categorys[1].label + " - 数据2" },
  { id: "3", type: categorys[1].key, content: categorys[1].label + " - 数据3" },
  { id: "4", type: categorys[1].key, content: categorys[1].label + " - 数据4" },
  { id: "5", type: categorys[1].key, content: categorys[1].label + " - 数据5" },
  { id: "6", type: categorys[1].key, content: categorys[1].label + " - 数据6" },
  { id: "7", type: categorys[1].key, content: categorys[1].label + " - 数据7" },
  { id: "8", type: categorys[1].key, content: categorys[1].label + " - 数据8" },
  { id: "9", type: categorys[1].key, content: categorys[1].label + " - 数据9" },
  {
    id: "10",
    type: categorys[1].key,
    content: categorys[1].label + " - 数据10"
  },
  {
    id: "11",
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据1"
  },
  {
    id: "12",
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据2"
  },
  {
    id: "13",
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据3"
  },
  {
    id: "14",
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据4"
  },
  {
    id: "15",
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据5"
  },
  {
    id: "16",
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据6"
  },
  {
    id: "17",
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据7"
  },
  {
    id: "18",
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据8"
  },
  {
    id: "19",
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据9"
  },
  {
    id: "20",
    type: categorys[2].key,
    content: categorys[2].label + "  - 数据10"
  }
];
export const allRow = {
  id: categorys[0].key,
  type: categorys[0].key,
  content: "全部"
};
const filePath = "/demo.pdf";
export const cardList = new Array(80)
  .fill(1)
  .map((_: any, idx: number) => ({
    cardId: String(idx + 1),
    title: `产品名称-${idx + 1}`,
    desc: `${idx}-产品简要介绍产品简要介绍产品简要介绍产品简要介绍产品简要介绍-产品简要介绍产品简要介绍产品简要介绍产品简要介绍产品简要介绍`,
    organization: "组织",
    scene: "写作",
    sceneId: String(Math.floor(Math.random() * 20) + 1),
    detail: {
      fileUrl: filePath,
      contactList: new Array(Math.floor(Math.random() * 10) + 2)
        .fill(null)
        .map((_: any, idx: number) => ({
          name: "章三" + idx,
          phone: "130010096" + Number(`0${idx}`),
          mail: "130010096" + Number(`0${idx}`) + "@gientech.com",
          role: `销售支持-${idx}`
        })),
      assets: new Array(Math.floor(Math.random() * 20) + 10)
        .fill(null)
        .map((_: any, idx: number) => ({
          fileName: new Array(Math.floor(Math.random() * 20) + 10)
            .fill(null)
            .map(() => "X")
            .join(""),
          filePath,
          fileSize: Number((Math.random() * 10 + 1).toFixed(1)) + "M",
          updateTime: new Date().toDateString()
        }))
    }
  }))
  .map((i: any) => {
    const sceneObj = sceneList.find((j: any) => j.id === i.sceneId);
    return {
      ...i,
      scene: sceneObj ? sceneObj.content : "暂无"
    };
  });

export const detailTabs = [
  {
    key: "0",
    label: "产品介绍"
  },
  {
    key: "1",
    label: "静态资源"
  },
  // {
  //   key: "2",
  //   label: "联系人"
  // }
];
