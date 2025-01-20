import React, { memo } from 'react';
import { GuestStatsProps } from '../types';

interface StatCardProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const StatCard = memo(({ label, value, total, color }: StatCardProps) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </h3>
        <span className="text-sm font-medium" style={{ color }}>
          {percentage}%
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </span>
        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
    </div>
  );
});

export const GuestStats = memo(({ stats }: GuestStatsProps) => {
  const cards: Array<StatCardProps> = [
    {
      label: 'Confirmed',
      value: stats.confirmed,
      total: stats.total,
      color: '#059669' // green-600
    },
    {
      label: 'Pending',
      value: stats.pending,
      total: stats.total,
      color: '#EAB308' // yellow-500
    },
    {
      label: 'Declined',
      value: stats.declined,
      total: stats.total,
      color: '#DC2626' // red-600
    }
  ];

  const mealStats = [
    {
      label: 'Vegetarian',
      value: stats.vegetarian,
      color: '#8B5CF6' // purple-500
    },
    {
      label: 'Vegan',
      value: stats.vegan,
      color: '#EC4899' // pink-500
    },
    {
      label: 'Plus Ones',
      value: stats.plusOnes,
      color: '#3B82F6' // blue-500
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Guest Statistics
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: {stats.total}
        </div>
      </div>
      
      {/* Main Stats */}
      <div className="grid gap-4 mb-4">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            total={stats.total}
            color={card.color}
          />
        ))}
      </div>

      {/* Meal Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {mealStats.map(({ label, value, color }) => (
          <div 
            key={label}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center"
          >
            <div 
              className="text-xl font-semibold mb-1"
              style={{ color }}
            >
              {value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

GuestStats.displayName = 'GuestStats';
StatCard.displayName = 'StatCard';