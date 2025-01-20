import { supabase } from './supabase';
import { handleError } from '../utils/errorHandling';

export async function uploadDocument(file, parentId = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Generate storage path with user isolation
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${user.id}/${timestamp}_${safeName}`;

    // Upload file to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (storageError) throw storageError;

    // Create document record
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        name: file.name,
        storage_path: storagePath,
        file_type: file.type,
        file_size: file.size,
        parent_id: parentId,
        is_folder: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error, 'Failed to upload document');
  }
}

export async function createFolder(name, parentId = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        name,
        parent_id: parentId,
        is_folder: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error, 'Failed to create folder');
  }
}

export async function deleteDocument(id) {
  try {
    // Get document info first
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('storage_path, is_folder')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage if it's a file
    if (!doc.is_folder && doc.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.storage_path]);

      if (storageError) throw storageError;
    }

    // Delete document record
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    throw handleError(error, 'Failed to delete document');
  }
}

export async function getDownloadUrl(storagePath) {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    throw handleError(error, 'Failed to get download URL');
  }
}

export async function getDocuments(parentId = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const query = supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('is_folder', { ascending: false })
      .order('name');

    if (parentId) {
      query.eq('parent_id', parentId);
    } else {
      query.is('parent_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error, 'Failed to fetch documents');
  }
}