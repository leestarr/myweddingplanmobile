import React from 'react';
import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import { House, UsersThree, ChatDots, Megaphone, ChartPie, MessageSquare, ShoppingBag } from '../Icons';

export function MobileMenu({ isOpen, onClose, currentPage, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: House },
    { id: 'money', label: 'Money Management', icon: ChartPie },
    { id: 'guests', label: 'Guest List', icon: UsersThree },
    { id: 'documents', label: 'Documents', icon: ChatDots },
    { id: 'tasks', label: 'Tasks', icon: ChatDots },
    { id: 'vendors', label: 'Vendors', icon: Megaphone },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'store', label: 'Store', icon: ShoppingBag },
    { id: 'users', label: 'User Management', icon: UsersThree }
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50 lg:hidden"
    >
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true" />
      
      <div className="fixed inset-y-0 left-0 w-full max-w-xs">
        <Dialog.Panel className="h-full bg-white dark:bg-dark-card shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xl font-bold text-primary">Myweddingplan.ai</span>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={clsx(
                  'flex w-full items-center gap-3 px-3 py-2 rounded-xl mb-1 transition-colors',
                  currentPage === item.id
                    ? 'bg-primary bg-opacity-15 text-primary dark:bg-opacity-20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
                )}
              >
                <item.icon />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}