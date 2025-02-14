import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  label: string;
  name: string;
  email: string;
  organizationId?: string;
  department?:string;
}

const ContactSchema = new Schema({
  label: { type: String, required: true,
    trim: true,  // 自动删除首尾空格
    minlength: [1, '名称至少需要1个字符'],
    maxlength: [50, '名称不能超过50个字符'] },
  organizationId: { type: String, required: false },
  department: { type: String, required: false },
  name: { type: String, required: false,trim: true,  // 自动删除首尾空格
    minlength: [1, '名称至少需要1个字符'],
    maxlength: [50, '名称不能超过50个字符'] },
  email: { type: String, required: false, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址'] },
});

export const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);