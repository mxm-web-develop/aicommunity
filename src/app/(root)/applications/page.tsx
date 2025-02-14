import Applications from "@/components/ui/applications/applications";
// import { categorys, getData } from "@/constants";

// export async function getStaticProps() {
//   const sceneList = getData();
//   console.log("ASDasDAS");
//   return {
//     props: {
//       sceneList,
//       categorys
//     },
//     fallback: false
//   };
// }
//
// export default async function ApplicationsPage(props: any) {
//   const { sceneList, categorys } = props;
//   return <Applications sceneList={sceneList} categorys={categorys} />;
// }

export default async function ApplicationsPage() {
  return <Applications />;
}
