"use client";
import { useEffect } from "react";
import { useFileViewer, registerPDFWorker } from "./@mxmweb/fv";
import "./@mxmweb/fv/assets/style.css";

registerPDFWorker("/worker/pdf.worker.min.js");

interface IFileView {
  curFileInfo: { fileSuffix?: string; fileName?: string; filePath: string };
  handleEvent: (type: string, data?: any) => void;
}

export default function FileView(props: IFileView) {
  const { curFileInfo, handleEvent } = props;
  useEffect(() => {
    console.log("curFileInfo", curFileInfo);
  }, [curFileInfo]);
  const { Element } = useFileViewer({
    fileUrl: curFileInfo.filePath,
    from: "pdf",
    bgColor: "#fff",
    actionOnEmmit: handleEvent,
    display_file_type: curFileInfo.fileSuffix,
    hide_toolbar: false
  });

  return <div className="w-full overflow-y-auto h-full">{Element}</div>;
}
