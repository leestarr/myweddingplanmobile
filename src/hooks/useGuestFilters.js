import { useState } from 'react';

export function useGuestFilters() {
  const [filters, setFilters] = useState({
    search: '',
    rsvpStatus: 'all',
    mealPreference: 'all',
    guestType: 'all',
    sortBy: 'name'
  });

  const filterGuests = (guests) => {
    return guests.filter(guest => {
      // Search filter
      if (filters.search && !guest.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // RSVP Status filter
      if (filters.rsvpStatus !== 'all' && guest.rsvpStatus !== filters.rsvpStatus) {
        return false;
      }

      // Meal Preference filter
      if (filters.mealPreference !== 'all' && guest.mealPreference !== filters.mealPreference) {
        return false;
      }

      // Guest Type filter
      if (filters.guestType !== 'all' && guest.type !== filters.guestType) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      switch (filters.sortBy) {
        case 'rsvpDate':
          return new Date(b.rsvpDate || 0) - new Date(a.rsvpDate || 0);
        case 'tableNumber':
          return (a.tableNumber || 0) - (b.tableNumber || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  };

  return {
    filters,
    setFilters,
    filterGuests
  };
}