import Link from "next/link";
export default async function Home() {
  return (
    <div className="relative w-full h-full ">
      <div className="tabs w-full flex justify-center gap-x-5 py-3 items-center">
        <Link href="/form/applications">应用</Link>
        <Link href="/form/contacts">联系人</Link>
        <Link href="/form/articles">文章</Link>
        <Link href="/form/organizations">组织</Link>
      </div>
      <div className="form-container flex flex-col items-start justify-between">
        <div className="list">
          {/* 根据路由加载不同的列表内容 */}
        </div>
        <div className="form">
          {/* 根据路由加载不同的表单内容 */}
        </div>
      </div>
    </div>
  );
}
