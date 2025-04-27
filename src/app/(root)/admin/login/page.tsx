'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/adminAuth';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        remember: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const result = await adminAuth.login(formData.username, formData.password);
            
            if (result.success) {
                // 登录成功，跳转到管理后台
                router.push('/admin');
            } else {
                // 显示错误信息
                setError(result.message || '登录失败');
            }
        } catch (err) {
            setError('登录过程中发生错误，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* 登录卡片 */}
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
                    {/* 头部 */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-blue-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">管理员登录</h2>
                        <p className="text-sm text-gray-500">欢迎回来，请输入您的账号信息</p>
                    </div>

                    {/* 错误提示 */}
                    {error && (
                        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* 表单 */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    用户名
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="请输入用户名"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
        <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    密码
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="请输入密码"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                    checked={formData.remember}
                                    onChange={(e) => setFormData({...formData, remember: e.target.checked})}
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    记住我
                                </label>
                            </div>
                            <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-600">
                                忘记密码？
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    登录中...
                                </div>
                            ) : '登 录'}
                        </button>
                    </form>
                </div>

                {/* 页脚 */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    遇到问题？ 
                    <a href="#" className="font-medium text-blue-500 hover:text-blue-600 ml-1">
                        联系管理员
                    </a>
                </p>
            </div>
        </div>
    );
}