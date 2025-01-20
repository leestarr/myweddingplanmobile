import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useGuests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast.error('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const addGuest = async (guestData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare guest data with required fields
      const newGuest = {
        ...guestData,
        user_id: user.id,
        status: guestData.status || 'pending',
        meal_preference: guestData.meal_preference || 'standard',
        type: guestData.type || 'friend',
        plus_one: guestData.plus_one || false
      };

      const { data, error } = await supabase
        .from('guests')
        .insert([newGuest])
        .select()
        .single();

      if (error) throw error;

      setGuests(prev => [...prev, data]);
      toast.success('Guest added successfully');
      return data;
    } catch (error) {
      console.error('Error adding guest:', error);
      if (error.code === '23505') {
        toast.error('A guest with this email already exists');
      } else {
        toast.error('Failed to add guest');
      }
      throw error;
    }
  };

  const updateGuest = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setGuests(prev => prev.map(guest => 
        guest.id === id ? data : guest
      ));
      
      toast.success('Guest updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating guest:', error);
      toast.error('Failed to update guest');
      throw error;
    }
  };

  const deleteGuest = async (id) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setGuests(prev => prev.filter(guest => guest.id !== id));
      toast.success('Guest deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast.error('Failed to delete guest');
      throw error;
    }
  };

  const importGuests = async (guests, filename) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create import record
      const { data: importRecord, error: importError } = await supabase
        .from('guest_imports')
        .insert({
          user_id: user.id,
          filename,
          total_records: guests.length,
          successful_records: 0,
          failed_records: 0
        })
        .select()
        .single();

      if (importError) throw importError;

      // Add import_id and user_id to each guest
      const guestsWithMetadata = guests.map(guest => ({
        ...guest,
        user_id: user.id,
        import_id: importRecord.id,
        status: 'pending',
        meal_preference: guest.meal_preference || 'standard',
        type: guest.type || 'friend',
        plus_one: guest.plus_one || false
      }));

      // Insert guests
      const { data, error } = await supabase
        .from('guests')
        .insert(guestsWithMetadata)
        .select();

      if (error) throw error;

      // Update import record with results
      await supabase
        .from('guest_imports')
        .update({
          successful_records: data.length,
          failed_records: guests.length - data.length,
          completed_at: new Date().toISOString()
        })
        .eq('id', importRecord.id);

      setGuests(prev => [...prev, ...data]);
      return data.length;
    } catch (error) {
      console.error('Error importing guests:', error);
      throw error;
    }
  };

  return {
    guests,
    loading,
    addGuest,
    updateGuest,
    deleteGuest,
    importGuests,
    refresh: fetchGuests
  };
}