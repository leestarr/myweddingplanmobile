import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { CategoryModal } from './CategoryModal';
import { useTaskCategories } from '../../../hooks/useTaskCategories';

export function TaskCategories() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useTaskCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleSubmit = async (formData) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error handling category:', error);
    }
  };

  const handleEdit = async (category) => {
    if (editingId === category.id) {
      // Save changes
      if (editName.trim() && editName.trim() !== category.name) {
        await updateCategory(category.id, { name: editName.trim() });
      }
      setEditingId(null);
      setEditName('');
    } else {
      setEditingId(category.id);
      setEditName(category.name);
    }
  };

  const handleKeyPress = (e, category) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEdit(category);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(categoryId);
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
            <Button onClick={() => setIsModalOpen(true)} className="text-sm bg-primary hover:bg-primary-light">
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover"
              >
                {editingId === category.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, category)}
                    onBlur={() => handleEdit(category)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color || '#4f46e5' }}
                    />
                    <span className="text-sm text-gray-900 dark:text-white">{category.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedCategory}
      />
    </>
  );
}