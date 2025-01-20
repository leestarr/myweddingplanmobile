import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { TaskForm } from './TaskForm';
import { useTasks } from '../../../hooks/useTasks';
import { format } from 'date-fns';

export function TaskList() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleSubmit = async (formData) => {
    let success;
    if (selectedTask) {
      success = await updateTask(selectedTask.id, formData);
    } else {
      success = await addTask(formData);
    }
    if (success) {
      setIsFormOpen(false);
      setSelectedTask(null);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h2>
            <Button onClick={() => setIsFormOpen(true)}>Add Task</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-hover"
              >
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => updateTask(task.id, {
                    status: task.status === 'completed' ? 'pending' : 'completed'
                  })}
                  className="checkbox-custom"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                    {task.category && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {task.category.name}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedTask}
      />
    </>
  );
}