import mongoose, { Schema, Document } from 'mongoose';

export interface IRichPost extends Document {
  type:string;
  content: string;
  draft:string;
  reproduce:string;
  format: string;
  author: string;
  status: number;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const RichPostSchema = new Schema(
  {
    author: { type: String, required: false, default: 'AI+智能小助手' },
    status: { type: Number, enum: [0,1,2,3], default: 0, required: true },
    reproduce: String,
    type: {
      type: String,
      required: true,
      enum: ['app_intro','news'], // 目前文档中只显示了 document 类型
      default: 'app_intro'
    },
    content: {
      type: String,
      required: false,
      default: '',
      validate: {
        validator: function(v: string) {
          // 如果内容存在，则必须不为空字符串
          return !v || v.length > 0;
        },
        message: '如果提供内容，则不能为空字符串'
      }
    },
    draft: {
      type: String,
      required: false,
      default: '',

      validate: {
        validator: function(v: string) {
          // 如果内容存在，则必须不为空字符串
          return !v || v.length > 0;
        },
        message: '如果提供内容，则不能为空字符串'
      }
    },
    format: {
      type: String,
      required: true,
      enum: ['markdown'],  // 目前文档中只显示了 markdown 格式
      default: 'markdown'
    },
    
    size: {
      type: Number,
      required: false,
      min: [0, '大小不能为负数'],
      validate: {
        validator: function(v: number) {
          return Number.isInteger(v);  // 确保是整数
        },
        message: '大小必须是整数'
      }
    }
  },
  {
    timestamps: true,  // 自动管理 createdAt 和 updatedAt
  }
);

// 添加索引以提高查询性能
RichPostSchema.index({ type: 1 });
RichPostSchema.index({ format: 1 });
RichPostSchema.index({ createdAt: -1 });  // 按创建时间降序

// 添加虚拟字段：大小的可读格式
RichPostSchema.virtual('sizeReadable').get(function(this: IRichPost) {
  const size = this.size || 0;  // 添加默认值
  const kb = size / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
});

// 确保虚拟字段在 JSON 中可见
RichPostSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc: any, ret: any) {
    delete ret._id;
    return ret;
  }
});

// 中间件：在保存前计算内容大小（如果未提供）
RichPostSchema.pre('save', function(next) {
  if (!this.size) {
    this.size = Buffer.byteLength(this.content || '', 'utf8');
  }
  next();
});

export const RichPost = mongoose.models.RichPost || mongoose.model<IRichPost>('RichPost', RichPostSchema);