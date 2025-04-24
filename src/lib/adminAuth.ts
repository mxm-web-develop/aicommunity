import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'admin_token';
const TOKEN_EXPIRY = 48 * 60 * 60 * 1000; // 48小时，单位：毫秒

interface AdminToken {
    username: string;
    exp: number;
}

export const adminAuth = {
    // 登录验证
    login: async (username: string, password: string): Promise<{ success: boolean; token?: string; message?: string }> => {
        try {
            // 验证用户名和密码是否匹配环境变量中的配置
            if (
                username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
                password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
            ) {
                // 创建 token
                const token = btoa(JSON.stringify({
                    username,
                    exp: Date.now() + TOKEN_EXPIRY
                }));
                
                // 保存 token 到 localStorage
                localStorage.setItem(TOKEN_KEY, token);
                
                // 保存 token 到 cookie，设置48小时过期
                Cookies.set(TOKEN_KEY, token, { expires: 2 });
                
                return {
                    success: true,
                    token
                };
            }
            
            return {
                success: false,
                message: '用户名或密码错误'
            };
        } catch (error) {
            return {
                success: false,
                message: '登录失败，请重试'
            };
        }
    },

    // 登出
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        Cookies.remove(TOKEN_KEY);
    },

    // 检查是否已登录
    isAuthenticated: (): boolean => {
        try {
            const token = localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY);
            if (!token) return false;

            // 解析 token
            const decoded = JSON.parse(atob(token)) as AdminToken;
            
            // 检查是否过期
            if (decoded.exp < Date.now()) {
                localStorage.removeItem(TOKEN_KEY);
                Cookies.remove(TOKEN_KEY);
                return false;
            }

            return true;
        } catch {
            return false;
        }
    },

    // 获取当前管理员信息
    getCurrentAdmin: (): { username: string } | null => {
        try {
            const token = localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY);
            if (!token) return null;

            const decoded = JSON.parse(atob(token)) as AdminToken;
            
            if (decoded.exp < Date.now()) {
                localStorage.removeItem(TOKEN_KEY);
                Cookies.remove(TOKEN_KEY);
                return null;
            }

            return {
                username: decoded.username
            };
        } catch {
            return null;
        }
    }
}; 