# API 接口文档

## 应用管理

### 获取应用列表
- **接口：** `GET /api/applications`
- **描述：** 获取应用列表，支持筛选
- **查询参数：**
  - `status`（可选）：按状态筛选（整数）
  - `classify`（可选）：按分类筛选（整数）
  - `organizationId`（可选）：按组织ID筛选
- **返回数据：**
  ```json
  {
    "success": true,
    "data": [Application]
  }
  ```

### 获取应用详情
- **接口：** `GET /api/applications/{id}`
- **描述：** 获取指定应用的详细信息
- **返回数据：**
  ```json
  {
    "success": true,
    "data": Application
  }
  ```

### 创建应用
- **接口：** `POST /api/applications`
- **描述：** 创建新应用
- **请求体：** 应用数据
- **返回数据：**
  ```json
  {
    "success": true,
    "data": Application
  }
  ```

### 更新应用
- **接口：** `PUT /api/applications`
- **描述：** 更新现有应用
- **请求体：**
  ```json
  {
    "id": "应用ID",
    ...更新数据
  }
  ```
- **返回数据：**
  ```json
  {
    "success": true,
    "data": Application
  }
  ```

### 更新应用状态
- **接口：** `PATCH /api/applications/{id}`
- **描述：** 更新应用状态
- **请求体：**
  ```json
  {
    "status": number
  }
  ```
- **返回数据：**
  ```json
  {
    "success": true,
    "data": Application
  }
  ```

### 删除应用
- **接口：** `DELETE /api/applications`
- **查询参数：**
  - `id`：应用ID
- **返回数据：**
  ```json
  {
    "success": true,
    "message": "应用删除成功"
  }
  ```

## 联系人管理

### 获取联系人列表
- **接口：** `GET /api/contacts`
- **描述：** 获取所有联系人
- **返回数据：** 联系人对象数组

### 获取联系人详情
- **接口：** `GET /api/contacts/{id}`
- **描述：** 获取指定联系人的详细信息
- **返回数据：** 联系人对象

### 创建联系人
- **接口：** `POST /api/contacts`
- **描述：** 创建新联系人
- **请求体：** 联系人数据
- **返回数据：** 创建的联系人对象

### 更新联系人
- **接口：** `PUT /api/contacts/{id}`
- **描述：** 更新现有联系人
- **请求体：** 更新的联系人数据
- **返回数据：** 更新后的联系人对象

### 删除联系人
- **接口：** `DELETE /api/contacts/{id}`
- **描述：** 删除联系人
- **返回数据：**
  ```json
  {
    "message": "联系人删除成功"
  }
  ```

## 组织管理

### 获取组织列表
- **接口：** `GET /api/organization`
- **描述：** 获取所有组织
- **返回数据：** 组织对象数组

### 获取组织详情
- **接口：** `GET /api/organization/{id}`
- **描述：** 获取指定组织的详细信息
- **返回数据：** 组织对象

### 创建组织
- **接口：** `POST /api/organization`
- **描述：** 创建新组织
- **请求体：** 组织数据
- **返回数据：** 创建的组织对象

### 更新组织
- **接口：** `PUT /api/organization`
- **描述：** 更新现有组织
- **请求体：**
  ```json
  {
    "id": "组织ID",
    ...更新数据
  }
  ```
- **返回数据：** 更新后的组织对象

### 删除组织
- **接口：** `DELETE /api/organization`
- **查询参数：**
  - `id`：组织ID
- **返回数据：**
  ```json
  {
    "message": "组织删除成功"
  }
  ```

## 富文本帖子

### 获取帖子列表
- **接口：** `GET /api/richpost`
- **描述：** 获取所有富文本帖子，支持筛选
- **查询参数：**
  - `type`（可选）：按帖子类型筛选
  - `status`（可选）：按状态筛选（整数）
- **返回数据：**
  ```json
  {
    "success": true,
    "data": [RichPost]
  }
  ```

### 获取帖子详情
- **接口：** `GET /api/richpost/{id}`
- **描述：** 获取指定帖子的详细信息
- **返回数据：** 帖子对象

### 创建帖子
- **接口：** `POST /api/richpost`
- **描述：** 创建新帖子
- **请求体：** 帖子数据
- **返回数据：** 创建的帖子对象

### 更新帖子
- **接口：** `PUT /api/richpost/{id}`
- **描述：** 更新现有帖子
- **请求体：** 更新的帖子数据
- **返回数据：** 更新后的帖子对象

### 删除帖子
- **接口：** `DELETE /api/richpost/{id}`
- **描述：** 删除帖子
- **返回数据：**
  ```json
  {
    "message": "帖子删除成功"
  }
  ```

## 文件上传

### 上传文件
- **接口：** `POST /api/upload`
- **描述：** 将文件上传到 MinIO 存储
- **请求体：** FormData
  - `file`：要上传的文件
  - `applicationId`：关联的应用ID
  - `overwrite`（可选）：是否允许覆盖，布尔值
- **返回数据：**
  ```json
  {
    "success": true,
    "url": "预签名URL"
  }
  ```
- **说明：**
  - 支持多种文件类型（图片、视频、音频、文档等）
  - 根据 MIME 类型自动分类文件
  - 返回的预签名 URL 有效期为 24 小时