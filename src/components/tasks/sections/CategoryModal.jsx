import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import toast from 'react-hot-toast';

export function CategoryModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '' });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Please enter a category name');
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Category
                </Dialog.Title>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add Category
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}