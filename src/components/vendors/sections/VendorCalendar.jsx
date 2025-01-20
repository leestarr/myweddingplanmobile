import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';

export function VendorCalendar() {
  const appointments = [
    {
      id: 1,
      vendor: 'Elegant Events',
      type: 'Venue Tour',
      date: '2024-02-15',
      time: '14:00',
      status: 'upcoming'
    },
    {
      id: 2,
      vendor: 'Divine Catering',
      type: 'Tasting',
      date: '2024-02-20',
      time: '15:30',
      status: 'upcoming'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-dark-hover"
            >
              <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center">
                <span className="text-primary text-lg font-medium">
                  {appointment.date.split('-')[2]}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{appointment.vendor}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.type}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {appointment.date} at {appointment.time}
                </p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}