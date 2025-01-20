import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function ReceiptManager() {
  const receipts = [
    { 
      id: 1, 
      vendor: 'Wedding Venue', 
      date: '2024-01-15', 
      amount: 5000,
      fileName: 'venue-deposit.pdf'
    },
    { 
      id: 2, 
      vendor: 'Catering Service', 
      date: '2024-01-20', 
      amount: 2500,
      fileName: 'catering-deposit.pdf'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Receipt Manager</h2>
          <Button>Upload Receipt</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {receipts.map((receipt) => (
            <div 
              key={receipt.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-dark-hover">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM32,64H224V96H32Zm0,128V112H224v80Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{receipt.vendor}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{receipt.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  ${receipt.amount.toLocaleString()}
                </p>
                <button className="text-sm text-primary hover:text-primary-light">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}