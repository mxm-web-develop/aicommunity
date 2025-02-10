// import Header from '@/components/layout/Header';
// import Sidebar from '@/components/layout/Sidebar';
// import Footer from '@/components/layout/Footer';
import { ThemeToggle } from '@/components/ToggleTheme';
import { UserAvatar } from '@/components/UserAvatar';
import Navbar from '@/scomponents/Navbar';
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className='relative w-full bg-secondary'>
        <div className='flex justify-between py-3 items-center w-full px-20'>
        <div className='left'>
          <span className='text-primary cursor-pointer'>logo</span>
          
        </div>
        <div className='right gap-x-2 flex items-center justify-end'>
         <Navbar /> 
        <ThemeToggle />
        <UserAvatar />
        </div>
        </div>
     
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

      <footer className='relative w-full bg-secondary'>
        <div className='flex justify-center py-3 items-center w-full px-20'>
          <span>footer</span>
        </div>
      </footer>
    </div>
  );
}
