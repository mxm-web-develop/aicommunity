'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { adminModules } from './modules.config';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 侧边栏 */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-bold text-gray-800">管理后台</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-2">
            {adminModules.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* 主要内容区域 */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* 顶部导航栏 */}
        <nav className="fixed  top-0 right-0 z-30 w-full h-16 bg-white border-b border-gray-200">
          <div className="flex    items-center justify-between h-full px-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex group  h-full items-center space-x-4">
              <span className="text-sm text-gray-600">管理员</span>
              {/* 静态用户头像菜单 */}
              <AdminAvatarMenu />
            </div>
          </div>
        </nav>

        {/* 页面内容 */}
        <main className="p-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminAvatarMenu() {
  const router = useRouter();
  // 清理本地存储的用户信息
  const handleLogout = () => {
    // 清除 localStorage
    localStorage.removeItem('admin_token');
    
    // 清除所有 cookie
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    router.push('/admin');
  };
  // 跳转到社区首页
  const handleGoHome = () => {
    router.push('/');
  };
  return (
    <div className="relative flex items-center">
      {/* 头像按钮 */}
      <div
        className="flex items-center cursor-pointer hover:bg-gray-50 rounded-full px-2 py-1"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white font-bold text-lg border border-gray-200">
          A
        </div>
      </div>
      {/* 下拉菜单 */}
      <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-100 min-w-[220px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
        {/* 用户信息 */}
        <div className="p-4 cursor-default hover:bg-gray-50">
          <div className="font-medium text-base">管理员</div>
          <div className="text-gray-600 text-sm mb-1">admin</div>
          <div className="text-gray-500 text-sm">admin@example.com</div>
        </div>
        <div className="border-t my-1" />
        {/* 返回社区页面 */}
        <div className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50" onClick={handleGoHome}>
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v2m0 14v2m7-7h2m-18 0H3m15.364-6.364l1.414 1.414M4.222 19.778l1.414-1.414m0-12.728L4.222 4.222m15.556 15.556l-1.414-1.414" /></svg>
          <span className='text-xs'>返回社区页面</span>
        </div>
        {/* 退出登录 */}
        <div className="flex items-center px-4 py-2 text-red-500 cursor-pointer hover:bg-gray-50" onClick={handleLogout}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
          <span className='text-xs'>退出登录</span>
        </div>
        <div className="border-t my-1" />
        {/* 版本号 */}
        <div className="flex items-center px-4 py-2 text-gray-400 text-xs justify-center cursor-default">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          <span>版本 v1.2.0</span>
        </div>
      </div>
    </div>
  );
}