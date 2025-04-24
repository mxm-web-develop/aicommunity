import { 
    Package2, 
    Building2, 
    Users, 
    Settings 
} from 'lucide-react';

// 定义管理后台的模块配置
export const adminModules = [
    {
        id: 'applications',
        title: '应用管理',
        name: '应用管理',
        description: '管理和维护应用信息',
        href: '/admin/applications',
        icon: Package2
    },
    {
        id: 'organizations',
        title: '组织管理',
        name: '组织管理',
        description: '管理组织和部门结构',
        href: '/admin/organizations',
        icon: Building2
    },
    {
        id: 'contacts',
        title: '联系人管理',
        name: '联系人管理',
        description: '管理客户和联系人信息',
        href: '/admin/contacts',
        icon: Users
    },
    {
        id: 'setting',
        title: '系统设置',
        name: '系统设置',
        description: '配置系统参数和选项',
        href: '/admin/setting',
        icon: Settings
    }
] as const;

// 默认的重定向路由
export const defaultRoute = adminModules[0].href;

// 获取所有可用路由
export const availableRoutes = adminModules.map(module => module.href);