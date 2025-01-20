import React from 'react';
import { BudgetOverview } from './sections/BudgetOverview';
import { BudgetSetup } from './sections/BudgetSetup';
import { ExpenseTracker } from './sections/ExpenseTracker';
import { PaymentSchedule } from './sections/PaymentSchedule';
import { ReceiptManager } from './sections/ReceiptManager';

export function MoneyManagementPage() {
  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Money Management</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <BudgetSetup />
          <BudgetOverview />
          <ExpenseTracker />
          <PaymentSchedule />
          <ReceiptManager />
        </div>
      </div>
    </main>
  );
}