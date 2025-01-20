import React from 'react';
import { Table } from './Table';
import { Button } from '../../../ui/Button';
import { useRealtimeSeating } from '../../../../hooks/useRealtimeSeating';

export function SeatingArrangement({ guests = [], isPreview = false }) {
  const {
    tables,
    loading,
    isOnline,
    assignGuest,
    refresh
  } = useRealtimeSeating();

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading seating arrangement...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full p-6">
      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {isOnline ? 'Connected' : 'Offline'}
        </span>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 gap-6">
        {tables.map((table) => (
          <Table
            key={table.id}
            table={table}
            onAssign={(guestId) => assignGuest(guestId, table.id)}
            onCheckConflicts={(guestId) => {
              const conflicts = [];
              if (table.guests.length >= table.capacity) {
                conflicts.push('Table is at full capacity');
              }
              return conflicts;
            }}
          />
        ))}
      </div>

      {/* Offline warning */}
      {!isOnline && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-red-800 dark:text-red-200">
            You're offline. Changes will sync when you're back online.
          </span>
        </div>
      )}
    </div>
  );
}