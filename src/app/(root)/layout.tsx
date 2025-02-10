// import Header from '@/components/layout/Header';
// import Sidebar from '@/components/layout/Sidebar';
// import Footer from '@/components/layout/Footer';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        header  123123m123k12k3k123k
      </header>
      
      <div className="flex flex-1">
        {/* 使用 Tailwind 的响应式类来处理移动端隐藏 */}
        {/* <aside className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-800">
          <Sidebar />
        </aside> */}
        
        <main className="flex-1 px-4 py-8 md:px-6">
          {children}
        </main>
      </div>

      <footer>
        footer
      </footer>
    </div>
  );
}
