'use client';

import { useEffect } from 'react';
import { isMobile, } from 'react-device-detect'
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    console.log(isMobile)
  }, [])
  return (
    <div>
      hahah
      {children}
    </div>
  );
}
