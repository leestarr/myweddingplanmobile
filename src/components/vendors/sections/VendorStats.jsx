import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';

export function VendorStats() {
  const stats = [
    { label: 'Total Vendors', value: '8' },
    { label: 'Confirmed', value: '5' },
    { label: 'Pending', value: '3' },
    { label: 'Total Budget', value: '$25,000' }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vendor Statistics</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}