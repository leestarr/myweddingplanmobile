import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function FileUpload() {
  const handleDrop = (e) => {
    e.preventDefault();
    // Handle file drop
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Files</h2>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 256 256" className="mx-auto text-gray-400 mb-4">
            <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208H208V152a8,8,0,0,1,16,0ZM93.66,122.34a8,8,0,0,0,11.31,11.32L112,126.63V184a8,8,0,0,0,16,0V126.63l7,7a8,8,0,0,0,11.32-11.32l-20.67-20.67a8,8,0,0,0-11.31,0ZM208,92a36,36,0,1,0-36-36A36,36,0,0,0,208,92Zm0-56a20,20,0,1,1-20,20A20,20,0,0,1,208,36Z"/>
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Drag and drop files here, or
          </p>
          <Button variant="secondary">Browse Files</Button>
          <input type="file" className="hidden" multiple />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Supported formats: PDF, Word, Excel, JPG, PNG
          </p>
        </div>
      </CardContent>
    </Card>
  );
}