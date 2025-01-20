import React from 'react';
import { House, UsersThree, ChatDots, Megaphone, ChartPie, MessageSquare, ShoppingBag } from './Icons';
import clsx from 'clsx';

const menuItems = [
  { id: 'dashboard', icon: House, text: 'Home' },
  { id: 'money', icon: ChartPie, text: 'Money Management' },
  { id: 'guests', icon: UsersThree, text: 'Guest List' },
  { id: 'documents', icon: ChatDots, text: 'Documents' },
  { id: 'tasks', icon: ChatDots, text: 'Tasks' },
  { id: 'vendors', icon: Megaphone, text: 'Vendors' },
  { id: 'forum', icon: MessageSquare, text: 'Forum' },
  { id: 'store', icon: ShoppingBag, text: 'Store' },
  { id: 'users', icon: UsersThree, text: 'User Management' }
];

export function Sidebar({ isOpen, onClose, currentPage, onMenuItemClick }) {
  return (
    <aside className={clsx(
      'fixed inset-y-0 left-0 z-40 w-80 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-gray-800 lg:static transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    )}>
      <div className="flex h-full flex-col">
        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onMenuItemClick(item.id)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200',
                currentPage === item.id
                  ? 'bg-primary bg-opacity-15 text-primary dark:bg-opacity-20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
              )}
            >
              <item.icon />
              <span className="text-sm font-medium">{item.text}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}