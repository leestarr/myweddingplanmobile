import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { DoughnutChart } from '../charts/DoughnutChart';
import { useBudgetContext } from '../../../contexts/BudgetContext';

export function BudgetOverview() {
  const { budget, loading, totalSpent } = useBudgetContext();

  if (loading) {
    return (
      <Card>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400">Loading budget overview...</p>
        </CardContent>
      </Card>
    );
  }

  if (!budget?.total_budget) {
    return (
      <Card>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Please set up your wedding budget to see the overview
          </p>
        </CardContent>
      </Card>
    );
  }

  const remaining = budget.total_budget - totalSpent;
  const percentSpent = (totalSpent / budget.total_budget) * 100;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Overview</h2>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${budget.total_budget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
            <p className="text-2xl font-bold text-primary">
              ${totalSpent.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="h-64">
          <DoughnutChart
            data={[
              { name: 'Spent', value: totalSpent },
              { name: 'Remaining', value: remaining }
            ]}
          />
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-900 dark:text-white">Budget Progress</span>
            <span className="text-gray-500 dark:text-gray-400">{percentSpent.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full"
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>

        {budget.budget_locked && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            This budget is locked and cannot be modified
          </p>
        )}
      </CardContent>
    </Card>
  );
}