import { supabase } from './supabase';
import { handleSupabaseError } from '../utils/errorHandling';

export async function fetchExpenses() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        category:expense_categories(name)
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error);
  }
}

export async function addExpense(expenseData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const data = {
      ...expenseData,
      user_id: user.id,
      category_id: expenseData.category_id || null
    };

    const { data: expense, error } = await supabase
      .from('expenses')
      .insert(data)
      .select(`
        *,
        category:expense_categories(name)
      `)
      .single();

    if (error) throw error;
    return expense;
  } catch (error) {
    handleSupabaseError(error);
  }
}

export async function updateExpense(id, updates) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const data = {
      ...updates,
      category_id: updates.category_id || null
    };

    const { data: expense, error } = await supabase
      .from('expenses')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        category:expense_categories(name)
      `)
      .single();

    if (error) throw error;
    return expense;
  } catch (error) {
    handleSupabaseError(error);
  }
}

export async function deleteExpense(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    handleSupabaseError(error);
  }
}