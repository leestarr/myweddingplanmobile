import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useTaskCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('task_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async ({ name, color = '#4f46e5' }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('task_categories')
        .insert({ 
          name, 
          color, 
          user_id: user.id 
        })
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => [...prev, data]);
      toast.success('Category added successfully');
      return data;
    } catch (error) {
      console.error('Error adding category:', error);
      if (error.code === '23505') {
        toast.error('A category with this name already exists');
      } else {
        toast.error('Failed to add category');
      }
      throw error;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('task_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => prev.map(cat => cat.id === id ? data : cat));
      toast.success('Category updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.code === '23505') {
        toast.error('A category with this name already exists');
      } else {
        toast.error('Failed to update category');
      }
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const { error } = await supabase
        .from('task_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
      throw error;
    }
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refresh: loadCategories
  };
}