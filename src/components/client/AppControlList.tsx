'use client';

import { useState, useEffect, useMemo } from 'react';
import AppCard from "@/components/server/AppCard";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

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
  const [allApplications, setAllApplications] = useState([]); // 存储所有数据
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 修改后的初始化加载逻辑
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 改为单次请求获取所有数据
        const response = await fetch('/api/applications');
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setAllApplications(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
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

  // 修改后的过滤逻辑
  const filteredApplications = useMemo(() => {
    // 1. 按组织过滤（使用organizationId字段）
    let filtered = allApplications.filter(app => 
      organizations.find(org => org.id === app.organizationId && org.checked)
    );

    // 2. 按分类过滤
    if (!categories.find(cat => cat.id === 'all')?.checked) {
      const selectedCategories = categories
        .filter(cat => cat.checked)
        .map(cat => cat.id);
      
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(app => 
          selectedCategories.includes(app.type)
        );
      }
    }

    // 3. 按搜索词过滤
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.name?.toLowerCase().includes(searchLower) ||
        app.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [allApplications, organizations, categories, searchTerm]);

  return (
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
  );
}