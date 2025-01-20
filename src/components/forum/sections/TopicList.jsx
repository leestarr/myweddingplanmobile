import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function TopicList() {
  const [topics, setTopics] = useState([
    {
      id: 1,
      title: 'Wedding Venue Ideas',
      author: 'Alice Freeman',
      category: 'Venues',
      replies: 15,
      views: 234,
      lastReply: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      title: 'DIY Wedding Decorations',
      author: 'Sarah Johnson',
      category: 'DIY & Crafts',
      replies: 28,
      views: 456,
      lastReply: '2024-01-19T15:45:00Z'
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Discussions</h2>
          <Button>New Topic</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-hover"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white hover:text-primary">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Started by {topic.author}
                  </p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {topic.category}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{topic.replies} replies</span>
                <span>{topic.views} views</span>
                <span>Last reply {new Date(topic.lastReply).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}