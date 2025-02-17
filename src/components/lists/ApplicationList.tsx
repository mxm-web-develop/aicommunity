interface Application {
  id: string;
  name: string;
  shortIntro: string;
  status: number;
  network: string;
  classify: number;
  tags: string[];
}

export default function ApplicationList() {
  // 这里可以添加获取数据的逻辑
  const applications: Application[] = [
    { id: '1', name: '应用1', shortIntro: '描述1', status: 1, network: '网络1', classify: 1, tags: ['标签1'] },
    { id: '2', name: '应用2', shortIntro: '描述2', status: 0, network: '网络2', classify: 2, tags: ['标签2'] },
  ];

  return (
    <div className="w-full text-sm">
      <table className="min-w-full text-xs">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">名称</th>
            <th className="py-2 text-left">简介</th>
            {/* <th className="py-2 text-left">网络</th> */}
            <th className="py-2 text-left">分类</th>
            <th className="py-2 text-left">标签</th>
            <th className="py-2 text-left">联系人</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{app.name}</td>
              <td className="py-2 px-4">{app.shortIntro}</td>
              {/* <td className="py-2 px-4">{app.network}</td> */}
              <td className="py-2 px-4">{app.classify}</td>
              <td className="py-2 px-4">{app.tags.join(', ')}</td>
              {/* <td className="py-2 px-4">{app.contact.join(', ')}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}