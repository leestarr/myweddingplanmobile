import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { format, isToday, isPast } from 'date-fns';

export function TaskTimeline() {
  // Group tasks by month
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'in-progress':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  const timeline = [
    {
      month: 'February 2024',
      tasks: [
        { 
          title: 'Book Venue', 
          date: '2024-02-15', 
          status: 'completed',
          category: 'Venue',
          categoryColor: '#ef4444'
        },
        { 
          title: 'Hire Photographer', 
          date: '2024-02-20', 
          status: 'pending',
          category: 'Vendors',
          categoryColor: '#8b5cf6'
        }
      ]
    },
    {
      month: 'March 2024',
      tasks: [
        { 
          title: 'Choose Wedding Dress', 
          date: '2024-03-01', 
          status: 'in-progress',
          category: 'Attire',
          categoryColor: '#f59e0b'
        },
        { 
          title: 'Order Invitations', 
          date: '2024-03-15', 
          status: 'pending',
          category: 'Stationery',
          categoryColor: '#10b981'
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Timeline</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {timeline.map((period) => (
            <div key={period.month} className="relative">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-dark-card py-2">
                {period.month}
              </h3>
              
              <div className="mt-4 space-y-6">
                {period.tasks.map((task, index) => {
                  const taskDate = new Date(task.date);
                  const isOverdue = isPast(taskDate) && task.status === 'pending';
                  
                  return (
                    <div key={index} className="relative">
                      {/* Timeline line */}
                      {index !== period.tasks.length - 1 && (
                        <div className="absolute left-4 top-10 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                      )}
                      
                      <div className="flex gap-4">
                        {/* Date circle */}
                        <div className="relative z-10">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-medium
                            ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                              isToday(taskDate) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
                          `}>
                            {format(taskDate, 'd')}
                          </div>
                        </div>
                        
                        {/* Task details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </h4>
                            <span className={getStatusBadge(task.status)}>
                              {task.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: task.categoryColor }}
                              />
                              <span className="text-gray-500 dark:text-gray-400">
                                {task.category}
                              </span>
                            </div>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {format(taskDate, 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}