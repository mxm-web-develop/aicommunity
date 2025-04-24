'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Organization {
    _id: string;
    name: string;
}

interface ContactFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: {
        _id: string;
        label: string;
        name: string;
        email: string;
        organizationId?: string;
        department?: string;
    };
}

const LABEL_OPTIONS = [
    '项目负责人',
    '技术负责人',
    '售前负责人',
    '客服服务联系人'
];

export default function ContactForm({ isOpen, onClose, onSubmit, initialData }: ContactFormProps) {
    const [formData, setFormData] = useState({
        label: '',
        name: '',
        email: '',
        organizationId: '',
        department: '',
    });

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchOrganizations();
            if (initialData) {
                setFormData({
                    label: initialData.label || '',
                    name: initialData.name || '',
                    email: initialData.email || '',
                    organizationId: initialData.organizationId || '',
                    department: initialData.department || '',
                });
            } else {
                setFormData({
                    label: '',
                    name: '',
                    email: '',
                    organizationId: '',
                    department: '',
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/organization');
            if (!response.ok) throw new Error('获取组织列表失败');
            const result = await response.json();
            setOrganizations(result);
        } catch (error) {
            console.error('Error fetching organizations:', error);
            toast.error('获取组织列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await onSubmit(formData);
            toast.success(initialData ? '联系人更新成功' : '联系人创建成功');
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(initialData ? '联系人更新失败' : '联系人创建失败');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto w-full max-w-lg rounded-2xl bg-white shadow-xl">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                            {initialData ? '编辑联系人' : '新增联系人'}
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                            disabled={submitting}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    标签 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    disabled={submitting}
                                >
                                    <option value="">请选择标签</option>
                                    {LABEL_OPTIONS.map((label) => (
                                        <option key={label} value={label}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    姓名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="请输入姓名"
                                    disabled={submitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    邮箱 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="请输入邮箱"
                                    disabled={submitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    所属组织
                                </label>
                                <select
                                    value={formData.organizationId}
                                    onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    disabled={submitting || loading}
                                >
                                    <option value="">请选择组织</option>
                                    {organizations.map((org) => (
                                        <option key={org._id} value={org._id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    部门
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="请输入部门"
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={submitting}
                            >
                                取消
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={submitting}
                            >
                                {submitting ? '提交中...' : '确认'}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 