import React from 'react';
import { Card, CardContent } from '../../ui/Card';
import { Guest } from '../../../types/guest';

interface RSVPTrackerProps {
  guests: Guest[];
}

export const RSVPTracker: React.FC<RSVPTrackerProps> = ({ guests }) => {
  const total = guests.length;
  const responded = guests.filter(g => g.status !== 'pending').length;
  const percentage = total > 0 ? Math.round((responded / total) * 100) : 0;

  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          RSVP Progress
        </h3>
        <div className="space-y-4">
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {responded} of {total} responded
            </span>
            <span className="font-medium text-primary">
              {percentage}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

RSVPTracker.displayName = 'RSVPTracker';