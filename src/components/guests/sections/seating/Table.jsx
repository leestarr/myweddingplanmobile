import React from 'react';
import { useDrop } from 'react-dnd';
import { DraggableGuest } from './DraggableGuest';

export function Table({ table, onRemove, onAssign, onUnassign, onCheckConflicts }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'GUEST',
    drop: (item) => onAssign(item.id),
    canDrop: (item) => {
      const conflicts = onCheckConflicts?.(item.id) || [];
      return conflicts.length === 0 && table?.guests?.length < (table?.capacity || 8);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  if (!table || !table.guests) return null;

  const availableSeats = (table.capacity || 8) - table.guests.length;

  return (
    <div
      ref={drop}
      className={`relative p-6 rounded-xl border-2 ${
        isOver && canDrop
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : isOver && !canDrop
          ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
      }`}
    >
      {/* Table Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Table {table.number}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex -space-x-2">
              {table.guests.slice(0, 3).map((guest, index) => (
                guest && (
                  <div
                    key={`${table.id}-avatar-${guest.id}-${index}`}
                    className="w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center ring-2 ring-white dark:ring-gray-800"
                  >
                    <span className="text-xs font-medium text-primary">
                      {guest.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )
              ))}
              {table.guests.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    +{table.guests.length - 3}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {availableSeats} {availableSeats === 1 ? 'seat' : 'seats'} available
            </span>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Guest List */}
      <div className="space-y-2">
        {table.guests.map((guest, index) => (
          guest && (
            <DraggableGuest
              key={`${table.id}-guest-${guest.id}-${index}`}
              guest={guest}
              onRemove={onUnassign ? () => onUnassign(guest.id) : undefined}
            />
          )
        ))}
      </div>

      {/* Drop Zone Indicator */}
      {isOver && (
        <div className={`absolute inset-0 rounded-xl border-2 border-dashed pointer-events-none ${
          canDrop ? 'border-primary' : 'border-red-500'
        }`} />
      )}
    </div>
  );
}