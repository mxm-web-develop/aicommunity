'use client';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// 设置 PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `/worker/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url?: string;
  onClose: () => void;
}

const PDFViewer = ({ url, onClose }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  // 移动端默认 0.6 缩放，PC 端默认 1.0 缩放
  const [scale, setScale] = useState(window.innerWidth < 768 ? 0.8 : 1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 flex items-center justify-center">
      <div className="relative w-[95vw] md:w-[90vw] h-[98vh] md:h-[90vh] bg-white rounded-lg overflow-hidden flex flex-col">
        {/* 头部工具栏 */}
        <div className="flex items-center justify-between p-2 md:p-3 border-b bg-gray-50">
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
            <h3 className="text-sm font-medium whitespace-nowrap">文档预览</h3>
            {numPages && (
              <>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                    disabled={pageNumber <= 1}
                    className="p-1 md:px-2 md:py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs md:text-sm whitespace-nowrap">
                    {pageNumber}/{numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                    disabled={pageNumber >= numPages}
                    className="p-1 md:px-2 md:py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => setScale(s => Math.max(0.3, s - 0.1))}
                    className="p-1 md:px-2 md:py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs md:text-sm whitespace-nowrap min-w-[40px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={() => setScale(s => Math.min(2, s + 0.1))}
                    className="p-1 md:px-2 md:py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* PDF 内容区域 */}
        <div className="flex-1 overflow-auto p-2 md:p-4 bg-gray-100">
          {!url ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <div className="text-xs text-gray-600">文档加载中...</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center min-h-full">
              <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <div className="text-xs text-gray-600">PDF加载中...</div>
                  </div>
                }
                error={
                  <div className="text-xs text-red-500">
                    文档加载失败，请稍后重试
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg bg-white"
                />
              </Document>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;