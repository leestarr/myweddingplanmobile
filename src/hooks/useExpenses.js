import { useState, useEffect } from 'react';
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from '../lib/expenses';
import { handleError } from '../utils/errorHandling';
import toast from 'react-hot-toast';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      handleError(error, 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const expense = await addExpense(expenseData);
      setExpenses(prev => [expense, ...prev]);
      toast.success('Expense added successfully');
      return true;
    } catch (error) {
      return handleError(error, 'Failed to add expense');
    }
  };

  const handleUpdateExpense = async (id, updates) => {
    try {
      const expense = await updateExpense(id, updates);
      setExpenses(prev => prev.map(exp => 
        exp.id === id ? expense : exp
      ));
      toast.success('Expense updated successfully');
      return true;
    } catch (error) {
      return handleError(error, 'Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast.success('Expense deleted successfully');
      return true;
    } catch (error) {
      return handleError(error, 'Failed to delete expense');
    }
  };

  return {
    expenses,
    loading,
    addExpense: handleAddExpense,
    updateExpense: handleUpdateExpense,
    deleteExpense: handleDeleteExpense,
    refresh: loadExpenses
  };
}