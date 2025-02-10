'use client'
import { LayoutGrid } from "lucide-react"
import { useState } from "react"
import { DialogNavigation } from "./Appnav"

const AppToggleButton = ({ data }: { data: any }) => {
  const [open, setOpen] = useState(false)
  const handleAppnavToggle = () => setOpen(true)
  return (
    <>
      <LayoutGrid onPointerDown={handleAppnavToggle} className=' w-[24px] cursor-pointer text-theme-white hover:text-white' />
      <DialogNavigation open={open} setOpen={setOpen} data={data} />
    </>
  )
}

export default AppToggleButton