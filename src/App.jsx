import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from './components/ui/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { useAuth } from './hooks/useAuth';
import { BudgetProvider } from './contexts/BudgetContext';
import Dashboard from './components/Dashboard';
import { MoneyManagementPage } from './components/money';
import { GuestListPage } from './components/guests';
import { DocumentsPage } from './components/documents';
import { TaskManagementPage } from './components/tasks';
import { VendorManagementPage } from './components/vendors';
import { ForumPage } from './components/forum';
import { StorePage } from './components/store';
import { UserManagementPage } from './components/users';
import { MobileMenu } from './components/ui/MobileMenu';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, loading } = useAuth();

  const handleMenuItemClick = (page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'money':
        return <MoneyManagementPage />;
      case 'guests':
        return <GuestListPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'tasks':
        return <TaskManagementPage />;
      case 'vendors':
        return <VendorManagementPage />;
      case 'forum':
        return <ForumPage />;
      case 'store':
        return <StorePage />;
      case 'users':
        return <UserManagementPage />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // Show landing page if user is not authenticated
  if (!user) {
    return (
      <>
        <LandingPage />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <BudgetProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg dark:text-gray-100 transition-colors duration-200">
          <Header 
            onMenuClick={() => setIsSidebarOpen(true)} 
            onNavigate={setCurrentPage}
          />
          <div className="max-w-[1440px] mx-auto">
            <div className="flex">
              <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                currentPage={currentPage}
                onMenuItemClick={handleMenuItemClick}
              />
              {renderPage()}
            </div>
          </div>
          <MobileMenu 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            currentPage={currentPage}
            onNavigate={handleMenuItemClick}
          />
          <Toaster position="top-right" />
        </div>
      </BudgetProvider>
    </DndProvider>
  );
}