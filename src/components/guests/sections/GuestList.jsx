import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { AddGuestModal } from './AddGuestModal';

export function GuestList({ guests = [], loading = false, onAdd, onEdit, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      if (selectedGuest) {
        await onEdit(selectedGuest.id, formData);
      } else {
        await onAdd(formData);
      }
      setIsModalOpen(false);
      setSelectedGuest(null);
    } catch (error) {
      console.error('Error handling guest:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Error deleting guest:', error);
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Guest List</h2>
            <Button disabled>Add Guest</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 dark:text-gray-400">Loading guests...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Guest List</h2>
            <Button onClick={() => setIsModalOpen(true)}>Add Guest</Button>
          </div>
        </CardHeader>
        <CardContent>
          {!guests.length ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No guests added yet
              </p>
              <Button onClick={() => setIsModalOpen(true)}>Add Your First Guest</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Guest</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">RSVP Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Meal</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => (
                    <tr 
                      key={guest.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-hover"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center">
                            <span className="text-primary text-sm font-medium">
                              {guest.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{guest.name}</p>
                            {guest.plus_one && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">+1</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {guest.email || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          guest.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : guest.status === 'declined'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {guest.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {guest.meal_preference || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setSelectedGuest(guest);
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleDelete(guest.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddGuestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGuest(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedGuest}
      />
    </>
  );
}