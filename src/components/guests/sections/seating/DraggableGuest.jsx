import React from 'react';
import { useDrag } from 'react-dnd';

export function DraggableGuest({ guest, onRemove }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'GUEST',
    item: { id: guest.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      } hover:border-primary/50 cursor-move`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">
            {guest.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {guest.name}
          </p>
          {guest.plus_one && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +1 Guest
            </span>
          )}
        </div>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}