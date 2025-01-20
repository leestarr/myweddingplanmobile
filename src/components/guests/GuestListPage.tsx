import React, { useState, useMemo, useCallback } from 'react';
import { GuestList } from './sections/GuestList';
import { GuestStats } from './sections/GuestStats';
import { GuestFilters } from './sections/GuestFilters';
import { RSVPTracker } from './sections/RSVPTracker';
import { SeatingChart } from './sections/SeatingChart';
import { useGuests } from '../../hooks/useGuests';
import { Guest, GuestFilters as IGuestFilters } from '../../types/guest';
import { Button } from '../ui/Button';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export function GuestListPage() {
  const { guests, loading, addGuest, updateGuest, deleteGuest } = useGuests();
  const [filters, setFilters] = useState<IGuestFilters>({
    search: '',
    rsvpStatus: 'all',
    mealPreference: 'all',
    guestType: 'all',
    sortBy: 'name'
  });
  const [showStats, setShowStats] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // Memoize the filter function
  const filterGuests = useCallback((guests: Guest[]) => {
    if (!guests?.length) return [];
    
    return guests.filter(guest => {
      const searchMatch = !filters.search || 
        guest.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        guest.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        guest.notes?.toLowerCase().includes(filters.search.toLowerCase());
      
      if (!searchMatch) return false;

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
    });
  }, [filters.search, filters.rsvpStatus, filters.mealPreference, filters.guestType]);

  // Memoize the sort function
  const sortGuests = useCallback((guests: Guest[]) => {
    return [...guests].sort((a, b) => {
      switch (filters.sortBy) {
        case 'rsvpDate':
          return new Date(b.rsvp_date || 0).getTime() - new Date(a.rsvp_date || 0).getTime();
        case 'tableNumber':
          return (a.table_number || Infinity) - (b.table_number || Infinity);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [filters.sortBy]);

  // Memoize the filtered and sorted guests
  const filteredGuests = useMemo(() => {
    const filtered = filterGuests(guests);
    return sortGuests(filtered);
  }, [guests, filterGuests, sortGuests]);

  // Memoize guest statistics
  const guestStats = useMemo(() => ({
    total: guests.length,
    confirmed: guests.filter(g => g.status === 'confirmed').length,
    declined: guests.filter(g => g.status === 'declined').length,
    pending: guests.filter(g => g.status === 'pending').length,
    vegetarian: guests.filter(g => g.meal_preference === 'vegetarian').length,
    vegan: guests.filter(g => g.meal_preference === 'vegan').length,
    plusOnes: guests.filter(g => g.plus_one).length
  }), [guests]);

  return (
    <main className="flex-1 min-w-0 overflow-auto p-4">
      <div className="max-w-[1440px] mx-auto animate-fade-in space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Guest List
          </h1>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              Filters
              {showFilters ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2"
            >
              Stats
              {showStats ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Filters */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <GuestFilters 
            filters={filters} 
            onChange={setFilters}
            guestStats={guestStats}
          />
        </div>

        {/* Mobile Stats */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            showStats ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-4">
            <GuestStats guests={guests} stats={guestStats} />
            <div className="flex gap-4 overflow-x-auto pb-2">
              <div className="flex-shrink-0 w-[280px]">
                <RSVPTracker guests={guests} />
              </div>
              <div className="flex-shrink-0 w-[280px]">
                <SeatingChart guests={filteredGuests} />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <GuestList 
              guests={filteredGuests}
              loading={loading}
              onEdit={updateGuest}
              onDelete={deleteGuest}
              onAdd={addGuest}
            />
          </div>
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block space-y-4">
            <GuestStats guests={guests} stats={guestStats} />
            <RSVPTracker guests={guests} />
            <SeatingChart guests={filteredGuests} />
          </div>
        </div>
      </div>
    </main>
  );
}