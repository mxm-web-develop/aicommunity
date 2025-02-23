"use client";
import { useEffect } from "react";
import { useFileViewer, registerPDFWorker } from "./@mxmweb/fv";
import "./@mxmweb/fv/assets/style.css";
registerPDFWorker("/worker/pdf.worker.min.js");

interface FileViewProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
  fileType?: string;
}

export default function FileView(props: FileViewProps) {
  const { fileUrl, fileName, onClose, fileType } = props;
  
  useEffect(() => {
    // 移到 useEffect 中，确保只在客户端执行
   
    console.log("curFileInfo", { fileUrl, fileName });
  }, []); // 只在组件首次挂载时注册

  const { Element } = useFileViewer({
    fileUrl,
    from: "pdf",
    bgColor: "#fff",
    actionOnEmmit: onClose,
    display_file_type: fileType,
    hide_toolbar: false,
    render_width: 900
  });

  return <div className="w-full overflow-y-auto h-full">{Element}</div>;
}