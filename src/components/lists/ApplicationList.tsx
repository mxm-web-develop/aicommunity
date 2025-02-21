import { fetchApi } from '@/lib/fetchapi';

export default async function ApplicationList() {
  try {
    // 并行获取数据
    const [applicationsResponse, organizationsResponse] = await Promise.all([
      fetchApi('/api/applications'),
      fetchApi('/api/organization')
    ]);

    // 添加详细的日志输出
    console.log('Applications Response:', JSON.stringify(applicationsResponse, null, 2));
    console.log('Organizations Response:', JSON.stringify(organizationsResponse, null, 2));

    // 修改验证逻辑，适应实际的数据结构
    if (!Array.isArray(applicationsResponse?.data) || !Array.isArray(organizationsResponse)) {
      console.error('Invalid response data:', { 
        applicationsData: applicationsResponse?.data,
        organizationsData: organizationsResponse 
      });
      throw new Error('Invalid response data');
    }

    const applications = applicationsResponse.data;
    // 注意这里 organizationsResponse 直接就是数组
    const organizations = organizationsResponse;

    const orgMap = organizations.reduce((acc: Record<string, string>, org: any) => {
      if (org?._id && org?.name) {  // 注意这里使用 _id 而不是 id
        acc[org._id] = org.name;
      }
      return acc;
    }, {});

    // 添加数据验证
    if (applications.length === 0) {
      return <div className="p-4">暂无应用数据</div>;
    }

    return (
      <div className="w-full text-sm">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">名称</th>
              <th className="py-2 text-left">简介</th>
              <th className="py-2 text-left">应用类型</th>
              <th className="py-2 text-left">所属组织</th>
              <th className="py-2 text-left">标签</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app: any) => (
              <tr key={app.id || Math.random()} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{app.name || '-'}</td>
                <td className="py-2 px-4">{app.shortIntro || '-'}</td>
                <td className="py-2 px-4">{app.gientechType || '-'}</td>
                <td className="py-2 px-4">{orgMap[app.organizationId] || "未知组织"}</td>
                <td className="py-2 px-4">{app.tags?.join(', ') || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error('Error in ApplicationList:', error);
    return (
      <div className="p-4 text-red-500">
        获取数据失败: {error instanceof Error ? error.message : '未知错误'}
      </div>
    );
  }
}