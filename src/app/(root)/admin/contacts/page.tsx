'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ContactForm from '@/components/admin/ContactForm';
import dayjs from 'dayjs';
import { X } from 'lucide-react';

interface Contact {
    _id: string;
    label: string;
    name: string;
    email: string;
    organizationId?: string;
    department?: string;
    createdAt: string;
    updatedAt: string;
}

const columns = [
    { key: 'label', title: '标签', sortable: true },
    { key: 'name', title: '姓名', sortable: true },
    { key: 'email', title: '邮箱', sortable: true },
    { key: 'department', title: '部门' ,

    render: (value: string) => (
            <span className="text-gray-600">
              {value || '无'}
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
    // { 
    //     key: 'updatedAt', 
    //     title: '更新时间', 
    //     sortable: true,
    //     render: (value: string) => (
    //         <span className="text-gray-600">
    //             {dayjs(value).format('YYYY-MM-DD HH:mm')}
    //         </span>
    //     )
    // },
];

export default function ContactsPage() {
    const [data, setData] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    
    // 删除弹窗相关状态
    const [deleteDialogState, setDeleteDialogState] = useState<{
        isOpen: boolean;
        contact: Contact | null;
        isChecking: boolean;
    }>({
        isOpen: false,
        contact: null,
        isChecking: false,
    });

    // 重置删除弹窗状态
    const resetDeleteDialog = () => {
        setDeleteDialogState({
            isOpen: false,
            contact: null,
            isChecking: false,
        });
    };

    // 获取联系人列表
    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/contacts');
            if (!response.ok) throw new Error('获取联系人列表失败');
            const result = await response.json();
            setData(result.reverse());
        } catch (error) {
            toast.error('获取联系人列表失败');
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleAdd = () => {
        setEditingContact(null);
        setIsFormOpen(true);
    };

    const handleEdit = (record: Contact) => {
        setEditingContact(record);
        setIsFormOpen(true);
    };

    const handleDelete = async (record: Contact) => {
        // 先重置状态
        resetDeleteDialog();
        
        // 设置初始状态
        setDeleteDialogState(prev => ({
            ...prev,
            isOpen: true,
            contact: record,
            isChecking: true,
        }));
        
        // 检查是否有关联的数据
        try {
            // 这里可以添加检查关联数据的逻辑
            setDeleteDialogState(prev => ({
                ...prev,
                isChecking: false,
            }));
        } catch (error) {
            console.error('Error checking related data:', error);
            setDeleteDialogState(prev => ({
                ...prev,
                isChecking: false,
            }));
        }
    };

    const confirmDelete = async () => {
        if (!deleteDialogState.contact || deleteDialogState.isChecking) return;
        
        try {
            const response = await fetch(`/api/contacts/${deleteDialogState.contact._id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) throw new Error('删除联系人失败');
            
            toast.success('删除联系人成功');
            fetchContacts();
        } catch (error) {
            toast.error('删除联系人失败');
            console.error('Error deleting contact:', error);
        } finally {
            resetDeleteDialog();
        }
    };

    const handleFormSubmit = async (formData: any) => {
        try {
            const url = editingContact 
                ? `/api/contacts/${editingContact._id}`
                : '/api/contacts';
            
            const method = editingContact ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) throw new Error('保存联系人失败');
            
            toast.success(editingContact ? '更新联系人成功' : '创建联系人成功');
            fetchContacts();
        } catch (error) {
            toast.error('保存联系人失败');
            console.error('Error saving contact:', error);
            throw error;
        }
    };

    return (
        <div className="p-6">
            <DataTable
                title="联系人管理"
                description="管理和维护联系人信息"
                columns={columns}
                data={data}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />

            {/* 联系人表单 */}
            <ContactForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingContact || undefined}
            />

            {/* 删除确认弹框 */}
            <Dialog
                open={deleteDialogState.isOpen}
                onClose={() => !deleteDialogState.isChecking && resetDeleteDialog()}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                        <div className="flex items-center justify-between">
                            <Dialog.Title className="text-lg font-medium text-gray-900">
                                确认删除联系人
                            </Dialog.Title>
                            <button
                                onClick={() => !deleteDialogState.isChecking && resetDeleteDialog()}
                                className="text-gray-400 hover:text-gray-500"
                                disabled={deleteDialogState.isChecking}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">
                                您确定要删除联系人 "{deleteDialogState.contact?.name}" 吗？
                            </p>
                            {deleteDialogState.isChecking && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        正在检查关联数据...
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
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
} 