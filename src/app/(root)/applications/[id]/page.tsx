interface ApplicationPageProps {
  params: {
    id: string;
  };
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">应用详情 {id}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：应用基本信息 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            {/* 基本信息内容 */}
          </div>
        </div>

        {/* 右侧：应用状态和操作 */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            {/* 状态和操作内容 */}
          </div>
        </div>
      </div>
    </div>
  );
}