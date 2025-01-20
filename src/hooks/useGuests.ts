import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Guest, GuestFormData, ImportedGuest } from '../types/guest';

interface UseGuestsReturn {
  guests: Guest[];
  loading: boolean;
  addGuest: (guestData: GuestFormData) => Promise<Guest>;
  updateGuest: (id: string, updates: Partial<GuestFormData>) => Promise<Guest>;
  deleteGuest: (id: string) => Promise<boolean>;
  importGuests: (guests: ImportedGuest[], filename: string) => Promise<number>;
  refresh: () => Promise<void>;
}

export function useGuests(): UseGuestsReturn {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
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

  const addGuest = async (guestData: GuestFormData): Promise<Guest> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

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
      if (!data) throw new Error('No data returned from insert');

      setGuests(prev => [...prev, data]);
      toast.success('Guest added successfully');
      return data;
    } catch (error: any) {
      console.error('Error adding guest:', error);
      if (error.code === '23505') {
        toast.error('A guest with this email already exists');
      } else {
        toast.error('Failed to add guest');
      }
      throw error;
    }
  };

  const updateGuest = async (id: string, updates: Partial<GuestFormData>): Promise<Guest> => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');
      
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

  const deleteGuest = async (id: string): Promise<boolean> => {
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

  const importGuests = async (guests: ImportedGuest[], filename: string): Promise<number> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
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
      if (!importRecord) throw new Error('No import record created');

      const guestsWithMetadata = guests.map(guest => ({
        ...guest,
        user_id: user.id,
        import_id: importRecord.id,
        status: 'pending' as const,
        meal_preference: guest.meal_preference || 'standard',
        type: guest.type || 'friend',
        plus_one: guest.plus_one || false
      }));

      const { data, error } = await supabase
        .from('guests')
        .insert(guestsWithMetadata)
        .select();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

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