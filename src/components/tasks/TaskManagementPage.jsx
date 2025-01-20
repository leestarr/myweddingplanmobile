import React from 'react';
import { TaskList } from './sections/TaskList';
import { TaskCategories } from './sections/TaskCategories';
import { TaskTimeline } from './sections/TaskTimeline';
import { TaskCollaborators } from './sections/TaskCollaborators';

export function TaskManagementPage() {
  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Tasks</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          <div className="lg:col-span-2 space-y-4">
            <TaskList />
            <TaskTimeline />
          </div>
          <div className="space-y-4">
            <TaskCategories />
            <TaskCollaborators />
          </div>
        </div>
      </div>
    </main>
  );
}