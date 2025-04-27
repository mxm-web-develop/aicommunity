'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Switch } from '@headlessui/react';
import { Upload, X, File, Image, Video, Search } from 'lucide-react';
import { Combobox } from '@headlessui/react';

interface Contact {
    _id: string;
    label: string;
    name: string;
    email: string;
}

interface Organization {
    _id: string;
    name: string;
}

interface FormData {
    name: string;
    organizationId: string;
    type: string;
    gientechType: string;
    shortIntro: string;
    status: boolean;
    links: {
        website: string;
        github: string;
        demo: string;
    };
    contact: string[];
    tags: string[];
    keywords: string[];
    assets: string[];
    banner: {
        status: number;
        coverImg: string;
        title: string;
        description: string;
        url: string;
    };
}

interface ApplicationFormProps {
    initialData?: FormData;
    id?: string;
}

const APPLICATION_TYPES = [
    { value: 'application', label: 'AI 应用' },
    { value: 'llm', label: 'AI 大模型' },
    { value: 'platform', label: 'AI 平台' },
];

// 允许的文件类型
const ALLOWED_FILE_TYPES = {
    'image/*': '图片',
    'application/pdf': 'PDF文档',
    'application/msword': 'Word文档',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word文档',
    'video/*': '视频',
};

// 允许的图片类型
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ApplicationForm({ initialData, id }: ApplicationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
    const [bannerUploading, setBannerUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bannerImageRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [isAttachmentDragging, setIsAttachmentDragging] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialData || {
        name: '',
        organizationId: '',
        type: '',
        gientechType: '',
        shortIntro: '',
        status: false,
        links: {
            website: '',
            github: '',
            demo: ''
        },
        contact: [],
        tags: [],
        keywords: [],
        assets: [],
        banner: {
            status: 0,
            coverImg: '',
            title: '',
            description: '',
            url: ''
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const isEditing = !!id;

    // 获取组织列表
    const fetchOrganizations = async () => {
        try {
            const response = await fetch('/api/organization');
            if (!response.ok) throw new Error('获取组织列表失败');
            const data = await response.json();
            setOrganizations(data);
        } catch (error) {
            console.error('Error fetching organizations:', error);
            toast.error('获取组织列表失败');
        }
    };

    // 获取联系人列表
    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/contacts');
            if (!response.ok) throw new Error('获取联系人列表失败');
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            toast.error('获取联系人列表失败');
        }
    };

    useEffect(() => {
        fetchOrganizations();
        fetchContacts();
    }, []);

    // 根据 banner 数据判断是否显示
    useEffect(() => {
        if (initialData?.banner) {
            const hasBannerData = Object.values(initialData.banner).some(value => 
                typeof value === 'string' && value !== ''
            );
            if (hasBannerData) {
                setFormData(prev => ({
                    ...prev,
                    banner: {
                        ...initialData.banner,
                        status: 1
                    }
                }));
            }
        }
    }, [initialData]);

    // 过滤联系人
    const filteredContacts = contacts.filter(contact => {
        const searchLower = searchQuery.toLowerCase();
        return (
            contact.name.toLowerCase().includes(searchLower) ||
            contact.label.toLowerCase().includes(searchLower) ||
            contact.email.toLowerCase().includes(searchLower)
        );
    });

    // 获取选中的联系人详情
    const selectedContacts = contacts.filter(contact => 
        formData.contact.includes(contact._id)
    );

    // 处理文件上传
    const handleFileUpload = async (files: File[] | FileList) => {
        const fileArray = Array.from(files);

        // 验证文件
        for (const file of fileArray) {
            if (!Object.keys(ALLOWED_FILE_TYPES).some(type => {
                const regex = new RegExp(type.replace('*', '.*'));
                return regex.test(file.type);
            })) {
                toast.error(`不支持的文件类型: ${file.name}`);
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                toast.error(`文件过大: ${file.name}`);
                return;
            }

            if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
                toast.error(`图片文件过大: ${file.name}`);
                return;
            }

            setUploadingFiles(prev => ({
                ...prev,
                [file.name]: true
            }));
        }

        const uploadPromises = fileArray.map(async (file) => {
            try {
                // 创建 FormData
                const formData = new FormData();
                formData.append('file', file);
                formData.append('applicationId', id || ''); // 添加应用ID

                console.log('Uploading file:', {
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    applicationId: id
                });

                // 发送上传请求到正确的API路径
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: formData
                });

                let data;
                try {
                    const responseText = await response.text();
                    console.log('Upload response:', responseText);
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error('Response parsing error:', e);
                    throw new Error('服务器响应格式错误');
                }

                if (!response.ok) {
                    throw new Error(data.error || '上传失败');
                }

                // 更新表单数据
                setFormData(prev => ({
                    ...prev,
                    assets: [...prev.assets, data.url]
                }));

                toast.success(`上传成功: ${file.name}`);
                return data.url;
            } catch (error) {
                console.error('Upload error:', error);
                const errorMessage = error instanceof Error ? error.message : '未知错误';
                toast.error(`上传失败: ${file.name} - ${errorMessage}`);
                return null;
            } finally {
                setUploadingFiles(prev => {
                    const newState = { ...prev };
                    delete newState[file.name];
                    return newState;
                });
            }
        });

        await Promise.all(uploadPromises);
    };

    // 删除文件
    const handleFileDelete = async (fileUrl: string) => {
        try {
            const response = await fetch('/api/upload', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: fileUrl })
            });

            if (!response.ok) {
                throw new Error('删除失败');
            }

            setFormData(prev => ({
                ...prev,
                assets: prev.assets.filter(url => url !== fileUrl)
            }));

            toast.success('删除成功');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('删除失败');
        }
    };

    // 获取文件图标
    const getFileIcon = (fileUrl: string) => {
        const ext = fileUrl.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
            return <Image className="w-5 h-5" />;
        }
        if (['mp4', 'webm', 'ogg'].includes(ext || '')) {
            return <Video className="w-5 h-5" />;
        }
        return <File className="w-5 h-5" />;
    };

    // 处理表单提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditing ? `/api/applications/${id}` : '/api/applications';
            const method = isEditing ? 'PUT' : 'POST';

            // 提交时直接使用formData.banner，status只由Switch控制
            const submitData = {
                ...formData,
                // status: formData.status ? 1 : 0,
                banner: formData.banner
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) throw new Error(isEditing ? '更新应用失败' : '创建应用失败');

            toast.success(isEditing ? '更新成功' : '创建成功');
            router.push('/admin/applications');
        } catch (error) {
            console.error('Error:', error);
            toast.error(isEditing ? '更新失败' : '创建失败');
        } finally {
            setLoading(false);
        }
    };

    // 处理输入变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => {
                const parentObj = prev[parent as keyof FormData];
                if (typeof parentObj === 'object' && parentObj !== null) {
                    return {
                        ...prev,
                        [parent]: {
                            ...parentObj,
                            [child]: value
                        }
                    };
                }
                return prev;
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // 处理关键词变化
    const handleKeywordsChange = (keyword: string) => {
        if (!keyword.trim()) return;
        setFormData(prev => ({
            ...prev,
            keywords: [...prev.keywords, keyword.trim()]
        }));
    };

    // 删除关键词
    const removeKeyword = (index: number) => {
        setFormData(prev => ({
            ...prev,
            keywords: prev.keywords.filter((_, i) => i !== index)
        }));
    };

    // 处理联系人选择
    const handleContactChange = (contactId: string) => {
        setFormData(prev => {
            const newContacts = prev.contact.includes(contactId)
                ? prev.contact.filter(id => id !== contactId)
                : [...prev.contact, contactId];
            return {
                ...prev,
                contact: newContacts
            };
        });
    };

    // 处理 Banner 图片上传
    const handleBannerImageUpload = async (file: File) => {
        // 检查文件类型
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            toast.error('只支持 JPG、PNG、GIF、WebP 格式的图片');
            return;
        }

        // 检查文件大小
        if (file.size > MAX_IMAGE_SIZE) {
            toast.error('图片大小不能超过 5MB');
            return;
        }

        // 创建预览
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // 独立 banner uploading 状态
        setBannerUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            // formData.append('applicationId', id && id !== 'undefined' ? id : 'temp'); // 只对 banner 上传生效
            formData.append('isBanner', 'true'); // 标记为banner上传

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '上传失败');
            }

            console.log(process.env.NEXT_PUBLIC_MINIO_ENDPOINT+":"+process.env.NEXT_PUBLIC_MINIO_PORT,'youyouyouyou')
            const {url} = await response.json();
            setFormData(prev => ({
                ...prev,
                banner: {
                    ...prev.banner,
                    coverImg: url
                }
            }));

            toast.success('封面图片上传成功');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error instanceof Error ? error.message : '封面图片上传失败');
            setImagePreview('');
        } finally {
            setBannerUploading(false);
        }
    };

    // 处理附件拖拽事件
    const handleAttachmentDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAttachmentDragging(true);
    };

    const handleAttachmentDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAttachmentDragging(false);
    };

    const handleAttachmentDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAttachmentDragging(true);
    };

    const handleAttachmentDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAttachmentDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        await handleFileUpload(files);
    };

    // 处理 Banner 拖拽事件
    const handleBannerDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleBannerDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleBannerDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleBannerDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        // 只处理第一个文件
        const file = files[0];
        handleBannerImageUpload(file);
    };

    // 获取文件图标和类型标签
    const getFileTypeInfo = (fileUrl: string) => {
        const ext = fileUrl.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
            return {
                icon: <Image className="w-5 h-5" />,
                type: '图片',
                color: 'bg-blue-100 text-blue-800'
            };
        }
        if (['mp4', 'webm', 'ogg'].includes(ext || '')) {
            return {
                icon: <Video className="w-5 h-5" />,
                type: '视频',
                color: 'bg-purple-100 text-purple-800'
            };
        }
        if (['pdf'].includes(ext || '')) {
            return {
                icon: <File className="w-5 h-5" />,
                type: 'PDF',
                color: 'bg-red-100 text-red-800'
            };
        }
        if (['doc', 'docx'].includes(ext || '')) {
            return {
                icon: <File className="w-5 h-5" />,
                type: 'Word',
                color: 'bg-indigo-100 text-indigo-800'
            };
        }
        return {
            icon: <File className="w-5 h-5" />,
            type: '文件',
            color: 'bg-gray-100 text-gray-800'
        };
    };

    // 获取格式化的文件大小
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    // 在组件内添加工具函数
    const getBannerImgUrl = (coverImg: string) => {
        if (!coverImg) return '';
        // 如果已经是 http/https 开头，直接返回
        if (/^https?:\/\//.test(coverImg)) return coverImg;
        // 兜底拼接 MinIO 地址
        console.log( `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}:${process.env.NEXT_PUBLIC_MINIO_PORT}${coverImg.startsWith('/') ? '' : '/'}${coverImg}`,'wahahahahhah')
        return `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}:${process.env.NEXT_PUBLIC_MINIO_PORT}${coverImg.startsWith('/') ? '' : '/'}${coverImg}`;
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                contact: Array.isArray(initialData.contact)
                    ? initialData.contact.map((c: any) => typeof c === 'string' ? c : c._id)
                    : [],
            });
        }
    }, [initialData]);

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="container mx-auto py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    {isEditing ? '编辑应用' : '创建应用'}
                </h1>

                <form id="applicationForm" onSubmit={handleSubmit} className="space-y-8">
                    {/* 应用名称和状态 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                <h2>应用名称</h2>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Switch
                                    checked={formData.status}
                                    onChange={(checked) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            status: checked
                                        }));
                                    }}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${formData.status ? 'bg-blue-600' : 'bg-gray-200'}`}
                                >
                                    <span className="sr-only">应用状态</span>
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${formData.status ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </Switch>
                                <span className="text-sm text-gray-700">
                                    {formData.status ? '已上线' : '未上线'}
                                </span>
                            </div>
                        </div>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="请输入应用名称"
                        />
                    </div>
       {/* 标签信息 */}
       <div className="space-y-6">
                                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    <h2>标签信息</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            关键词
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {formData.keywords.map((keyword, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {keyword}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeKeyword(index)}
                                                        className="ml-2 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:text-blue-600"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="输入关键词并按回车"
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const input = e.target as HTMLInputElement;
                                                        handleKeywordsChange(input.value);
                                                        input.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                    {/* 主要内容 - 左右布局 */}
                    <div className="flex gap-8">
                        {/* 左侧 */}
                        <div className="flex-1 space-y-8">
                            {/* 基本信息 */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    <h2>基本信息</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            所属组织 <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="organizationId"
                                            required
                                            value={formData.organizationId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        >
                                            <option value="">请选择组织</option>
                                            {organizations.map(org => (
                                                <option key={org._id} value={org._id}>
                                                    {org.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            应用类型 <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="type"
                                            required
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        >
                                            <option value="">请选择应用类型</option>
                                            {APPLICATION_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            技术类型
                                        </label>
                                        <input
                                            type="text"
                                            name="gientechType"
                                            value={formData.gientechType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="请输入技术类型，如：AI、区块链等"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            简介
                                        </label>
                                        <textarea
                                            name="shortIntro"
                                            value={formData.shortIntro}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="请输入应用简介"
                                        />
                                    </div>
                                </div>
                            </div>

                     
                        </div>

                        {/* 右侧 */}
                        <div className="flex-1 space-y-8">
                            {/* 链接信息 */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    <h2>链接信息</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            网站链接
                                        </label>
                                        <input
                                            type="url"
                                            name="links.website"
                                            value={formData.links.website}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="请输入网站链接"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            GitHub 链接
                                        </label>
                                        <input
                                            type="url"
                                            name="links.github"
                                            value={formData.links.github}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="请输入 GitHub 链接"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            演示链接
                                        </label>
                                        <input
                                            type="url"
                                            name="links.demo"
                                            value={formData.links.demo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="请输入演示链接"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 联系人信息 */}
                    {isEditing && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                <h2>联系人信息</h2>
                            </div>
                            <Combobox
                                as="div"
                                className="relative w-72"
                                value=""
                                onChange={(contactId: string) => {
                                    handleContactChange(contactId);
                                    setSearchQuery('');
                                }}
                            >
                                <div className="relative">
                                    <Combobox.Button as="div">
                                        <Combobox.Input
                                            className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="搜索并选择联系人..."
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => {
                                                setSearchQuery('');
                                            }}
                                            value={searchQuery}
                                            displayValue={() => searchQuery}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <Search className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </Combobox.Button>
                                </div>
                                <Combobox.Options 
                                    className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200"
                                >
                                    {searchQuery === '' ? (
                                        contacts.map(contact => (
                                            <Combobox.Option
                                                key={contact._id}
                                                value={contact._id}
                                                className={({ active }) => `
                                                    relative cursor-pointer select-none py-2 px-4
                                                    ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}
                                                `}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {contact.name}
                                                            <span className="ml-2 text-gray-500">
                                                                ({contact.label})
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {contact.email}
                                                        </div>
                                                    </div>
                                                    {formData.contact.includes(contact._id) && (
                                                        <div className="text-blue-500">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </Combobox.Option>
                                        ))
                                    ) : filteredContacts.length === 0 ? (
                                        <div className="px-4 py-2 text-sm text-gray-500">
                                            未找到匹配的联系人
                                        </div>
                                    ) : (
                                        filteredContacts.map(contact => (
                                            <Combobox.Option
                                                key={contact._id}
                                                value={contact._id}
                                                className={({ active }) => `
                                                    relative cursor-pointer select-none py-2 px-4
                                                    ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}
                                                `}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {contact.name}
                                                            <span className="ml-2 text-gray-500">
                                                                ({contact.label})
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {contact.email}
                                                        </div>
                                                    </div>
                                                    {formData.contact.includes(contact._id) && (
                                                        <div className="text-blue-500">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </Combobox.Option>
                                        ))
                                    )}
                                </Combobox.Options>
                            </Combobox>
                        </div>

                        {/* 已选择的联系人 */}
                        <div className="flex flex-wrap gap-3  justify-end">
                            {selectedContacts.map(contact => (
                                <div
                                    key={contact._id}
                                    className="flex flex-wrap w-[49%] items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div >
                                        <div className="text-sm font-medium text-gray-900">
                                            {contact.name}
                                            <span className="ml-2 text-gray-500">({contact.label})</span>
                                        </div>
                                        <div className="text-sm text-gray-500">{contact.email}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleContactChange(contact._id)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {selectedContacts.length === 0 && (
                                <div className="text-center py-4 text-gray-500">
                                    暂未选择联系人
                                </div>
                            )}
                        </div>
                    </div>
                    )}

                    {/* 文件上传部分 */}
                    {isEditing && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                            <h2>附件资料</h2>
                        </div>
                        <div className="space-y-4">
                            {/* 上传区域 */}
                            <div 
                                className={`flex flex-col items-center justify-center w-full border-2 ${
                                    isAttachmentDragging 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-300 border-dashed'
                                } rounded-lg p-6 transition-colors duration-200`}
                                onDragEnter={handleAttachmentDragEnter}
                                onDragLeave={handleAttachmentDragLeave}
                                onDragOver={handleAttachmentDragOver}
                                onDrop={handleAttachmentDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                                    accept={Object.keys(ALLOWED_FILE_TYPES).join(',')}
                                />
                                <div 
                                    className={`flex flex-col items-center cursor-pointer ${
                                        isAttachmentDragging ? 'text-blue-600' : ''
                                    }`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className={`w-12 h-12 ${
                                        isAttachmentDragging ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                    <div className="mt-4 text-center">
                                        <div className="text-sm">
                                            <span className="font-medium text-blue-600 hover:text-blue-500">点击上传</span>
                                            {' '}或拖拽文件到此处
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            支持图片、PDF、Word文档和视频，单个文件最大100MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 文件列表 */}
                            {formData.assets.length > 0 && (
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <ul className="divide-y divide-gray-200">
                                        {formData.assets.map((fileUrl, index) => {
                                            const { icon, type, color } = getFileTypeInfo(fileUrl);
                                            const fileName = decodeURIComponent(fileUrl.split('/').pop() || '');
                                            return (
                                                <li 
                                                    key={index}
                                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <div className="flex items-center space-x-4 min-w-0">
                                                        <div className={`p-2 rounded-lg ${color.split(' ')[0]} bg-opacity-20`}>
                                                            {icon}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {fileName}
                                                            </p>
                                                            <div className="flex items-center space-x-2 mt-1">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
                                                                    {type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete(fileUrl)}
                                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                                            title="删除文件"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            {/* 上传状态 */}
                            {Object.keys(uploadingFiles).length > 0 && (
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="space-y-3">
                                        {Object.entries(uploadingFiles).map(([fileName]) => (
                                            <div
                                                key={fileName}
                                                className="flex items-center space-x-3"
                                            >
                                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-sm text-gray-600">正在上传: {fileName}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    )}
                    {/* Banner 模块 */}
                    {isEditing && (
                    <div className="space-y-6 border-t pt-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                <h2>Banner 设置</h2>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Switch
                                    checked={formData.banner.status === 1}
                                    onChange={(checked) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            banner: checked ? {
                                                ...prev.banner,
                                                status: 1
                                            } : {
                                                status: 0,
                                                coverImg: '',
                                                title: '',
                                                description: '',
                                                url: ''
                                            }
                                        }));
                                        if (!checked) {
                                            setImagePreview('');
                                        }
                                    }}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${formData.banner.status === 1 ? 'bg-blue-600' : 'bg-gray-200'}`}
                                >
                                    <span className="sr-only">Banner 状态</span>
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${formData.banner.status === 1 ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </Switch>
                                <span className="text-sm text-gray-700">
                                    {formData.banner.status === 1 ? '显示' : '隐藏'}
                                </span>
                            </div>
                        </div>
                        {formData.banner.status === 1 && (
                            <div className="grid grid-cols-2 gap-8">
                                {/* 左侧：封面图片上传 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        封面图片
                                    </label>
                                    <div 
                                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                                            isDragging 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-300 border-dashed'
                                        } rounded-lg transition-colors duration-200`}
                                        onDragEnter={handleBannerDragEnter}
                                        onDragLeave={handleBannerDragLeave}
                                        onDragOver={handleBannerDragOver}
                                        onDrop={handleBannerDrop}
                                    >
                                        <div className="space-y-1 text-center">
                                            <input
                                                ref={bannerImageRef}
                                                type="file"
                                                className="hidden"
                                                accept={ALLOWED_IMAGE_TYPES.join(',')}
                                                onChange={(e) => e.target.files?.[0] && handleBannerImageUpload(e.target.files[0])}
                                            />
                                            {(imagePreview || formData.banner.coverImg) ? (
                                                <div className="relative group">
                                                    <img
                                                        src={imagePreview || getBannerImgUrl(formData.banner.coverImg)}
                                                        alt="Banner preview"
                                                        className="max-w-full max-h-[280px] rounded-lg object-contain mx-auto"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => bannerImageRef.current?.click()}
                                                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                            >
                                                                <Upload className="w-5 h-5 text-gray-600" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        banner: {
                                                                            ...prev.banner,
                                                                            coverImg: ''
                                                                        }
                                                                    }));
                                                                    setImagePreview('');
                                                                }}
                                                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                            >
                                                                <X className="w-5 h-5 text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div 
                                                    className={`flex flex-col items-center cursor-pointer ${
                                                        isDragging 
                                                            ? 'text-blue-600' 
                                                            : 'hover:bg-gray-50'
                                                    } rounded-lg p-4 transition-colors duration-200`}
                                                    onClick={() => bannerImageRef.current?.click()}
                                                >
                                                    <Upload className={`mx-auto h-12 w-12 ${
                                                        isDragging ? 'text-blue-600' : 'text-gray-400'
                                                    }`} />
                                                    <div className="mt-4">
                                                        <div className="text-sm text-gray-600">
                                                            <span className="font-medium text-blue-600 hover:text-blue-500">
                                                                点击上传
                                                            </span>
                                                            {' '}或拖拽图片到此处
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            支持 JPG、PNG、GIF、WebP 格式，大小不超过 5MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {bannerUploading && (
                                                <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                                                    <div className="w-4 h-4 mr-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                    正在上传...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 右侧：Banner 信息 */}
                                <div className="space-y-4">
                                    {/* Banner 标题 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            标题
                                        </label>
                                        <input
                                            type="text"
                                            name="banner.title"
                                            value={formData.banner?.title || ''}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="请输入 Banner 标题"
                                        />
                                    </div>

                                    {/* Banner 描述 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            描述
                                        </label>
                                        <textarea
                                            name="banner.description"
                                            value={formData.banner?.description || ''}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="请输入 Banner 描述"
                                        />
                                    </div>

                                    {/* Banner 链接 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            链接
                                        </label>
                                        <input
                                            type="text"
                                            name="banner.url"
                                            value={formData.banner?.url || ''}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="请输入 Banner 链接"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </form>
            </div>

            {/* 底部固定操作栏 */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4">
                <div className="container mx-auto flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        form="applicationForm"
                        disabled={loading || Object.keys(uploadingFiles).length > 0}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:bg-blue-400"
                    >
                        {loading ? (isEditing ? '更新中...' : '创建中...') : (isEditing ? '更新应用' : '创建应用')}
                    </button>
                </div>
            </div>
        </div>
    );
} 