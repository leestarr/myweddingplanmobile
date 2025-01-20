import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const SYNC_DEBOUNCE = 100; // Max update frequency
const POLL_INTERVAL = 2000; // Fallback polling interval

export function useRealtimeSeating() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const pendingChanges = useRef(new Map());
  const subscription = useRef(null);
  const pollInterval = useRef(null);

  // Load initial data
  const loadTables = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: tablesData, error: tablesError } = await supabase
        .from('guest_tables')
        .select('*')
        .eq('user_id', user.id)
        .order('number');

      if (tablesError) throw tablesError;

      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .eq('user_id', user.id)
        .not('table_id', 'is', null);

      if (guestsError) throw guestsError;

      const tablesWithGuests = tablesData.map(table => ({
        ...table,
        guests: guestsData.filter(guest => guest.table_id === table.id) || []
      }));

      setTables(tablesWithGuests);
      return true;
    } catch (error) {
      console.error('Error loading tables:', error);
      toast.error('Failed to load seating arrangement');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time changes
  const subscribeToChanges = useCallback(() => {
    // Subscribe to guest_tables changes
    const tablesSubscription = supabase
      .channel('guest_tables_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'guest_tables' 
        },
        async (payload) => {
          // Debounce updates
          await new Promise(resolve => setTimeout(resolve, SYNC_DEBOUNCE));
          await loadTables();
        }
      )
      .subscribe();

    // Subscribe to guests changes
    const guestsSubscription = supabase
      .channel('guests_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guests',
          filter: 'table_id.is.not.null'
        },
        async (payload) => {
          await new Promise(resolve => setTimeout(resolve, SYNC_DEBOUNCE));
          await loadTables();
        }
      )
      .subscribe();

    subscription.current = [tablesSubscription, guestsSubscription];
  }, []);

  // Start polling as fallback
  const startPolling = useCallback(() => {
    if (pollInterval.current) return;
    
    pollInterval.current = setInterval(async () => {
      if (!isOnline) return;
      await loadTables();
    }, POLL_INTERVAL);
  }, [isOnline]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      loadTables();
      subscribeToChanges();
      stopPolling();
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (subscription.current) {
        subscription.current.forEach(sub => sub.unsubscribe());
      }
      startPolling();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial setup
    if (navigator.onLine) {
      handleOnline();
    } else {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      stopPolling();
      if (subscription.current) {
        subscription.current.forEach(sub => sub.unsubscribe());
      }
    };
  }, [subscribeToChanges, startPolling, stopPolling]);

  // Optimistic update helper
  const optimisticUpdate = async (operation, data) => {
    const changeId = Date.now();
    pendingChanges.current.set(changeId, { operation, data });

    try {
      // Apply optimistic update
      switch (operation) {
        case 'assignGuest':
          setTables(prev => prev.map(t => {
            if (t.id === data.tableId) {
              return {
                ...t,
                guests: [...t.guests, data.guest]
              };
            }
            return t;
          }));
          break;
        // Add other cases as needed
      }

      // Attempt server update
      const result = await data.serverUpdate();
      
      // Remove from pending changes if successful
      pendingChanges.current.delete(changeId);
      return result;
    } catch (error) {
      // Revert optimistic update on failure
      pendingChanges.current.delete(changeId);
      await loadTables();
      throw error;
    }
  };

  // Table operations with optimistic updates
  const assignGuest = async (guestId, tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) throw new Error('Table not found');

    if (table.guests.length >= table.capacity) {
      toast.error('Table is at full capacity');
      return false;
    }

    const guest = tables
      .flatMap(t => t.guests)
      .find(g => g.id === guestId);

    return optimisticUpdate('assignGuest', {
      tableId,
      guest,
      serverUpdate: async () => {
        const { error } = await supabase
          .from('guests')
          .update({ 
            table_id: tableId,
            table_number: table.number 
          })
          .eq('id', guestId);

        if (error) throw error;
        return true;
      }
    });
  };

  return {
    tables,
    loading,
    isOnline,
    assignGuest,
    refresh: loadTables
  };
}