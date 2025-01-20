import React from 'react';
import { Card } from '../../ui/Card';

export function GuestFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Search guests..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      
      <select
        value={filters.rsvpStatus}
        onChange={(e) => onChange({ ...filters, rsvpStatus: e.target.value })}
        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="all">All RSVP Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="declined">Declined</option>
      </select>

      <select
        value={filters.mealPreference}
        onChange={(e) => onChange({ ...filters, mealPreference: e.target.value })}
        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="all">All Meal Preferences</option>
        <option value="standard">Standard</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="gluten-free">Gluten Free</option>
      </select>

      <select
        value={filters.guestType}
        onChange={(e) => onChange({ ...filters, guestType: e.target.value })}
        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="all">All Guest Types</option>
        <option value="family">Family</option>
        <option value="friend">Friend</option>
        <option value="colleague">Colleague</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="name">Sort by Name</option>
        <option value="rsvpDate">Sort by RSVP Date</option>
        <option value="tableNumber">Sort by Table Number</option>
      </select>
    </div>
  );
}