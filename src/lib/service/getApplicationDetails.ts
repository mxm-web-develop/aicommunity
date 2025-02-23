import { Application } from '@/db/mongo/schemas/Applications';
import { connectToDatabase } from '@/db/mongo/connect';
import { Types } from 'mongoose';
import { Contact } from '@/db/mongo/schemas/Contacts';


// 修改获取应用详情的方法
export async function getApplicationDetails(id: string) {
  try {
    if (!id || !Types.ObjectId.isValid(id)) {
      return null
    }
    await connectToDatabase();
    
    const application = await Application.findById(new Types.ObjectId(id))
      .populate({
        path: 'contact',
        model: Contact,
        select: 'name email label'
      })
      .populate('productIntro_id', 'content')
      .select(`
        name 
        gientechType 
        shortIntro 
        links 
        contact 
        assets 
        productIntro_id
        keywords 
        organizationId 
        _id
      `)
      .lean();

    // 添加安全转换逻辑
    const safeApplication = application ? JSON.parse(JSON.stringify(application, (key, value) => {
      // 转换所有ObjectId为字符串
      if (value && value._id) {
        return { ...value, _id: value._id.toString() };
      }
      return value;
    })) : null;

    // 特别处理contact字段
    if (safeApplication?.contact) {
      safeApplication.contact = safeApplication.contact.map((contact: any) => ({
        ...contact,
        _id: contact._id.toString() // 确保contact的_id也转换
      }));
    }

    return safeApplication;
  } catch (error) {
    console.error('Error fetching application details:', error);
    return null;
  }
}