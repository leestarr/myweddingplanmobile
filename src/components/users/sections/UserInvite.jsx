import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import toast from 'react-hot-toast';

export function UserInvite() {
  const [formData, setFormData] = useState({
    email: '',
    role: 'guest',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter an email address');
      return;
    }
    
    // Here you would typically send the invitation
    toast.success('Invitation sent successfully');
    setFormData({ email: '', role: 'guest', message: '' });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Invite User</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="admin">Admin</option>
              <option value="wedding-party">Wedding Party Member</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Personal Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={3}
              placeholder="Add a personal message to the invitation"
            />
          </div>

          <Button type="submit" className="w-full">
            Send Invitation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}