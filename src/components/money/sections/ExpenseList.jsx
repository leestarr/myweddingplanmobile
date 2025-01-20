import React from 'react';
import { format } from 'date-fns';

export function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Description</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Vendor</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
            <th className="w-20 text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr 
              key={expense.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-hover"
            >
              <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                {expense.name}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                {format(new Date(expense.date), 'MMM d, yyyy')}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                {expense.description}
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {expense.category?.name}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                {expense.vendor || '-'}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 dark:text-white text-right">
                ${expense.amount.toLocaleString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1 text-gray-500 hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}