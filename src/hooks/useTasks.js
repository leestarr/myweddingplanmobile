import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          category:task_categories(id, name, color)
        `)
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...taskData, user_id: user.id })
        .select(`
          *,
          category:task_categories(id, name, color)
        `)
        .single();

      if (error) throw error;
      setTasks(prev => [...prev, data]);
      toast.success('Task added successfully');
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      return false;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          category:task_categories(id, name, color)
        `)
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Task updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return false;
    }
  };

  const reorderTasks = async (taskId, newIndex) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update local state optimistically
      const oldIndex = tasks.findIndex(t => t.id === taskId);
      const newTasks = [...tasks];
      const [movedTask] = newTasks.splice(oldIndex, 1);
      newTasks.splice(newIndex, 0, movedTask);
      
      // Update order_index for all affected tasks
      const updates = newTasks.map((task, index) => ({
        id: task.id,
        order_index: index
      }));

      setTasks(newTasks);

      const { error } = await supabase
        .from('tasks')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reordering tasks:', error);
      toast.error('Failed to reorder tasks');
      await loadTasks(); // Reload on error
      return false;
    }
  };

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    reorderTask: reorderTasks,
    deleteTask,
    refresh: loadTasks
  };
}