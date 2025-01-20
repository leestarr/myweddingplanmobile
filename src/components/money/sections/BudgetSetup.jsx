import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useBudget } from '../../../hooks/useBudget';

export function BudgetSetup() {
  const { budget, loading, setBudgetAmount, lockBudget, unlockBudget } = useBudget();
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;
    
    const success = await setBudgetAmount(parseFloat(amount));
    if (success) {
      setAmount('');
      setIsEditing(false);
    }
  };

  const handleLock = async () => {
    await lockBudget(notes);
    setNotes('');
  };

  const handleUnlock = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to unlock the budget? This will allow modifications to the budget amount.'
    );
    if (confirmed) {
      await unlockBudget();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400">Loading budget...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Wedding Budget</h2>
          {budget?.budget_locked && (
            <Button onClick={handleUnlock} variant="secondary" size="sm">
              Unlock Budget
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {budget?.budget_locked && !isEditing ? (
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Total Budget: ${budget.total_budget.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Your budget is currently locked. You can unlock it to make changes if needed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {budget ? 'Update Your Wedding Budget' : 'Set Your Total Wedding Budget'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={budget ? budget.total_budget.toString() : 'Enter amount'}
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {budget ? 'Update Budget' : 'Set Budget'}
              </Button>
            </form>

            {budget?.total_budget && !budget.budget_locked && (
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Budget: ${budget.total_budget.toLocaleString()}
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about your budget"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleLock}
                  variant="secondary" 
                  className="w-full"
                >
                  Lock Budget
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Locking your budget helps maintain accurate tracking and reporting.
                  You can unlock it later if needed.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}