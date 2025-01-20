export type GuestStatus = 'pending' | 'confirmed' | 'declined';
export type MealPreference = 'standard' | 'vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'kosher';
export type GuestType = 'family' | 'friend' | 'colleague' | 'plus_one';

export interface Guest {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  status: GuestStatus;
  meal_preference: MealPreference;
  type: GuestType;
  plus_one: boolean;
  table_number?: number;
  dietary_restrictions?: string;
  notes?: string;
  rsvp_date?: string;
  created_at: string;
  updated_at: string;
}

export interface GuestFilters {
  search: string;
  rsvpStatus: GuestStatus | 'all';
  mealPreference: MealPreference | 'all';
  guestType: GuestType | 'all';
  sortBy: 'name' | 'rsvpDate' | 'tableNumber';
}

export interface GuestFormData extends Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
  name: string;
  email?: string;
  status: GuestStatus;
  meal_preference: MealPreference;
  type: GuestType;
  plus_one: boolean;
}

export interface ImportedGuest extends Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
  name: string;
  email?: string;
}