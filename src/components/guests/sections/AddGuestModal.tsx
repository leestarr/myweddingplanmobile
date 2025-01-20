import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { AddGuestModalProps } from '../types';
import { Button } from '../../ui/Button';
import { GuestFormData, GuestStatus, MealPreference, GuestType } from '../../../types/guest';

const INITIAL_FORM_DATA: GuestFormData = {
  name: '',
  email: '',
  phone: '',
  status: 'pending',
  meal_preference: 'standard',
  type: 'friend',
  plus_one: false,
  dietary_restrictions: '',
  notes: ''
};

export const AddGuestModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: AddGuestModalProps) => {
  const [formData, setFormData] = useState<GuestFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      // Error handling done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <div className="relative bg-white dark:bg-dark-card rounded-xl max-w-md w-full mx-4 p-6">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {initialData ? 'Edit Guest' : 'Add New Guest'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-dark-hover focus:ring-2 focus:ring-primary/20 
                         focus:border-primary dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-dark-hover focus:ring-2 focus:ring-primary/20 
                         focus:border-primary dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-dark-hover focus:ring-2 focus:ring-primary/20 
                         focus:border-primary dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                RSVP Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-dark-hover focus:ring-2 focus:ring-primary/20 
                         focus:border-primary dark:focus:border-primary"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meal Preference
              </label>
              <select
                name="meal_preference"
                value={formData.meal_preference}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-dark-hover focus:ring-2 focus:ring-primary/20 
                         focus:border-primary dark:focus:border-primary"
              >
                <option value="standard">Standard</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten Free</option>
                <option value="halal">Halal</option>
                <option value="kosher">Kosher</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Guest Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-dark-hover focus:ring-2 focus:ring-primary/20 
                         focus:border-primary dark:focus:border-primary"
              >
                <option value="family">Family</option>
                <option value="friend">Friend</option>
                <option value="colleague">Colleague</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="plus_one"
                name="plus_one"
                checked={formData.plus_one}
                onChange={handleChange}
                className="checkbox-custom"
              />
              <label 
                htmlFor="plus_one"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Allow Plus One
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dietary Restrictions
              </label>
              <textarea
                name="dietary_restrictions"
                value={formData.dietary_restrictions || ''}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-dark-hover focus:ring-2 focus:ring-primary/20 
                         focus:border-primary dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-dark-hover focus:ring-2 focus:ring-primary/20 
                         focus:border-primary dark:focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                {initialData ? 'Update Guest' : 'Add Guest'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

AddGuestModal.displayName = 'AddGuestModal';