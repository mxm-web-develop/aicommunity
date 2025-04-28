'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { toast, Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Flame } from 'lucide-react';

const APPLICATION_TYPES = [
    { value: 'application', label: 'AI 应用' },
    { value: 'llm', label: 'AI 大模型' },
    { value: 'platform', label: 'AI 平台' },
];

const BANNER_STATUS_OPTIONS = [
    { value: '', label: '全部' },
    { value: 'published', label: '已发布' },
    { value: 'unpublished', label: '未发布' },
];

interface Application {
    _id: string;
    organizationId: string;
    network: string;
    links: {
        website?: string;
        github?: string;
        demo?: string;
    };
    contact: string[];
    gientechType?: string;
    type: string;
    classify: number;
    tags: string[];
    keywords?: string[];
    name: string;
    status: number;
    shortIntro: string;
    assets: string[];
    awards: string[];
    reproduce?: string;
    createdAt: string;
    updatedAt: string;
}

interface Organization {
    _id: string;
    name: string;
}

const columns = [
    { 
        key: 'hot', 
        title: '',
        width: 30,
        render: (_: any, record: any) => (
            record.banner && record.banner.status === 1 ? (
                <span title="已发布广告牌" className="mr-2 w-[30px]! text-red-500 align-middle">
                    <Flame className="inline w-5 h-5" />
                </span>
            ) : null
        ),
    },
    { 
        key: 'organizationId', 
        title: '组织',
        sortable: true,
        render: (value: string, record: any) => (
            <span className="text-gray-600">
                {record.organizationName || '未知组织'}
            </span>
        )
    },
    { key: 'name', title: '应用名称',        render: (value: string, record: any) => (
        <span className="text-gray-600 truncate max-w-[200px] inline-block">
            {record.name || '未知应用'}
        </span>
    ) },
  
    {
        key: 'type',
        title: '应用类型',
        render: (value: string) => (
            <span className="text-gray-600">
                {APPLICATION_TYPES.find(type => type.value === value)?.label || '未知类型'}
            </span>
        )
    },
    { 
        key: 'status', 
        title: '状态', 
        sortable: true,
        render: (value: number) => (
            <span className={`px-2 py-1 rounded-full text-xs ${
                value === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
                {value === 1 ? '已上线' : '未上线'}
            </span>
        )
    },
    // { 
    //     key: 'createdAt', 
    //     title: '创建时间', 
    //     sortable: true,
    //     render: (value: string) => (
    //         <span className="text-gray-600">
    //             {dayjs(value).format('YYYY-MM-DD HH:mm')}
    //         </span>
    //     )
    // },
    { 
        key: 'updatedAt', 
        title: '更新时间', 
        sortable: true,
        render: (value: string) => (
            <span className="text-gray-600">
                {dayjs(value).format('YYYY-MM-DD HH:mm')}
            </span>
        )
    },
];

function getBannerStatus(app: any) {
    if (app.banner && typeof app.banner === 'object') {
        if (app.banner.status === 1) return 'published';
        if (app.banner.status === 0) return 'unpublished';
    }
    return 'unpublished'; // 默认未发布
}

export default function ApplicationsPage() {
    const [data, setData] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string>('');
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingApplication, setDeletingApplication] = useState<Application | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [bannerStatus, setBannerStatus] = useState('');

    // 获取应用列表
    const fetchApplications = async () => {
        try {
            // 获取组织列表
            const orgResponse = await fetch('/api/organization');
            if (!orgResponse.ok) throw new Error('获取组织列表失败');
            const organizations = await orgResponse.json();
            
            // 创建组织ID到名称的映射
            const orgMap = organizations.reduce((acc: {[key: string]: string}, org: Organization) => {
                acc[org._id] = org.name;
                return acc;
            }, {});

            // 获取应用列表
            const response = await fetch('/api/applications');
            if (!response.ok) throw new Error('获取应用列表失败');
            const result = await response.json();
            
            // 确保我们使用正确的数据结构
            const applications = result.data || [];
            
            // 为每个应用添加组织名称
            const applicationsWithOrgName = applications.map((app: Application) => {
                const appData = {
                    ...app,
                    organizationName: orgMap[app.organizationId] || '未知组织',
                    // 确保所有必需的字段都有值
                    name: app.name || '',
                    status: app.status || 0,
                    createdAt: app.createdAt || new Date().toISOString(),
                    updatedAt: app.updatedAt || new Date().toISOString()
                };
                return appData;
            });
            // 这里直接排序
            applicationsWithOrgName.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            setData(applicationsWithOrgName);
        } catch (error) {
            toast.error('获取应用列表失败');
            console.error('Error fetching applications:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleView = (record: Application) => {
        router.push(`/admin/applications/${record._id}`);
    };

    const handleAdd = () => {
        router.push('/admin/applications/create');
    };

    const handleDelete = async (record: Application) => {
        setDeletingApplication(record);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingApplication) return;
        
        setDeleteLoading(true);
        try {
            const response = await fetch(`/api/applications/${deletingApplication._id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) throw new Error('删除应用失败');
            
            toast.success(`应用"${deletingApplication.name}"已删除`);
            setDeleteDialogOpen(false);
            fetchApplications(); // 刷新列表
        } catch (error) {
            console.error('Error deleting application:', error);
            toast.error('删除失败');
        } finally {
            setDeleteLoading(false);
            setDeletingApplication(null);
        }
    };

    // 处理类型过滤
    const handleTypeChange = (type: string) => {
        setSelectedType(type);
    };

    // 过滤数据
    const filteredData = data.filter(item => {
        if (selectedType && item.type !== selectedType) {
            return false;
        }
        if (bannerStatus) {
            const status = getBannerStatus(item);
            if (bannerStatus !== status) return false;
        }
        return true;
    });

    return (
        <>
            <div className="p-6">
                <DataTable
                    title="应用管理"
                    description="管理和维护应用信息"
                    columns={columns}
                    data={filteredData}
                    onAdd={handleAdd}
                    onEdit={handleView}
                    onDelete={handleDelete}
                    loading={loading}
                    filters={[
                        {
                            label: '类型',
                            value: selectedType,
                            onChange: handleTypeChange,
                            options: [
                                { value: '', label: '全部' },
                                ...APPLICATION_TYPES
                            ]
                        },
                        {
                            label: '广告牌',
                            value: bannerStatus,
                            onChange: setBannerStatus,
                            options: BANNER_STATUS_OPTIONS
                        }
                    ]}
                />
            </div>

            {/* 删除确认对话框 */}
            <Transition appear show={deleteDialogOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setDeleteDialogOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        确认删除
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            确定要删除应用 "{deletingApplication?.name}" 吗？此操作无法撤销。
                                        </p>
                                    </div>

                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                                            onClick={() => setDeleteDialogOpen(false)}
                                        >
                                            取消
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                                            onClick={confirmDelete}
                                            disabled={deleteLoading}
                                        >
                                            {deleteLoading ? '删除中...' : '确认删除'}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Toaster />
        </>
    );
} 