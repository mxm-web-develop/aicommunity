'use client'

import { isMobile } from 'react-device-detect'
export default function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`layout ${isMobile ? 'mobile' : 'desktop'}`}>
      {isMobile ? <div>moblie</div> : <div>desktop</div>}
      <main>{children}</main>
    </div>
  )
}
