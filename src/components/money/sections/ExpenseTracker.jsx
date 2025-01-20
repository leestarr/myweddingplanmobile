import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ExpenseList } from './ExpenseList';
import { ExpenseForm } from './ExpenseForm';
import { useExpenses } from '../../../hooks/useExpenses';

export function ExpenseTracker() {
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleSubmit = async (formData) => {
    let success;
    if (selectedExpense) {
      success = await updateExpense(selectedExpense.id, formData);
    } else {
      success = await addExpense(formData);
    }
    if (success) {
      setIsFormOpen(false);
      setSelectedExpense(null);
    }
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this expense?');
    if (confirmed) {
      await deleteExpense(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Expenses</h2>
          <Button onClick={() => setIsFormOpen(true)}>Add Expense</Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No expenses yet</p>
        ) : (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </CardContent>

      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedExpense(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedExpense}
      />
    </Card>
  );
}