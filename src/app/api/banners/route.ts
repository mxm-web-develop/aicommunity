import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/db/mongo/connect';
import { Application } from '@/db/mongo/schemas/Applications';

// 确保URL是完整的
function ensureFullUrl(url: string) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    if (url.startsWith('//')) {
        return `https:${url}`;
    }
    if (url.startsWith('/')) {
        return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    }
    return `https://${url}`;
}

export async function GET() {
    try {
        await connectToDatabase();

        const banners = await Application.find({
            status: 1,
            'banner.status': 1,
            'banner.title': { $exists: true },
            // 'banner.description': { $exists: true },
            'banner.coverImg': { $exists: true }
        })
        .select('_id name banner')
        .lean();

        // 格式化返回数据以匹配SwiperBanner组件的Banner接口
        const formattedBanners = banners.map(app => ({
            _id: app._id.toString(),
            status: 1,
            title: app.banner.title,
            description: app.banner.description,
            coverImg: ensureFullUrl(app.banner.coverImg),
            url: app.banner.url || `/applications/${app._id.toString()}`
        }));

        return NextResponse.json({
            success: true,
            data: formattedBanners
        });
    } catch (error) {
        console.error('Error fetching banners:', error);
        return NextResponse.json(
            { success: false, error: '获取banner数据失败' },
            { status: 500 }
        );
    }
} 