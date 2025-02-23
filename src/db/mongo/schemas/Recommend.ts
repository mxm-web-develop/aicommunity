import mongoose, { Schema, model, models } from 'mongoose';

export interface IRecommend {
  apps: {
    name?: string;
    organizationId?: string;
    type?: string;
    appId: mongoose.Types.ObjectId;
  }[];
}

const RecommendSchema = new Schema({
  apps: [{
    name: { type: String },
    organizationId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',  // 引用 Organization 模型
      required: false 
    },
    type: { type: String, required: false },
    appId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applications',
      required: true 
    }
  }]
});

export const Recommend = models.Recommend || model('Recommend', RecommendSchema);
