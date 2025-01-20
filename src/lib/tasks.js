import { supabase } from './supabase';
import { handleError } from '../utils/errorHandling';

export async function fetchTasks() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        category:task_categories(id, name, color)
      `)
      .eq('user_id', user.id)
      .order('due_date', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function fetchCategories() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('task_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function addCategory({ name, color = '#4f46e5' }) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('task_categories')
      .insert({ name, color, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error, 'Failed to add category');
  }
}

export async function addTask(taskData) {
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
    return data;
  } catch (error) {
    throw handleError(error, 'Failed to add task');
  }
}

export async function updateTask(id, updates) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id) // Add user_id check for security
      .select(`
        *,
        category:task_categories(id, name, color)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error, 'Failed to update task');
  }
}

export async function deleteTask(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Add user_id check for security

    if (error) throw error;
    return true;
  } catch (error) {
    throw handleError(error, 'Failed to delete task');
  }
}