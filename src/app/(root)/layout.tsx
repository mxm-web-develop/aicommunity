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
      <header className='relative w-full bg-background '>
        <div className='flex justify-between py-3 items-center h-[56px] box-border w-full px-20'>
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
        <main className=" min-h-[95vh] w-full bg-secondary">
          {children}
        </main>
      <footer className='relative w-full bg-background'>
        <div className='flex justify-center py-3 items-center w-full px-20'>
          <span>footer</span>
        </div>
      </footer>
    </div>
  );
}
