import mongoose, { Schema, Document } from 'mongoose';
import { Contact } from '@/db/mongo/schemas/Contacts';  // 引入已有的 Contact model
import { RichPost } from '@/db/mongo/schemas/RichPosts';  // 引入已有的 RichPost model
// 链接接口
interface ILinks {
  website?: string;
  github?: string;
  demo?: string;
}

// Banner接口
interface IBanner {
  status: number;
  title: string;
  coverImg:string;
  description: string;
  url: string;
}

// 资源接口
interface IAsset {
  name: string;
  size: number;
  format: string;
  url: string;
}

// 应用接口
export interface IApplication extends Document {
  organizationId: string;
  network: string;
  links: ILinks;
  banner?: IBanner;
  contact: any[];
  gientechType?: string;
  classify: number;
  tags: string[];
  keywords?: string[];
  name: string;
  status: number;
  shortIntro: string;
  richPostId: string;
  assets: IAsset[];
  awards: string[];
  author: string;
  reproduce?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    //组织id
    organizationId: { type: String, required: true },
    //网络
    network: { type: String, default: 'gientech' },
    //关键词
    keywords: { type: [String], required: false },
    //类型
    gientechType: { type: String, required: false },
    //链接
    links: {
      website: { type: String, required: false },
      github: { type: String, required: false },
      demo: { type: String, required: false },
    },
    banner: {
      status: { type: Number, default: 0 },
      coverImg: { type: String, required: false },
      title: String,
      description: String,
      url: String,
    },
    //联系人
    contact: [{ type: Schema.Types.ObjectId, ref: 'Contact' }],  // 引用Contact模型
    //标签
    tags: [{ type: String }],
    classify: { type: Number, enum: [0,1, 2, 3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],default: 0, required: true },
    name: { type: String, required: true },
    status: { type: Number, default: 1 },
    shortIntro: { 
      type: String, 
      required: false,
      maxlength: 1000  // 确保简介不超过1000字
    },
    richPostId: { type: String, ref: 'RichText' },  // 引用RichText模型
    assets: [{
      name: { type: String, required: true },
      size: { type: Number, required: false },
      format: { type: String, required: true },
      url: { type: String, required: true },
    }],
    awards: [{ type: String }],
    
  },
  {
    timestamps: true,  // 自动管理 createdAt 和 updatedAt
  }
);

// 添加索引以提高查询性能
ApplicationSchema.index({ name: 1 });
ApplicationSchema.index({ 'organization.id': 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ tag: 1 });

// 添加验证
ApplicationSchema.path('shortIntro').validate(function(intro: string) {
  return intro.length <= 500;
}, 'shortIntro must be less than or equal to 500 characters');

// 添加虚拟字段（如果需要）
ApplicationSchema.virtual('isActive').get(function() {
  return this.status === 1;
});

// 确保JSON输出包含虚拟字段
ApplicationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc: any, ret: any) {
    delete ret._id;
    return ret;
  }
});

export const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);