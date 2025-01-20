import React, { memo, useState, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { AddGuestModal } from './AddGuestModal';
import { GuestListProps } from '../types';
import { Guest, GuestFormData } from '../../../types/guest';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useWindowSize, breakpoints } from '../../../hooks/useWindowSize';

const ROW_HEIGHT = 72;
const MOBILE_ROW_HEIGHT = 108;
const MIN_LIST_HEIGHT = 400;

interface GuestRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    guests: Guest[];
    onEdit: (guest: Guest) => void;
    onDelete: (id: string) => Promise<void>;
    isMobile: boolean;
  };
}

const StatusBadge = memo(({ status }: { status: Guest['status'] }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
    status === 'confirmed'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : status === 'declined'
      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  }`}>
    {status}
  </span>
));

const GuestAvatar = memo(({ name }: { name: string }) => (
  <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 dark:bg-opacity-20 flex-shrink-0 flex items-center justify-center">
    <span className="text-primary text-sm font-medium">
      {name.charAt(0).toUpperCase()}
    </span>
  </div>
));

const GuestRow = memo(({ index, style, data: { guests, onEdit, onDelete, isMobile } }: GuestRowProps) => {
  const guest = guests[index];
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      await onDelete(guest.id);
    }
  };

  if (isMobile) {
    return (
      <div style={style} className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className="flex items-start gap-3">
          <GuestAvatar name={guest.name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {guest.name}
                  {guest.plus_one && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">+1</span>
                  )}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {guest.email || 'No email provided'}
                </div>
              </div>
              <StatusBadge status={guest.status} />
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {guest.meal_preference}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => onEdit(guest)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={style} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-hover">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <GuestAvatar name={guest.name} />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {guest.name}
              {guest.plus_one && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">+1</span>
              )}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {guest.email || 'No email provided'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <StatusBadge status={guest.status} />
          <span className="hidden md:inline text-sm text-gray-500 dark:text-gray-400">
            {guest.meal_preference}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => onEdit(guest)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div className="text-center p-4">
    <p className="text-red-600 dark:text-red-400 mb-4">Error loading guest list: {error.message}</p>
    <Button onClick={resetErrorBoundary}>Try again</Button>
  </div>
);

const LoadingState = () => (
  <Card>
    <CardContent>
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500 dark:text-gray-400">Loading guests...</div>
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      No guests added yet
    </p>
    <Button onClick={onAdd}>
      Add Your First Guest
    </Button>
  </div>
);

export const GuestList = memo(({ 
  guests, 
  loading, 
  onAdd, 
  onEdit, 
  onDelete 
}: GuestListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const { isMobile } = useWindowSize();

  const handleSubmit = async (formData: GuestFormData) => {
    try {
      if (selectedGuest) {
        await onEdit(selectedGuest.id, formData);
      } else {
        await onAdd(formData);
      }
      setIsModalOpen(false);
      setSelectedGuest(null);
    } catch (error) {
      console.error('Error handling guest:', error);
    }
  };

  const handleEdit = useCallback((guest: Guest) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await onDelete(id);
  }, [onDelete]);

  const rowData = useMemo(() => ({
    guests,
    onEdit: handleEdit,
    onDelete: handleDelete,
    isMobile
  }), [guests, handleEdit, handleDelete, isMobile]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => setSelectedGuest(null)}>
      <Card>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Guest List
          </h2>
          <Button onClick={() => setIsModalOpen(true)}>
            Add Guest
          </Button>
        </div>

        <CardContent>
          {!guests.length ? (
            <EmptyState onAdd={() => setIsModalOpen(true)} />
          ) : (
            <div style={{ 
              height: Math.max(
                MIN_LIST_HEIGHT, 
                Math.min(
                  guests.length * (isMobile ? MOBILE_ROW_HEIGHT : ROW_HEIGHT), 
                  600
                )
              ) 
            }}>
              <AutoSizer>
                {({ height, width }: { height: number; width: number }) => (
                  <List
                    height={height}
                    width={width}
                    itemCount={guests.length}
                    itemSize={isMobile ? MOBILE_ROW_HEIGHT : ROW_HEIGHT}
                    itemData={rowData}
                  >
                    {GuestRow}
                  </List>
                )}
              </AutoSizer>
            </div>
          )}
        </CardContent>
      </Card>

      <AddGuestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGuest(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedGuest}
      />
    </ErrorBoundary>
  );
});

GuestList.displayName = 'GuestList';
GuestRow.displayName = 'GuestRow';
StatusBadge.displayName = 'StatusBadge';
GuestAvatar.displayName = 'GuestAvatar';