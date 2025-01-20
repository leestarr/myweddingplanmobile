import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';

export function RecentActivity() {
  const activities = [
    {
      user: 'Alice Freeman',
      action: 'replied to',
      topic: 'Wedding Venue Ideas',
      time: '5 minutes ago'
    },
    {
      user: 'Bob Smith',
      action: 'created topic',
      topic: 'Wedding Photography Tips',
      time: '1 hour ago'
    },
    {
      user: 'Sarah Johnson',
      action: 'liked',
      topic: 'DIY Wedding Decorations',
      time: '2 hours ago'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3"
            >
              <div className="relative mt-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {index !== activities.length - 1 && (
                  <div className="absolute top-2 left-1 w-[1px] h-full -ml-px bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span className="text-primary">{activity.topic}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}