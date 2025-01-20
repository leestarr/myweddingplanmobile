import { useState, useEffect } from 'react';
import { fetchCategories, addCategory } from '../lib/tasks';
import toast from 'react-hot-toast';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (name) => {
    try {
      const category = await addCategory({ name });
      setCategories(prev => [...prev, category]);
      toast.success('Category added successfully');
      return category;
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
      return null;
    }
  };

  return {
    categories,
    loading,
    addCategory: handleAddCategory,
    refresh: loadCategories
  };
}