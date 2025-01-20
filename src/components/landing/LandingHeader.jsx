import React from 'react';
import { Button } from '../ui/Button';

export function LandingHeader({ onLogin, onSignup }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary">Myweddingplan.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={onLogin}>Log in</Button>
            <Button onClick={onSignup}>Sign up free</Button>
          </div>
        </div>
      </div>
    </header>
  );
}