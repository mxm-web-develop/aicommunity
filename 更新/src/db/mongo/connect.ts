import mongoose from 'mongoose';

// 检查必要的环境变量
const requiredEnvVars = [
  'MONGO_USERNAME',
  'MONGO_PASSWORD',
  'MONGO_HOST',
  'MONGO_PORT',
  'MONGO_DB',
  'MONGO_AUTH_SOURCE'
];

// 验证所有必需的环境变量
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// 构建 MongoDB URI
const MONGODB_URI_FULL = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH_SOURCE}`;

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    // 打印连接信息（隐藏密码）
    const debugUri = MONGODB_URI_FULL.replace(/:([^@]+)@/, ':****@');
    console.log('Attempting to connect to MongoDB with URI:', debugUri);
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      retryReads: true
    };

    // 添加重试逻辑
    let retries = 3;
    while (retries > 0) {
      try {
        await mongoose.connect(MONGODB_URI_FULL, options);
        isConnected = true;
        console.log('MongoDB connected successfully');
        return;
      } catch (err) {
        retries--;
        console.log(`Connection attempt failed. Retries left: ${retries}`);
        if (retries === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  } catch (error) {
    console.error('MongoDB connection error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    isConnected = false;
    throw error;
  }
}

export async function disconnectFromDatabase() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('MongoDB disconnection error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}