import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';

export function FileStats() {
  const stats = [
    { label: 'Total Files', value: '24' },
    { label: 'Storage Used', value: '1.2 GB' },
    { label: 'Shared Files', value: '8' }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Storage Overview</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
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