import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function FileList() {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'Guest List Template.xlsx',
      type: 'excel',
      size: '245 KB',
      modified: '2024-01-20T10:30:00Z',
      shared: true
    },
    {
      id: 2,
      name: 'Wedding Timeline.pdf',
      type: 'pdf',
      size: '1.2 MB',
      modified: '2024-01-19T15:45:00Z',
      shared: false
    },
    {
      id: 3,
      name: 'Venue Contract.docx',
      type: 'word',
      size: '380 KB',
      modified: '2024-01-18T09:15:00Z',
      shared: true
    },
    {
      id: 4,
      name: 'Decoration Ideas.jpg',
      type: 'image',
      size: '2.8 MB',
      modified: '2024-01-17T14:20:00Z',
      shared: false
    }
  ]);

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256" className="text-red-500">
            <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208H208V152a8,8,0,0,1,16,0ZM93.66,122.34a8,8,0,0,0,11.31,11.32L112,126.63V184a8,8,0,0,0,16,0V126.63l7,7a8,8,0,0,0,11.32-11.32l-20.67-20.67a8,8,0,0,0-11.31,0ZM208,92a36,36,0,1,0-36-36A36,36,0,0,0,208,92Zm0-56a20,20,0,1,1-20,20A20,20,0,0,1,208,36Z"/>
          </svg>
        );
      case 'excel':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256" className="text-green-500">
            <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208H208V152a8,8,0,0,1,16,0ZM93.66,122.34a8,8,0,0,0,11.31,11.32L112,126.63V184a8,8,0,0,0,16,0V126.63l7,7a8,8,0,0,0,11.32-11.32l-20.67-20.67a8,8,0,0,0-11.31,0ZM208,92a36,36,0,1,0-36-36A36,36,0,0,0,208,92Zm0-56a20,20,0,1,1-20,20A20,20,0,0,1,208,36Z"/>
          </svg>
        );
      case 'word':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256" className="text-blue-500">
            <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208H208V152a8,8,0,0,1,16,0ZM93.66,122.34a8,8,0,0,0,11.31,11.32L112,126.63V184a8,8,0,0,0,16,0V126.63l7,7a8,8,0,0,0,11.32-11.32l-20.67-20.67a8,8,0,0,0-11.31,0ZM208,92a36,36,0,1,0-36-36A36,36,0,0,0,208,92Zm0-56a20,20,0,1,1-20,20A20,20,0,0,1,208,36Z"/>
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256" className="text-purple-500">
            <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM144,88a16,16,0,1,1-16,16A16,16,0,0,1,144,88Z"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256" className="text-gray-400">
            <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"/>
          </svg>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Files</h2>
          <div className="flex gap-2">
            <Button variant="secondary">Create Folder</Button>
            <Button>Upload Files</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-hover"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {file.size} • Modified {new Date(file.modified).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {file.shared && (
                  <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
                    Shared
                  </span>
                )}
                <Button variant="secondary">Download</Button>
                <Button variant="secondary">Share</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}