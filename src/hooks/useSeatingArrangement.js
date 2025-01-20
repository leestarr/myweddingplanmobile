import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useSeatingArrangement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      // First get all tables
      const { data: tablesData, error: tablesError } = await supabase
        .from('guest_tables')
        .select('*')
        .eq('user_id', user.id)
        .order('number');

      if (tablesError) throw tablesError;

      // Then get all guests with table assignments
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .eq('user_id', user.id)
        .not('table_id', 'is', null);

      if (guestsError) throw guestsError;

      // Combine the data
      const tablesWithGuests = tablesData.map(table => ({
        ...table,
        guests: guestsData.filter(guest => guest.table_id === table.id) || []
      }));

      setTables(tablesWithGuests);
    } catch (error) {
      console.error('Error loading tables:', error);
      toast.error('Failed to load seating arrangement');
    } finally {
      setLoading(false);
    }
  };

  const addTable = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get next table number
      const nextNumber = tables.length > 0 
        ? Math.max(...tables.map(t => t.number)) + 1 
        : 1;

      const { data, error } = await supabase
        .from('guest_tables')
        .insert({
          user_id: user.id,
          number: nextNumber,
          capacity: 8
        })
        .select()
        .single();

      if (error) throw error;

      setTables(prev => [...prev, { ...data, guests: [] }]);
      toast.success('Table added successfully');
    } catch (error) {
      console.error('Error adding table:', error);
      toast.error('Failed to add table');
    }
  };

  const removeTable = async (tableId) => {
    try {
      // First unassign all guests from this table
      const { error: updateError } = await supabase
        .from('guests')
        .update({ 
          table_id: null,
          table_number: null 
        })
        .eq('table_id', tableId);

      if (updateError) throw updateError;

      // Then delete the table
      const { error } = await supabase
        .from('guest_tables')
        .delete()
        .eq('id', tableId);

      if (error) throw error;

      setTables(prev => prev.filter(t => t.id !== tableId));
      toast.success('Table removed successfully');
    } catch (error) {
      console.error('Error removing table:', error);
      toast.error('Failed to remove table');
    }
  };

  const assignGuest = async (guestId, tableId) => {
    try {
      // Get table info
      const table = tables.find(t => t.id === tableId);
      if (!table) throw new Error('Table not found');

      // Check capacity
      if (table.guests.length >= table.capacity) {
        toast.error('Table is at full capacity');
        return false;
      }

      // Update guest's table assignment
      const { data, error } = await supabase
        .from('guests')
        .update({ 
          table_id: tableId,
          table_number: table.number 
        })
        .eq('id', guestId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setTables(prev => prev.map(t => {
        // Remove guest from any existing table
        if (t.guests.some(g => g.id === guestId)) {
          return {
            ...t,
            guests: t.guests.filter(g => g.id !== guestId)
          };
        }
        // Add guest to new table
        if (t.id === tableId) {
          return {
            ...t,
            guests: [...t.guests, data]
          };
        }
        return t;
      }));

      return true;
    } catch (error) {
      console.error('Error assigning guest:', error);
      toast.error('Failed to assign guest');
      return false;
    }
  };

  const unassignGuest = async (guestId) => {
    try {
      // Update guest record
      const { data, error } = await supabase
        .from('guests')
        .update({ 
          table_id: null,
          table_number: null 
        })
        .eq('id', guestId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setTables(prev => prev.map(t => ({
        ...t,
        guests: t.guests.filter(g => g.id !== guestId)
      })));

      return true;
    } catch (error) {
      console.error('Error unassigning guest:', error);
      toast.error('Failed to unassign guest');
      return false;
    }
  };

  const unassignAllGuests = async () => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ 
          table_id: null,
          table_number: null 
        })
        .not('table_id', 'is', null);

      if (error) throw error;

      // Update local state
      setTables(prev => prev.map(t => ({
        ...t,
        guests: []
      })));

      toast.success('All guests unassigned successfully');
      return true;
    } catch (error) {
      console.error('Error unassigning all guests:', error);
      toast.error('Failed to unassign guests');
      return false;
    }
  };

  const autoAssignGuests = async (guests) => {
    try {
      // First unassign all guests
      await unassignAllGuests();

      // Sort tables by number
      const sortedTables = [...tables].sort((a, b) => a.number - b.number);
      
      // Keep track of assignments
      const assignments = [];
      let currentTableIndex = 0;

      // Assign guests to tables
      for (const guest of guests) {
        // Skip if we've run out of tables
        if (currentTableIndex >= sortedTables.length) break;

        // Get current table
        let currentTable = sortedTables[currentTableIndex];

        // If current table is full, move to next table
        if (currentTable.guests.length >= currentTable.capacity) {
          currentTableIndex++;
          if (currentTableIndex >= sortedTables.length) break;
          currentTable = sortedTables[currentTableIndex];
        }

        // Add assignment
        assignments.push({
          guestId: guest.id,
          tableId: currentTable.id,
          tableNumber: currentTable.number
        });
      }

      // Batch update all assignments
      if (assignments.length > 0) {
        const { error } = await supabase
          .from('guests')
          .upsert(
            assignments.map(({ guestId, tableId, tableNumber }) => ({
              id: guestId,
              table_id: tableId,
              table_number: tableNumber
            }))
          );

        if (error) throw error;

        // Reload tables to get updated state
        await loadTables();
        toast.success('Guests auto-assigned successfully');
      }

      return true;
    } catch (error) {
      console.error('Error auto-assigning guests:', error);
      toast.error('Failed to auto-assign guests');
      return false;
    }
  };

  const checkConflicts = (guestId, tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return ['Table not found'];

    const conflicts = [];

    // Check table capacity
    if (table.guests.length >= table.capacity) {
      conflicts.push('Table is at full capacity');
    }

    return conflicts;
  };

  return {
    tables,
    loading,
    addTable,
    removeTable,
    assignGuest,
    unassignGuest,
    unassignAllGuests,
    autoAssignGuests,
    checkConflicts,
    refresh: loadTables
  };
}