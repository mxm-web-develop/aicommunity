"use client";
import { useEffect } from "react";
import { useFileViewer, registerPDFWorker } from "./@mxmweb/fv";
import "./@mxmweb/fv/assets/style.css";

interface IFileView {
  curFileInfo: { fileSuffix?: string; fileName?: string; filePath: string };
  handleEvent: (type: string, data?: any) => void;
}

export default function FileView(props: IFileView) {
  const { curFileInfo, handleEvent } = props;
  
  useEffect(() => {
    // 移到 useEffect 中，确保只在客户端执行
    registerPDFWorker("/worker/pdf.worker.min.js");
    console.log("curFileInfo", curFileInfo);
  }, []); // 只在组件首次挂载时注册

  const { Element } = useFileViewer({
    fileUrl: curFileInfo.filePath,
    from: "pdf",
    bgColor: "#fff",
    actionOnEmmit: handleEvent,
    display_file_type: curFileInfo.fileSuffix,
    hide_toolbar: false,
    render_width: 900
  });

  return <div className="w-full overflow-y-auto h-full">{Element}</div>;
}