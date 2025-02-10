import dynamic from 'next/dynamic';
import { readJSONFile } from "@/scripts/getdata"

const ChatApp = dynamic(() =>
  import('@/components/Chatapp').then((mod) => mod.default), {
  loading: () => <p>Loading chat...</p>,
});
const ChatPage = async () => {
  const brandingData = await readJSONFile('web/home.json')
  const brands = brandingData['brands']
  return (
    <ChatApp data={brands} />
  );
};

export default ChatPage