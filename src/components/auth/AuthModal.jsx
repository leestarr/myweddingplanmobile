import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName
            }
          }
        });
        if (error) throw error;
        toast.success('Check your email to confirm your account');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        toast.success('Logged in successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white dark:bg-dark-card rounded-xl shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </Dialog.Title>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-dark-card text-gray-500">Or continue with</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-dark-hover focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-dark-hover focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-dark-hover focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                {mode === 'signup' && (
                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:text-primary-light">
                        Terms of Service
                      </a>
                    </label>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                  className="text-primary hover:text-primary-light font-medium"
                >
                  {mode === 'signup' ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}