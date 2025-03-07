'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import AppCard from "@/components/server/AppCard";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";
import { ErrorBoundary } from './ErrorBoundary';

interface Category {
  id: string;
  name: string;
  checked: boolean;
}

interface Organization {
  id: string;
  name: string;
  checked: boolean;
}

const initialCategories: Category[] = [
  { id: 'all', name: '全部', checked: true },
  { id: 'llm', name: '大模型', checked: false },
  { id: 'application', name: '应用', checked: false },
  { id: 'platform', name: '平台', checked: false },
];

const initialOrganizations: Organization[] = [
  { id: '67af16e967cff211db44c6db', name: 'AI', checked: true },
  { id: '67b291be1ad598b265fce6b6', name: 'AI+', checked: true },
];

// 添加一个全局缓存对象，跨组件实例共享数据
// 在模块级别声明，所有组件实例共享
const applicationCache = {
  data: null,
  timestamp: 0
};

// 骨架屏组件
const SkeletonCard = () => (
  <div className="bg-card rounded-lg p-4 shadow animate-pulse">
    <div className="h-40 bg-muted rounded mb-4"></div>
    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-muted rounded w-1/2"></div>
  </div>
);

export default function AppControlList() {
  const [categories, setCategories] = useState(initialCategories);
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 添加请求标记 ref
  const requestInProgressRef = useRef(false);
  // 添加类型参数引用
  const typeParamRef = useRef(null);

  // 初始化时获取URL参数，设置初始过滤状态
  useEffect(() => {
    // 获取URL中的type参数
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    
    // 保存类型参数，后续在组织过滤中使用
    typeParamRef.current = typeParam;
    
    if (typeParam) {
      console.log(`设置类型过滤: ${typeParam}`);
      // 更新分类选择状态
      setCategories(prevCategories => prevCategories.map(cat => ({
        ...cat,
        checked: cat.id === 'all' ? false : cat.id === typeParam
      })));
      
      // 对于类型过滤，确保所有组织都被选中，避免组织过滤限制类型过滤
      setOrganizations(prevOrgs => prevOrgs.map(org => ({
        ...org,
        checked: true
      })));
    }
  }, []);

  // 改进的数据加载逻辑
  useEffect(() => {
    const fetchAllData = async () => {
      // 如果已有请求正在进行，则不重复请求
      if (requestInProgressRef.current) return;
      
      // 检查缓存是否有效 (10分钟有效期)
      const now = Date.now();
      if (applicationCache.data && now - applicationCache.timestamp < 10 * 60 * 1000) {
        console.log('Using cached applications data');
        setAllApplications(applicationCache.data);
        setLoading(false);
        return;
      }
      
      try {
        // 标记请求开始
        requestInProgressRef.current = true;
        
        console.log('Fetching applications data');
        const response = await fetch('/api/applications');
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          // 添加调试日志
          console.log(`获取到 ${result.data.length} 个应用`);
          console.log('应用类型示例:', result.data.map(app => app.type).slice(0, 5));
          
          // 更新缓存
          applicationCache.data = result.data;
          applicationCache.timestamp = now;
          
          setAllApplications(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
        // 请求完成，重置标记
        requestInProgressRef.current = false;
      }
    };

    fetchAllData();
  }, []);

  // 处理分类选择
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (categoryId === 'all') {
      setCategories(categories.map(cat => ({
        ...cat,
        checked: cat.id === 'all' ? checked : false
      })));
    } else {
      setCategories(categories.map(cat => {
        if (cat.id === 'all') return { ...cat, checked: false };
        if (cat.id === categoryId) return { ...cat, checked };
        return cat;
      }));
    }
  };

  // 处理组织选择
  const handleOrganizationChange = (orgId: string, checked: boolean) => {
    setOrganizations(organizations.map(org => ({
      ...org,
      checked: org.id === orgId ? checked : org.checked
    })));
  };

  // 处理搜索
  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 500);

  // 修改后的过滤逻辑，更可靠的实现
  const filteredApplications = useMemo(() => {
    // 如果没有数据，直接返回空数组
    if (!allApplications || allApplications.length === 0) {
      return [];
    }
    
    console.log(`过滤前应用数量: ${allApplications.length}`);
    
    // 需要检查应用的类型值是否标准化
    const firstApp = allApplications[0];
    console.log('首个应用示例:', {
      id: firstApp._id || firstApp.id,
      type: firstApp.type,
      organizationId: firstApp.organizationId
    });
    
    // 1. 获取要应用的过滤条件
    const selectedCategories = categories
      .filter(cat => cat.checked)
      .map(cat => cat.id);
    
    const useAllCategories = categories.find(cat => cat.id === 'all')?.checked || 
                            selectedCategories.length === 0;
    
    const selectedOrgs = organizations
      .filter(org => org.checked)
      .map(org => org.id);
    
    // 输出过滤条件
    console.log('过滤条件:', {
      categories: useAllCategories ? ['all'] : selectedCategories,
      organizations: selectedOrgs
    });
    
    // 2. 过滤逻辑 - 更加健壮和宽容的实现
    let filtered = allApplications.filter(app => {
      // 应对不同的数据结构
      const appType = (app.type || '').toLowerCase();
      const appOrgId = app.organizationId || '';
      
      // 组织过滤 - 如果没有organizationId或匹配任何选中的组织
      const passesOrgFilter = 
        !appOrgId || // 如果没有组织ID
        selectedOrgs.length === 0 || // 如果没有选择组织
        selectedOrgs.includes(appOrgId); // 如果组织匹配
      
      // 类型过滤 - 如果是全部或类型匹配任何选中的类别
      const passesCatFilter = 
        useAllCategories || // 如果选择全部类别
        selectedCategories.some(cat => { 
          // 类型匹配，处理大小写和变体
          if (cat === 'llm' && (appType === 'llm' || appType === 'large language model' || appType.includes('model'))) {
            return true;
          }
          if (cat === 'platform' && (appType === 'platform' || appType.includes('platform'))) {
            return true;
          }
          if (cat === 'application' && (appType === 'application' || appType === 'app' || appType.includes('应用'))) {
            return true;
          }
          return appType === cat;
        });
        
      return passesOrgFilter && passesCatFilter;
    });
    
    // 3. 按搜索词过滤
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        (app.name?.toLowerCase() || '').includes(searchLower) ||
        (app.description?.toLowerCase() || '').includes(searchLower)
      );
    }
    
    console.log(`过滤后应用数量: ${filtered.length}`);
    return filtered;
  }, [allApplications, organizations, categories, searchTerm]);

  return (
    <ErrorBoundary fallback={<div className="container">加载应用列表时出错，请稍后再试。</div>}>
    <div className="container mx-auto px-4">
      {/* 主布局：移动端纵向，桌面端横向 */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-8">
        {/* 左侧过滤器 - 移动端全宽 */}
        <div className="w-full md:w-60 lg:w-64 flex-shrink-0">
          <div className="bg-card rounded-lg p-4 shadow">
            {/* 搜索框 */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="搜索..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-primary"
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            {/* 移动端横向排列过滤器 */}
            <div className="flex flex-row md:flex-col gap-4 md:gap-6">
              {/* 组织过滤 */}
              <div className="flex-1 md:w-full">
                <h3 className="text-sm text-muted-foreground font-semibold mb-3">组织</h3>
                <div className="space-y-2 md:space-y-3">
                  {organizations.map((org) => (
                    <label 
                      key={org.id}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={org.checked}
                        onChange={(e) => handleOrganizationChange(org.id, e.target.checked)}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">{org.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 分类过滤 */}
              <div className="flex-1 md:w-full">
                <h3 className="text-sm text-muted-foreground font-semibold mb-3  md:mt-4">分类</h3>
                <div className="space-y-2 md:space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={category.checked}
                        onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧应用列表 */}
        <div className="flex-1 mb-10">
          <div className="grid grid-cols-1  lg:grid-cols-2 gap-4">
            {loading ? (
              Array(6).fill(null).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map((application: any) => (
                <AppCard
                  simple={true}
                  key={`${application.organizationId}-${application._id}`}
                  data={application}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground">没有找到匹配的应用</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}