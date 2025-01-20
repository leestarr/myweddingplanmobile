import React from 'react';
import { Card, CardContent } from '../../ui/Card';
import { Guest } from '../../../types/guest';

interface SeatingChartProps {
  guests: Guest[];
}

interface TableStats {
  assigned: number;
  unassigned: number;
  tables: Record<number, Guest[]>;
  maxTableNumber: number;
}

export const SeatingChart: React.FC<SeatingChartProps> = ({ guests }) => {
  const stats = guests.reduce<TableStats>(
    (acc, guest) => {
      if (guest.table_number) {
        if (!acc.tables[guest.table_number]) {
          acc.tables[guest.table_number] = [];
        }
        acc.tables[guest.table_number].push(guest);
        acc.assigned++;
        acc.maxTableNumber = Math.max(acc.maxTableNumber, guest.table_number);
      } else {
        acc.unassigned++;
      }
      return acc;
    },
    { assigned: 0, unassigned: 0, tables: {}, maxTableNumber: 0 }
  );

  const percentage = guests.length > 0 
    ? Math.round((stats.assigned / guests.length) * 100)
    : 0;

  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Seating Progress
        </h3>
        
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {stats.assigned} of {guests.length} seated
            </span>
            <span className="font-medium text-primary">
              {percentage}%
            </span>
          </div>

          {/* Table Summary */}
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Table Summary:
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto">
              {Object.entries(stats.tables)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([table, guests]) => (
                  <div 
                    key={table}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      Table {table}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {guests.length} guests
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Unassigned Count */}
          {stats.unassigned > 0 && (
            <div className="text-sm text-amber-600 dark:text-amber-500">
              {stats.unassigned} guests need seating
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

SeatingChart.displayName = 'SeatingChart';