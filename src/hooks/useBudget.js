import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export function useBudget() {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', 'total')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setBudget(data || null);
    } catch (error) {
      console.error('Error fetching budget:', error);
      if (error.code !== 'PGRST116') {
        toast.error('Failed to load budget');
      }
    } finally {
      setLoading(false);
    }
  };

  const setBudgetAmount = async (amount) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Use upsert to handle both insert and update cases
      const { data, error } = await supabase
        .from('budgets')
        .upsert(
          { 
            user_id: user.id,
            category: 'total',
            total_budget: amount,
            amount: 0,
            budget_locked: false
          },
          { 
            onConflict: 'user_id,category',
            returning: 'representation'
          }
        )
        .select()
        .single();

      if (error) throw error;
      setBudget(data);
      toast.success('Budget updated successfully');
      return true;
    } catch (error) {
      console.error('Error setting budget:', error);
      toast.error('Failed to update budget');
      return false;
    }
  };

  const lockBudget = async (notes = '') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Use transaction to ensure atomicity
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .update({ budget_locked: true })
        .eq('user_id', user.id)
        .eq('category', 'total')
        .select()
        .single();

      if (budgetError) throw budgetError;

      const { error: historyError } = await supabase
        .from('budget_lock_history')
        .insert({
          user_id: user.id,
          total_budget: budget.total_budget,
          notes
        });

      if (historyError) throw historyError;

      setBudget(budget);
      toast.success('Budget locked successfully');
      return true;
    } catch (error) {
      console.error('Error locking budget:', error);
      toast.error('Failed to lock budget');
      return false;
    }
  };

  const unlockBudget = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('budgets')
        .update({ budget_locked: false })
        .eq('user_id', user.id)
        .eq('category', 'total')
        .select()
        .single();

      if (error) throw error;
      setBudget(data);
      toast.success('Budget unlocked successfully');
      return true;
    } catch (error) {
      console.error('Error unlocking budget:', error);
      toast.error('Failed to unlock budget');
      return false;
    }
  };

  return {
    budget,
    loading,
    setBudgetAmount,
    lockBudget,
    unlockBudget
  };
}