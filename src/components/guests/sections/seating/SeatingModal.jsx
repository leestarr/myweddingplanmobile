import React from 'react';
import { Dialog } from '@headlessui/react';
import { Card } from '../../../ui/Card';
import { SeatingArrangement } from './SeatingArrangement';
import { UnassignedGuests } from './UnassignedGuests';

export function SeatingModal({ isOpen, onClose, guests }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-6xl h-[90vh]">
          <Card>
            <div className="flex h-full">
              {/* Main seating area */}
              <div className="flex-1 p-6 border-r border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                    Seating Arrangement
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="h-[calc(100%-4rem)] bg-gray-50 dark:bg-dark-hover rounded-lg overflow-auto">
                  <SeatingArrangement guests={guests} />
                </div>
              </div>

              {/* Sidebar with unassigned guests */}
              <div className="w-80 p-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Unassigned Guests
                </h3>
                <UnassignedGuests guests={guests} />
              </div>
            </div>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}