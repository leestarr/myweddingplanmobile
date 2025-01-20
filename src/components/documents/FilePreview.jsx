import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useDocuments } from '../../hooks/useDocuments';

export function FilePreview({ file, onClose }) {
  const [url, setUrl] = useState(null);
  const { getDownloadUrl } = useDocuments();

  useEffect(() => {
    const loadPreview = async () => {
      if (file.storage_path) {
        const downloadUrl = await getDownloadUrl(file.storage_path);
        setUrl(downloadUrl);
      }
    };

    loadPreview();
  }, [file]);

  const renderPreview = () => {
    if (!url) return <div>Loading preview...</div>;

    if (file.type?.startsWith('image/')) {
      return <img src={url} alt={file.name} className="max-w-full max-h-[80vh] object-contain" />;
    }

    if (file.type === 'application/pdf') {
      return <iframe src={url} className="w-full h-[80vh]" />;
    }

    return (
      <div className="text-center">
        <p className="mb-4">Preview not available for this file type</p>
        <a
          href={url}
          download={file.name}
          className="text-primary hover:text-primary-light"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-dark-card rounded-xl shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
              {file.name}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            {renderPreview()}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}