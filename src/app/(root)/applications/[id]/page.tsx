import dynamic from "next/dynamic";
import { cardList } from "@/constants";
interface ApplicationPageProps {
  params: {
    id: string;
  };
}

const ApplicationCmp = dynamic(
  () =>
    import("@/components/ui/applications/detail").then((mod) => mod.default),
  {
    loading: () => <p>Loading chat...</p>
  }
);
const ApplicationPage = async ({ params }: ApplicationPageProps) => {
  const { id } = await params;
  const data = await cardList.find((i: any) => i.cardId.toString() === id);

  const { sceneId } = data;
  const sameTypeItems = sceneId
    ? cardList.filter(
        (i: any) => i.sceneId === sceneId && i.cardId.toString() !== id
      )
    : [];

  return <ApplicationCmp itemData={data} sameTypeItems={sameTypeItems} />;
};

export default ApplicationPage;
