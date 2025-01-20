import React from 'react';
import { Button } from '../ui/Button';

export function HeroSection({ onGetStarted }) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-dark-bg pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Your Perfect Wedding
            <span className="block text-primary mt-2">All in One Place</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-400">
            Plan your dream wedding with ease. Keep all your documents, budgets, and vendor details organized. Connect with other couples and find inspiration in our community.
          </p>
          <div className="mt-8 flex justify-center">
            <Button onClick={onGetStarted} className="px-8 py-3 text-base">
              Start Planning Free
            </Button>
          </div>
          <div className="mt-12 flex justify-center gap-8 sm:gap-12">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">10k+</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Happy Couples</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">$2M+</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Budget Saved</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">5k+</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Vendors</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Abstract shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10">
        <div className="absolute inset-0 rotate-45 bg-gradient-to-r from-primary to-primary-light rounded-full blur-3xl"></div>
        <div className="absolute inset-0 -rotate-45 bg-gradient-to-r from-primary to-primary-light rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}