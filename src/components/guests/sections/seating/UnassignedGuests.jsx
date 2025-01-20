import React from 'react';
import { DraggableGuest } from './DraggableGuest';
import { useSeatingArrangement } from '../../../../hooks/useSeatingArrangement';

export function UnassignedGuests({ guests = [] }) {
  const { tables } = useSeatingArrangement();
  
  // Get all assigned guest IDs from tables
  const assignedGuestIds = new Set(
    tables.flatMap(table => 
      (table.guests || [])
        .filter(Boolean)
        .map(g => g.id)
    )
  );

  // Filter out guests that are assigned to any table
  const unassignedGuests = guests.filter(guest => 
    guest && !assignedGuestIds.has(guest.id)
  );

  if (!unassignedGuests.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        All guests have been assigned to tables
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[calc(90vh-10rem)]">
      {unassignedGuests.map((guest, index) => (
        guest && (
          <DraggableGuest 
            key={`unassigned-${guest.id}-${index}`} 
            guest={guest} 
          />
        )
      ))}
    </div>
  );
}