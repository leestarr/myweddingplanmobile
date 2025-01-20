import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';

export function RSVPTracker() {
  const recentRSVPs = [
    { name: 'John Smith', response: 'confirmed', date: '2024-01-20' },
    { name: 'Jane Doe', response: 'declined', date: '2024-01-19' }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent RSVPs</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRSVPs.map((rsvp, index) => (
            <div 
              key={index}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{rsvp.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{rsvp.date}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                rsvp.response === 'confirmed' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {rsvp.response}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}