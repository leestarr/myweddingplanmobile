import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function VendorDocuments() {
  const documents = [
    {
      id: 1,
      name: 'Venue Contract.pdf',
      vendor: 'Elegant Events',
      date: '2024-01-15',
      type: 'contract'
    },
    {
      id: 2,
      name: 'Catering Quote.pdf',
      vendor: 'Divine Catering',
      date: '2024-01-20',
      type: 'quote'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Documents</h2>
          <Button variant="secondary">Upload</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-dark-hover">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {doc.vendor} • {doc.date}
                </p>
              </div>
              <button className="text-primary hover:text-primary-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0ZM77.66,141.66a8,8,0,0,0,11.31-.07L120,110.06V184a8,8,0,0,0,16,0V110.06l31,31.53a8,8,0,0,0,11.38-11.18l-44.69-45.4a8,8,0,0,0-11.38,0L77.73,130.4A8,8,0,0,0,77.66,141.66Z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}