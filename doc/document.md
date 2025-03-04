# 开发规范

支持 Pc 端和移动端
支持主题色切换
支持多语言

## 服务端渲染 {app}

- /{root}
- /applications
- /application/{id}

## 客户端渲染 （components）

## 数据填充

- minio
- mongo

# 设计参考

## 首页

### 导航

主题色切换

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

```
### MinIO
```

MINIO_ENDPOINT=45.77.12.232
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password
MINIO_BUCKET_NAME=test

````
### 组织 organization

```json
{
  "id": "1",
  "name": "中电金信",
  "subGroup":["AI","AI+"],
  "logo": "https://www.zjfintech.com/logo.png",
  "description": "中电金信是一家专注于金融科技的公司，提供智能化的解决方案。",
  "url": "https://www.zjfintech.com"
}
````

### 富文本资源 richPosts

```json
{
  "id": "post_1",
  "type": "document",
  "content": "富文本内容...",
  "format": "markdown",
  "size": 1024, // 存储内容大小（字节），用于监控
  "createdAt": "2024-03-20T10:00:00Z",
  "updatedAt": "2024-03-20T10:00:00Z"
}
```

### 应用资源 application

```json
{
  "id": "1",
  "organization": {
    "id": "1",
    "group":0,
  },
  "network": "gientech",
  "links":{
    "website": "https://www.zjfintech.com",
    "github": "https://www.zjfintech.com",
    "demo": "https://www.zjfintech.com",
  },
  "banner"?:{
    "status": 1,
    "title": "小鲸智能客服",
    "description": "小鲸智能客服是一款智能客服系统，提供智能化的解决方案。",
    "url": "https://www.zjfintech.com/banner.png"
  },
  "contact":["id1","id2"],
  "tag":["智能会话"，"银行金融"],
  "name": "小鲸智能客服",
  "status": 1,
  "shortIntro": "小鲸智能客服是一款智能客服系统，提供智能化的解决方案。500字以内",
  "richPostId": "post_1",
  "assets":[{
    "id": "1",
    "name": "小鲸智能客服白皮书",
    "size": 1024,
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
    "organization": {
      "id": "1",
      "group": 0
    },
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

### 热门推荐 recommend

```json
{
  "applications": ["applicationId1", "applicationId2"]
}
```

### 事件 event

### 资源 resource

### 反馈系统 feedback
