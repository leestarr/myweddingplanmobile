import { useState, useEffect } from 'react';
import { supabase, testConnection } from '../lib/supabaseClient';

export function useSupabase() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyConnection = async () => {
      try {
        const connected = await testConnection();
        setIsConnected(connected);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyConnection();
  }, []);

  return { supabase, isConnected, loading, error };
}