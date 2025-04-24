'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import OrganizationForm from '@/components/admin/OrganizationForm';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Organization {
    _id: string;
    name: string;
    logo: string;
    description: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

const columns = [
    { key: 'name', title: '组织名称', sortable: true },
    { 
        key: 'logo', 
        title: 'Logo',
        render: (value: string) => (
            value ? (
                <img src={value} alt="logo" className="w-10 h-10 object-cover rounded" />
            ) : (
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">无Logo</span>
                </div>
            )
        )
    },
    { 
        key: 'description', 
        title: '描述',
        render: (value: string) => (
            <span className="line-clamp-2">{value || '暂无描述'}</span>
        )
    },
    { 
        key: 'url', 
        title: '网址',
        render: (value: string) => (
            value ? (
                <a 
                    href={value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    {value}
                </a>
            ) : (
                <span className="text-gray-400">暂无网址</span>
            )
        )
    },
    { 
        key: 'createdAt', 
        title: '创建时间', 
        sortable: true,
        render: (value: string) => (
            <span className="text-gray-600">
                {dayjs(value).format('YYYY-MM-DD HH:mm')}
            </span>
        )
    },
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

export default function OrganizationsPage() {
    const [data, setData] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    
    // 删除弹窗相关状态
    const [deleteDialogState, setDeleteDialogState] = useState<{
        isOpen: boolean;
        org: Organization | null;
        hasRelatedApps: boolean;
        isChecking: boolean;
    }>({
        isOpen: false,
        org: null,
        hasRelatedApps: false,
        isChecking: false,
    });

    // 重置删除弹窗状态
    const resetDeleteDialog = () => {
        setDeleteDialogState({
            isOpen: false,
            org: null,
            hasRelatedApps: false,
            isChecking: false,
        });
    };

    // 获取组织列表
    const fetchOrganizations = async () => {
        try {
            const response = await fetch('/api/organization');
            if (!response.ok) throw new Error('获取组织列表失败');
            const result = await response.json();
            setData(result);
        } catch (error) {
            toast.error('获取组织列表失败');
            console.error('Error fetching organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleAdd = () => {
        setEditingOrg(null);
        setIsFormOpen(true);
    };

    const handleEdit = (record: Organization) => {
        setEditingOrg(record);
        setIsFormOpen(true);
    };

    const handleDelete = async (record: Organization) => {
        // 先重置状态
        resetDeleteDialog();
        
        // 设置初始状态
        setDeleteDialogState(prev => ({
            ...prev,
            isOpen: true,
            org: record,
            isChecking: true,
        }));
        
        // 检查是否有关联的应用
        try {
            const response = await fetch(`/api/applications?organizationId=${record._id}`);
            const result = await response.json();
            setDeleteDialogState(prev => ({
                ...prev,
                hasRelatedApps: result.success ? result.data.length > 0 : false,
                isChecking: false,
            }));
        } catch (error) {
            console.error('Error checking related applications:', error);
            setDeleteDialogState(prev => ({
                ...prev,
                hasRelatedApps: false,
                isChecking: false,
            }));
        }
    };

    const confirmDelete = async () => {
        if (!deleteDialogState.org || deleteDialogState.isChecking) return;
        
        try {
            const response = await fetch(`/api/organization?id=${deleteDialogState.org._id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) throw new Error('删除组织失败');
            
            toast.success('删除组织成功');
            fetchOrganizations();
        } catch (error) {
            toast.error('删除组织失败');
            console.error('Error deleting organization:', error);
        } finally {
            resetDeleteDialog();
        }
    };

    const handleFormSubmit = async (formData: any) => {
        try {
            const response = await fetch('/api/organization', {
                method: editingOrg ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingOrg ? {
                    id: editingOrg._id,
                    ...formData
                } : formData),
            });
            
            if (!response.ok) throw new Error(editingOrg ? '更新组织失败' : '创建组织失败');
            
            toast.success(editingOrg ? '更新组织成功' : '创建组织成功');
            setIsFormOpen(false);
            fetchOrganizations();
        } catch (error) {
            toast.error(editingOrg ? '更新组织失败' : '创建组织失败');
            console.error('Error saving organization:', error);
        }
    };

    return (
        <div className="p-6">
            <DataTable
                title="组织管理"
                description="管理和维护组织信息"
                columns={columns}
                data={data}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />
            <OrganizationForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingOrg || undefined}
            />

            {/* 删除确认弹框 */}
            <Transition appear show={deleteDialogState.isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => !deleteDialogState.isChecking && resetDeleteDialog()}
                >
                    <Transition
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        确认删除组织
                                    </h3>
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500">
                                            您确定要删除组织 "{deleteDialogState.org?.name}" 吗？
                                        </p>
                                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                正在检查关联应用...
                                            </p>
                                        </div>
                                        {!deleteDialogState.isChecking && deleteDialogState.hasRelatedApps && (
                                            <div className="mt-2 p-3 bg-yellow-50 rounded-md">
                                                <p className="text-sm text-yellow-700">
                                                    警告：该组织下还有关联的应用数据，删除组织将同时删除这些应用数据。
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                            onClick={resetDeleteDialog}
                                            disabled={deleteDialogState.isChecking}
                                        >
                                            取消
                                        </button>
                                        <button
                                            type="button"
                                            className={`px-3 py-1.5 text-sm text-white rounded-md ${
                                                deleteDialogState.isChecking 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-red-500 hover:bg-red-600'
                                            }`}
                                            onClick={confirmDelete}
                                            disabled={deleteDialogState.isChecking}
                                        >
                                            {deleteDialogState.isChecking ? '检查中...' : '确认删除'}
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
} 