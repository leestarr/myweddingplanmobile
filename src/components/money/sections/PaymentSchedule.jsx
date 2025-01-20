import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';

export function PaymentSchedule() {
  const payments = [
    { 
      id: 1, 
      vendor: 'Wedding Venue', 
      dueDate: '2024-02-15', 
      amount: 10000,
      status: 'pending'
    },
    { 
      id: 2, 
      vendor: 'Catering Service', 
      dueDate: '2024-03-01', 
      amount: 5000,
      status: 'pending'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Schedule</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div 
              key={payment.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-dark-hover"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{payment.vendor}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due: {payment.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  ${payment.amount.toLocaleString()}
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}