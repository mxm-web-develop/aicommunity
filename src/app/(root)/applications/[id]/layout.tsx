export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* 可以添加返回按钮、面包屑导航等 */}
      <div className="mb-4">
        {/* 导航组件 */}
      </div>
      
      {children}
    </div>
  );
}