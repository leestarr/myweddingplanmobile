import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function TaskCollaborators() {
  const collaborators = [
    { 
      name: 'Alice Freeman',
      role: 'Bride',
      avatar: 'https://cdn.usegalileo.ai/stability/117a7a12-7704-4917-9139-4a3f76c42e78.png',
      tasks: 5
    },
    {
      name: 'Sarah Johnson',
      role: 'Maid of Honor',
      avatar: 'https://cdn.usegalileo.ai/stability/d4e7d763-28f3-4af2-bc57-a26db12c522b.png',
      tasks: 3
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Collaborators</h2>
          <Button variant="secondary">Invite</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {collaborators.map((person) => (
            <div
              key={person.name}
              className="flex items-center gap-3"
            >
              <img
                src={person.avatar}
                alt={person.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{person.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{person.role}</p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {person.tasks} tasks
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}