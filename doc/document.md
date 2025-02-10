# 开发规范

支持 Pc 端和移动端
支持主题色切换
支持多语言

## 服务端渲染 {app}

- /home
- /applications
- /application/{id}

## 客户端渲染 （components）

## 数据填充

- minio
- mongo

# 设计参考

## 首页
### 导航
### banner
### 推荐应用
### footer

## 应用列表
### 导航
### 应用列表
### footer

## 应用详情
### 导航
### 应用详情
### 同类推荐应用
### 资源下载
### footer




# 数据格式
## 测试环境

### MongoDB
```
MONGODB_URI=mongodb://admin:password@mxm-ai.com:27017/testmongo?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=password
MONGO_HOST=mxm-ai.com
MONGO_PORT=27017
MONGO_DB=testmongo
MONGO_AUTH_SOURCE=admin
```
### MinIO
```
MINIO_ENDPOINT=45.77.12.232
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password
MINIO_BUCKET_NAME=test
```
### 组织 organization

```json
{
  "id": "1",
  "name": "中电金信AI研究院",
  "logo": "https://www.zjfintech.com/logo.png",
  "description": "中电金信是一家专注于金融科技的公司，提供智能化的解决方案。",
  "url": "https://www.zjfintech.com"
}
```

### 应用资源 application

```json
{
  "id": "1",
  "organizationId": "1",
  "network": "gientech",
  "links":{
    "website": "https://www.zjfintech.com",
    "github": "https://www.zjfintech.com",
    "demo": "https://www.zjfintech.com",
  },
  "banner":{
    "status": 1,
    "title": "小鲸智能客服",
    "description": "小鲸智能客服是一款智能客服系统，提供智能化的解决方案。",
    "url": "https://www.zjfintech.com/banner.png"
  },
  "contact":["id1","id2"],
  "tag":["智能会话"，"银行金融"],
  "name": "小鲸智能客服",
  "status": 1,
  "info": {
    "logo": "https://www.zjfintech.com/logo.png 选填",
    "coverImg": "https://www.zjfintech.com/cover.png 选填",
    "short": "小鲸智能客服是一款智能客服系统，提供智能化的解决方案。500字以内",
    "post": "小鲸智能客服是一款智能客服系统，提供智能化的解决方案。markdown|html|string格式富文本显示",
  },
  "assets":[{
    "id": "1",
    "name": "小鲸智能客服白皮书",
    "format": "pdf",
    "url": "https://www.zjfintech.com/icon.pdf",
  }],
  "awards":["2024年最佳智能客服奖"],
  "createdAt": "2025-01-01",
  "updatedAt": "2025-01-01",
  "author": "张三",
  "reproduce": "https://www.zjfintech.com/reproduce.pdf"
}
```

### 联系人 contact

```json
[
  {
    "id": "1",
    "label": "技术支持",
    "name": "张三",
    "email": "zhangsan@zjfintech.com"
    // "phone": "13800138000",
  },
  {
    "id": "2",
    "label": "商务合作",
    "name": "李四",
    "email": "lisi@zjfintech.com"
    // "phone": "13800138000",
  }
]
```

### 事件 event

### 资源 resource

### 反馈系统 feedback
