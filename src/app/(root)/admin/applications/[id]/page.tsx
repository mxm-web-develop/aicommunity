'use client';

import { useEffect, useState } from 'react';
import ApplicationForm from '@/components/admin/ApplicationForm';
import { toast } from 'react-hot-toast';
import { use } from 'react';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default function EditApplicationPage({ params }: Props) {
    const id = use(params);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await fetch(`/api/applications/${id.id}`);
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || '获取应用信息失败');
                }
                const { data } = await response.json();
                setInitialData(data);
            } catch (error) {
                console.error('Error fetching application:', error);
                toast.error(error instanceof Error ? error.message : '获取应用信息失败');
            } finally {
                setLoading(false);
            }
        };

        if (id.id) {
        fetchApplication();
        } else {
            setLoading(false);
        }
    }, [id.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">加载中...</div>
            </div>
        );
    }

    if (!initialData && id.id) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-500">未找到应用信息</div>
            </div>
        );
    }

    return <ApplicationForm id={id.id} initialData={initialData} />;
} 