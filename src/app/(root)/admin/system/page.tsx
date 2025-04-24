'use client';

import { useState } from 'react';
import DataTable from '@/components/admin/DataTable';

// 模拟数据
const mockData = [
    {
        id: 1,
        name: '用户管理',
        type: '核心功能',
        status: '正常',
        lastUpdate: '2024-03-20',
        description: '管理系统用户和权限'
    },
    {
        id: 2,
        name: '日志管理',
        type: '辅助功能',
        status: '维护中',
        lastUpdate: '2024-03-21',
        description: '记录系统操作日志'
    },
    {
        id: 3,
        name: '备份管理',
        type: '安全功能',
        status: '正常',
        lastUpdate: '2024-03-22',
        description: '系统数据备份和恢复'
    }
];

const columns = [
    { key: 'name', title: '功能名称', sortable: true },
    { key: 'type', title: '功能类型', sortable: true },
    { 
        key: 'status', 
        title: '状态',
        render: (value: string) => (
            <span className={`px-2 py-1 rounded-full text-xs ${
                value === '正常' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
                {value}
            </span>
        )
    },
    { key: 'lastUpdate', title: '最后更新时间', sortable: true },
    { key: 'description', title: '功能描述' }
];

export default function SystemPage() {
    const handleAdd = () => {
        // 处理添加
        console.log('添加系统功能');
    };

    const handleEdit = (record: any) => {
        // 处理编辑
        console.log('编辑系统功能:', record);
    };

    const handleDelete = (record: any) => {
        // 处理删除
        console.log('删除系统功能:', record);
    };

    return (
        <div className="p-6">
            <DataTable
                title="系统管理"
                description="管理系统功能和配置"
                columns={columns}
                data={mockData}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
} 