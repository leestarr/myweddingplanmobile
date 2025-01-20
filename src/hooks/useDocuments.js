import { useState, useEffect } from 'react';
import { uploadDocument, createFolder, deleteDocument, getDownloadUrl } from '../lib/documents';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useDocuments(parentId = null) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [parentId]);

  const fetchDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
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
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, parentId = null) => {
    try {
      const doc = await uploadDocument(file, parentId);
      if (doc) {
        setDocuments(prev => [...prev, doc]);
        toast.success('File uploaded successfully');
      }
      return doc;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return null;
    }
  };

  const handleCreateFolder = async (name, parentId = null) => {
    try {
      const folder = await createFolder(name, parentId);
      if (folder) {
        setDocuments(prev => [...prev, folder]);
        toast.success('Folder created successfully');
      }
      return folder;
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
      return null;
    }
  };

  const handleDelete = async (id) => {
    try {
      const doc = documents.find(d => d.id === id);
      if (!doc) return false;

      const success = await deleteDocument(id, doc.storage_path);
      if (success) {
        setDocuments(prev => prev.filter(d => d.id !== id));
        toast.success('Document deleted successfully');
      }
      return success;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      return false;
    }
  };

  const handleRename = async (id, newName) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update({ name: newName })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? data : doc
      ));
      toast.success('Document renamed successfully');
      return true;
    } catch (error) {
      console.error('Error renaming document:', error);
      toast.error('Failed to rename document');
      return false;
    }
  };

  return {
    documents,
    loading,
    uploadFile: handleUpload,
    createFolder: handleCreateFolder,
    deleteDocument: handleDelete,
    renameDocument: handleRename,
    getDownloadUrl,
    refresh: fetchDocuments
  };
}