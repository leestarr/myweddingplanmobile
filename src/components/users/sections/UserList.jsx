import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import toast from 'react-hot-toast';

export function UserList() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Alice Freeman',
      email: 'alice@example.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'Wedding Party Member',
      status: 'Pending',
      lastActive: null
    }
  ]);

  const handleRemoveUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User removed successfully');
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h2>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Last Active</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user.id}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center">
                        <span className="text-primary text-sm font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">{user.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary" onClick={() => {}}>Edit</Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}