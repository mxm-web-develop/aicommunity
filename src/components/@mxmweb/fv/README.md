# mxm 组件库文档

## 安装

```
yarn add @mxmweb/fv
```

## 更新说明

v1.1.4

- 添加 pdf 手动分页功能

v.1.1.2

- 在抛出的 close 事件内部处理了请求关闭，避免大文件在 close 之后还在后台下载

v.1.1.0

- 调整 worker 文件不进入打包输入，减轻输出文件体积，优化打包速度
- 对加载动画组件进行预制和传参开放，包括统一加载组件，fetch 阶段加载文字，rending 阶段加载文字
- 添加 worker 全局引入函数，提供给用户进行 pdf.worker 的引入
- 调整 PDF 的显示不居中问题，抛出 render_width 传参来控制内部显示块的宽度
- 替换 ui 图标库，使用统一 lucide

v1.0.28 支持图片，解决 xlsx 合并单元格 bug

## 当前支持文件类型

- PDF
- TXT
- Xlsx
- CVS
- docx （不能完全还原样式）
- html

| 待支持格式 图片,markdown,pptx

## 使用

```ts
import { useFileViewer } from '@mxmweb/fv';
import '@mxmweb/fv/style.css'
function Preview() {

  const handlethat = (type: string) => {
    console.log(type)
  }
  const { Element } = useFileViewer({
    fileUrl: '/files/1.pdf',
    // form:'',
    <!-- width: 680, -->
    actionOnEmmit: handlethat
  });

  return <div className="h-[700px] w-[850px] relative mx-auto">{Element}</div>;
}

```

### 完整参数

```ts
interface IUseFileViewer {
  fileUrl: string[] | string;
  form?: string;
  display_file_type: string;
  render_width: number;
  render_scale: number;
  LoadingComponent: ReactNode;
  fetching_text: string;
  rending_text: string;
  error_text: string;
  actionOnEmmit?: (type: string, data?: any) => any;
}
```

### 相关资源

- Worker 文件下载地址 https://github.com/mxm-web-develop/fileviewer/tree/master/public/worker

## vite 环境引入需要配置 optimizeDeps

```

// vite.config.js export default { optimizeDeps: { exclude: ['@mxmweb/fv'] } }

```
