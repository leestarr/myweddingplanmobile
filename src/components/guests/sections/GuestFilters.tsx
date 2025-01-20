import React, { memo } from 'react';
import { GuestFiltersProps, GuestFiltersDropdownProps, GuestSearchProps, GuestSortProps } from '../types';
import { GuestFilters as IGuestFilters } from '../../../types/guest';

const SearchInput = memo(({ value, onChange, placeholder = 'Search guests...' }: GuestSearchProps) => (
  <div className="w-full">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-white dark:bg-dark-card focus:ring-2 focus:ring-primary/20 
                focus:border-primary dark:focus:border-primary"
    />
  </div>
));

const FilterDropdown = memo(({ value, onChange, options, label }: GuestFiltersDropdownProps) => (
  <div className="w-full sm:flex-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-white dark:bg-dark-card focus:ring-2 focus:ring-primary/20 
                focus:border-primary dark:focus:border-primary"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label} {option.count !== undefined && `(${option.count})`}
        </option>
      ))}
    </select>
  </div>
));

const SortDropdown = memo(({ value, onChange }: GuestSortProps) => (
  <div className="w-full sm:flex-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Sort By
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as IGuestFilters['sortBy'])}
      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-white dark:bg-dark-card focus:ring-2 focus:ring-primary/20 
                focus:border-primary dark:focus:border-primary"
    >
      <option value="name">Name</option>
      <option value="rsvpDate">RSVP Date</option>
      <option value="tableNumber">Table Number</option>
    </select>
  </div>
));

export const GuestFilters = memo(({ filters, onChange, guestStats }: GuestFiltersProps) => {
  const handleFilterChange = (key: keyof IGuestFilters) => (value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const rsvpOptions = [
    { value: 'all', label: 'All Statuses', count: guestStats.total },
    { value: 'confirmed', label: 'Confirmed', count: guestStats.confirmed },
    { value: 'declined', label: 'Declined', count: guestStats.declined },
    { value: 'pending', label: 'Pending', count: guestStats.pending }
  ];

  const mealOptions = [
    { value: 'all', label: 'All Meals' },
    { value: 'standard', label: 'Standard' },
    { value: 'vegetarian', label: 'Vegetarian', count: guestStats.vegetarian },
    { value: 'vegan', label: 'Vegan', count: guestStats.vegan },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'family', label: 'Family' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' }
  ];

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-4 space-y-4">
      {/* Search */}
      <SearchInput
        value={filters.search}
        onChange={handleFilterChange('search')}
      />

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterDropdown
          value={filters.rsvpStatus}
          onChange={handleFilterChange('rsvpStatus')}
          options={rsvpOptions}
          label="RSVP Status"
        />
        <FilterDropdown
          value={filters.mealPreference}
          onChange={handleFilterChange('mealPreference')}
          options={mealOptions}
          label="Meal Preference"
        />
        <FilterDropdown
          value={filters.guestType}
          onChange={handleFilterChange('guestType')}
          options={typeOptions}
          label="Guest Type"
        />
        <SortDropdown
          value={filters.sortBy}
          onChange={handleFilterChange('sortBy')}
        />
      </div>
    </div>
  );
});

GuestFilters.displayName = 'GuestFilters';
SearchInput.displayName = 'SearchInput';
FilterDropdown.displayName = 'FilterDropdown';
SortDropdown.displayName = 'SortDropdown';