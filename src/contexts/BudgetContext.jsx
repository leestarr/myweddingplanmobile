import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBudget } from '../hooks/useBudget';

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const { budget, loading, setBudgetAmount, lockBudget, unlockBudget } = useBudget();
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (expenses.length > 0) {
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalSpent(total);
    }
  }, [expenses]);

  const value = {
    budget,
    loading,
    setBudgetAmount,
    lockBudget,
    unlockBudget,
    expenses,
    setExpenses,
    totalSpent
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgetContext() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgetContext must be used within a BudgetProvider');
  }
  return context;
}