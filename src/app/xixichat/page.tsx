import dynamic from 'next/dynamic';
import { readJSONFile } from "@/lib/getdata"

const ChatApp = dynamic(() =>
  import('@/components/Chatapp').then((mod) => mod.default), {
  loading: () => <p>Loading chat...</p>,
});
const ChatPage = async () => {
  const brandingData = await readJSONFile('web/home.json')
  const brands = brandingData['brands']
  const token = 'app-oo9gDHKOTUN3eDX7oXMvkIv8'
  const user = 'xixi'
  return (
    <ChatApp data={brands} token={token} username={user} />
  );
};

export default ChatPage