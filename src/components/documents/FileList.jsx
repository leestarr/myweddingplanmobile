import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useDocuments } from '../../hooks/useDocuments';
import { FilePreview } from './FilePreview';
import { format } from 'date-fns';

export function FileList({ parentId = null }) {
  const { documents, loading, uploadFile, createFolder, deleteDocument, renameDocument } = useDocuments(parentId);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRenaming, setIsRenaming] = useState(null);
  const [newName, setNewName] = useState('');

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      await uploadFile(file, parentId);
    }
    e.target.value = '';
  };

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (name) {
      await createFolder(name, parentId);
    }
  };

  const handleRename = async (id) => {
    if (isRenaming === id) {
      await renameDocument(id, newName);
      setIsRenaming(null);
      setNewName('');
    } else {
      const doc = documents.find(d => d.id === id);
      setNewName(doc.name);
      setIsRenaming(id);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteDocument(id);
    }
  };

  if (loading) {
    return <div>Loading documents...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Files</h2>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleCreateFolder}>
                Create Folder
              </Button>
              <Button onClick={() => document.getElementById('file-upload').click()}>
                Upload Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-hover"
              >
                <div className="flex items-center gap-3">
                  {doc.is_folder ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                  {isRenaming === doc.id ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRename(doc.id)}
                      className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => !doc.is_folder && setSelectedFile(doc)}
                      className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary"
                    >
                      {doc.name}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(doc.created_at), 'MMM d, yyyy')}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => handleRename(doc.id)}
                  >
                    Rename
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </>
  );
}