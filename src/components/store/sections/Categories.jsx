import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';

export function Categories() {
  const categories = [
    { name: 'Decor', count: 45 },
    { name: 'Stationery', count: 32 },
    { name: 'Favors', count: 28 },
    { name: 'Accessories', count: 24 },
    { name: 'Gifts', count: 19 }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.name}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover"
            >
              <span className="text-sm text-gray-900 dark:text-white">{category.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}