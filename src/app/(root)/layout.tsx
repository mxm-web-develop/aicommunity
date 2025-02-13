import Image from 'next/image'
import homeBg from '@/static/img/logo.png'

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
      <header className='flex-none relative z-100 w-full bg-background '>
        <div className='flex justify-between py-3 items-center h-[56px] box-border w-full px-[10px]'>
        <div className='left'>
          <span className='text-primary cursor-pointer'>
          <Image
          src={homeBg}
          alt="logo"
          className="h-[28px] w-[180px]"  // 使用 brightness 或其他滤镜
          priority
        />
          </span>
        </div>
        <div className='right gap-x-2 flex items-center justify-end'>
         {/* <Navbar /> 
        <ThemeToggle />
        <UserAvatar /> */}
        </div>
        </div>
      </header>
        <main className=" min-h-[95vh]  w-full bg-secondary">
          {children}
        </main>
      <footer className='relative w-full bg-background'>
        <div className='flex  text-xs text-muted-foreground  justify-center py-3 items-center w-full px-20'>
          <span>©2021 GienTech Technology Co.,Ltd.All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
