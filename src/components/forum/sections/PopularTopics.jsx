import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';

export function PopularTopics() {
  const popularTopics = [
    {
      title: 'Best Wedding Planning Tips',
      replies: 45,
      views: 1200
    },
    {
      title: 'Wedding Budget Advice',
      replies: 32,
      views: 890
    },
    {
      title: 'Honeymoon Destinations',
      replies: 28,
      views: 750
    }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Topics</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularTopics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover"
            >
              <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-primary font-medium">
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {topic.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {topic.replies} replies • {topic.views} views
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}