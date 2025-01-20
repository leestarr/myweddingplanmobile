import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// Create Supabase client with improved retry configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.error('Supabase fetch error:', err);
        // Retry the request once after a short delay
        return new Promise(resolve => setTimeout(resolve, 1000))
          .then(() => fetch(...args))
          .catch(retryErr => {
            console.error('Supabase retry failed:', retryErr);
            throw retryErr;
          });
      });
    }
  },
  db: {
    schema: 'public'
  },
  // Add request timeout
  realtime: {
    timeout: 20000
  }
});

// Test connection function with retry
export const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabase.from('budgets').select('count').limit(1);
      if (error) throw error;
      console.log('Supabase connection successful');
      return true;
    } catch (error) {
      console.error(`Supabase connection attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) return false;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return false;
};

// Helper to handle Supabase errors consistently
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  if (error.message?.includes('Failed to fetch')) {
    throw new Error('Unable to connect to the database. Please check your internet connection and try again.');
  }
  throw new Error(error.message || 'An error occurred while connecting to the database');
};