
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import dynamic from 'next/dynamic';
import React from 'react'
const AppToggleButton = dynamic(
  () => import('@/components/AppToggleButton'),
  {
    loading: () => <p>Loading...</p>,
  }
);
async function Header({ data }: { data: any }) {
  return (
    <div
      className=' fixed top-0 w-full bg-transparent flex justify-between items-center h-[45px] px-5'
    >
      <div>
        <h3 className=' font-mono font-black text-lg italic'> MxM_<span className=' text-theme-primary text-2xl '>Ai</span></h3>
      </div>
      {/* <div>

      </div> */}
      <div>
        <div className='flex gap-x-3 items-center justify-end'>
          <AppToggleButton data={data} />
          <Avatar className="mx-auto w-[24px] h-[24px]  ">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

export default Header