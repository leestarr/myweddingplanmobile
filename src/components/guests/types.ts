import { Guest, GuestFormData, GuestFilters as IGuestFilters } from '../../types/guest';

export interface GuestListProps {
  guests: Guest[];
  loading: boolean;
  onAdd: (data: GuestFormData) => Promise<Guest>;
  onEdit: (id: string, data: Partial<GuestFormData>) => Promise<Guest>;
  onDelete: (id: string) => Promise<boolean>;
}

export interface GuestFiltersProps {
  filters: IGuestFilters;
  onChange: (filters: IGuestFilters) => void;
  guestStats: GuestStats;
}

export interface GuestStats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  vegetarian: number;
  vegan: number;
  plusOnes: number;
}

export interface GuestStatsProps {
  guests: Guest[];
  stats: GuestStats;
}

export interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GuestFormData) => Promise<void>;
  initialData?: Guest;
}

export interface GuestTableProps {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
}

export interface GuestFiltersDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    count?: number;
  }>;
  label: string;
}

export interface GuestSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface GuestSortProps {
  value: IGuestFilters['sortBy'];
  onChange: (value: IGuestFilters['sortBy']) => void;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps extends CardProps {}
export interface CardContentProps extends CardProps {}

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export interface EmptyStateProps {
  onAdd: () => void;
}

export interface StatusBadgeProps {
  status: Guest['status'];
}

export interface GuestAvatarProps {
  name: string;
}