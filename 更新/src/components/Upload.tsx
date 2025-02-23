'use client';

import { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setStatus('请选择文件');
      return;
    }

    try {
      setStatus('上传中...');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '上传失败');
      }

      setStatus('上传成功！');
      setFileUrl(data.url);

    } catch (error) {
      console.error('上传错误:', error);
      setStatus(`上传失败:`);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          上传
        </button>
      </div>

      {status && (
        <div className="mb-4">
          状态: {status}
        </div>
      )}

      {fileUrl && (
        <div>
          <div>文件链接:</div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
}