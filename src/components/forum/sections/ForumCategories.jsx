import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';

export function ForumCategories() {
  const categories = [
    { name: 'Planning', count: 156, icon: '📋' },
    { name: 'Venues', count: 89, icon: '🏰' },
    { name: 'Attire', count: 124, icon: '👗' },
    { name: 'DIY & Crafts', count: 78, icon: '🎨' },
    { name: 'Budget', count: 92, icon: '💰' },
    { name: 'Honeymoon', count: 67, icon: '✈️' }
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
              <div className="flex items-center gap-3">
                <span className="text-xl">{category.icon}</span>
                <span className="text-sm text-gray-900 dark:text-white">{category.name}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}