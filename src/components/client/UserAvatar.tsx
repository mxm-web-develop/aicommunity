'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

interface UserAvatarProps {
  // Add props if needed
}

export function UserAvatar({}: UserAvatarProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
      
          <Avatar className="rounded-full h-8 w-8 items-center justify-center flex bg-blue-600 cursor-pointer p-[7px]">
            <AvatarImage src="" alt="用户头像" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
      
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          className="w-56 bg-popover  text-popover-foreground rounded-md p-1 shadow-md"
          align="center"
        >
          <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
            我的账户
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="h-[1px] bg-border my-1" />
          <DropdownMenu.Item className="px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground rounded">
            个人资料
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground rounded">
            设置
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-[1px] bg-border my-1" />
          <DropdownMenu.Item className="px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground rounded text-destructive">
            退出登录
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}