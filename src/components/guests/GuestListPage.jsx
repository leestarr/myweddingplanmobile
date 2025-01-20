import React, { useState } from 'react';
import { GuestList } from './sections/GuestList';
import { GuestStats } from './sections/GuestStats';
import { GuestFilters } from './sections/GuestFilters';
import { RSVPTracker } from './sections/RSVPTracker';
import { SeatingChart } from './sections/SeatingChart';
import { useGuests } from '../../hooks/useGuests';

export function GuestListPage() {
  const { guests, loading, addGuest, updateGuest, deleteGuest } = useGuests();
  const [filters, setFilters] = useState({
    search: '',
    rsvpStatus: 'all',
    mealPreference: 'all',
    guestType: 'all',
    sortBy: 'name'
  });

  const filterGuests = (guests) => {
    if (!guests) return [];
    
    return guests.filter(guest => {
      if (filters.search && !guest.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.rsvpStatus !== 'all' && guest.status !== filters.rsvpStatus) {
        return false;
      }
      if (filters.mealPreference !== 'all' && guest.meal_preference !== filters.mealPreference) {
        return false;
      }
      if (filters.guestType !== 'all' && guest.type !== filters.guestType) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'rsvpDate':
          return new Date(b.rsvpDate || 0) - new Date(a.rsvpDate || 0);
        case 'tableNumber':
          return (a.table_number || 0) - (b.table_number || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  };

  const filteredGuests = filterGuests(guests);

  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Guest List</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          <div className="lg:col-span-2">
            <GuestFilters filters={filters} onChange={setFilters} />
            <GuestList 
              guests={filteredGuests}
              loading={loading}
              onEdit={updateGuest}
              onDelete={deleteGuest}
              onAdd={addGuest}
            />
          </div>
          <div className="space-y-4">
            <GuestStats guests={guests} />
            <RSVPTracker guests={guests} />
            <SeatingChart guests={guests} />
          </div>
        </div>
      </div>
    </main>
  );
}