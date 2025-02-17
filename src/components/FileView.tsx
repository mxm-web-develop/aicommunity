"use client";
import { useFileViewer, registerPDFWorker } from "@mxmweb/fv";
import "@mxmweb/fv/style.css";
registerPDFWorker("/worker/pdf.worker.min.js");

interface IFileView {
  fileSuffix?: string;
  fileName?: string;
  filePath: string;
}

export default function FileView(props: IFileView) {
  const { filePath } = props;

  const { Element } = useFileViewer({
    fileUrl: filePath,
    bgColor: "#fff",
    hide_toolbar: false
  });

  return <div className="overflow-y-auto h-full">{Element}</div>;
}
