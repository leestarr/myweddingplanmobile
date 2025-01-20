import toast from 'react-hot-toast';

export function handleSupabaseError(error) {
  console.error('Database error:', error);
  
  // Handle specific error codes
  switch (error.code) {
    case '22P02':
      throw new Error('Invalid data format');
    case '23505':
      throw new Error('This record already exists');
    case '42501':
      throw new Error('You don\'t have permission to perform this action');
    default:
      throw new Error(error.message || 'An unexpected error occurred');
  }
}

export function handleError(error, customMessage) {
  console.error(error);
  toast.error(customMessage || error.message);
  return false;
}