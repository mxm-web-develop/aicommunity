'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/adminAuth';
import { defaultRoute } from './modules.config';

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        // 检查是否已登录
        if (adminAuth.isAuthenticated()) {
            // 重定向到默认路由（产品管理页面）
            router.replace(defaultRoute);
        } else {
            // 未登录则重定向到登录页
            router.replace('/admin/login');
        }
    }, []);

    // 返回空内容，因为会立即重定向
    return null;
}
