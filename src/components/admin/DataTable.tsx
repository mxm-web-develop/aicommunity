'use client';

import { useState } from 'react';
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface Column {
    key: string;
    title: string;
    sortable?: boolean;
    render?: (value: any, record: any) => React.ReactNode;
}

interface DataTableProps {
    title: string;
    description?: string;
    columns: Column[];
    data: any[];
    onAdd?: () => void;
    onEdit?: (record: any) => void;
    onDelete?: (record: any) => void;
    loading?: boolean;
}

export default function DataTable({
    title,
    description,
    columns,
    data,
    onAdd,
    onEdit,
    onDelete,
    loading = false
}: DataTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // 处理排序
    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    // 过滤和排序数据
    const filteredData = data
        .filter(item =>
            Object.values(item).some(
                value =>
                    value &&
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => {
            if (!sortKey) return 0;
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* 头部 */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                        {description && (
                            <p className="mt-1 text-sm text-gray-500">{description}</p>
                        )}
                    </div>
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center space-x-1.5 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>添加</span>
                        </button>
                    )}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="搜索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-1.5 pl-9 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* 表格 */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        加载中...
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>{column.title}</span>
                                            {column.sortable && (
                                                <button
                                                    onClick={() => handleSort(column.key)}
                                                    className="focus:outline-none"
                                                >
                                                    <div className="flex flex-col">
                                                        <ChevronUp className={`w-3 h-3 ${
                                                            sortKey === column.key && sortOrder === 'asc'
                                                                ? 'text-blue-500'
                                                                : 'text-gray-400'
                                                        }`} />
                                                        <ChevronDown className={`w-3 h-3 -mt-1 ${
                                                            sortKey === column.key && sortOrder === 'desc'
                                                                ? 'text-blue-500'
                                                                : 'text-gray-400'
                                                        }`} />
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredData.map((record, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                                        >
                                            {column.render
                                                ? column.render(record[column.key], record)
                                                : record[column.key]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex items-center justify-end space-x-3">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(record)}
                                                    className="text-blue-500 hover:text-blue-600"
                                                >
                                                    编辑
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(record)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    删除
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && filteredData.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        暂无数据
                    </div>
                )}
            </div>
        </div>
    );
} 