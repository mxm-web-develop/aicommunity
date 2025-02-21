import Link from "next/link";
export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full h-full ">
      <div className="tabs w-full flex justify-center gap-x-5 py-3 items-center">
        <Link href="/form/applications">应用</Link>
        <Link href="/form/contacts">联系人</Link>
        <Link href="/form/posts">文章</Link>
        <Link href="/form/organizations">组织</Link>
      </div>
      <div className="form-container flex flex-col items-start justify-between">
        {children}
      </div>
    </div>
  );
}
