import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';

export function UserPermissions() {
  const roles = [
    {
      name: 'Admin',
      description: 'Full access to all features',
      permissions: [
        'Manage users',
        'Manage content',
        'View analytics',
        'Edit settings'
      ]
    },
    {
      name: 'Wedding Party Member',
      description: 'Access to planning features',
      permissions: [
        'View content',
        'Add comments',
        'Upload photos',
        'RSVP management'
      ]
    },
    {
      name: 'Guest',
      description: 'Basic access',
      permissions: [
        'View content',
        'RSVP',
        'Add comments'
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Role Permissions</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {roles.map((role) => (
            <div 
              key={role.name}
              className="p-4 rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <h3 className="text-base font-medium text-gray-900 dark:text-white">{role.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.description}</p>
              
              <div className="mt-4 space-y-2">
                {role.permissions.map((permission) => (
                  <div 
                    key={permission}
                    className="flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="text-primary">
                      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}