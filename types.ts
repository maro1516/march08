
export interface ClimateData {
  high: number;
  low: number;
  rain_days: number;
}

export interface Climate {
  spring: ClimateData;
  summer: ClimateData;
  autumn: ClimateData;
  winter: ClimateData;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: 'Activity' | 'Hotel' | 'Restaurant';
}

export interface City {
  id: string;
  name: string;
  description?: string;
  image: string;
  highlights: string[];
  category?: string;
  coordinates?: { lat: number; lng: number };
  budget?: string;
  unesco?: boolean;
  tags?: string[];
  climate?: Climate;
  places?: Place[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Stall {
  id: string;
  name: string;
  owner: string;
  description: string;
  image: string;
  products: Product[];
  rating: number;
}

export interface Booking {
  id: string;
  userId?: string; // Link to user
  type: 'hotel' | 'activity' | 'bazaar';
  itemName: string;
  date: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  customerName: string;
}

export interface ItineraryItem {
  day: number;
  location: string;
  activities: string[];
  tips: string;
  commuteTime?: string;
  commuteFees?: string;
  coordinates?: { lat: number; lng: number };
  hotel?: { name: string; description: string; price: string };
  bar?: { name: string; description: string };
  monument?: { name: string; description: string };
  event?: { name: string; description: string; time: string };
}

export interface ItineraryResponse {
  title: string;
  summary: string;
  itinerary: ItineraryItem[];
  culturalAdvice: string[];
}

export interface SavedItinerary extends ItineraryResponse {
  id: string;
  userId: string;
  createdAt: string;
  style: 'adventure' | 'relaxation' | 'culture' | 'business';
  isBusinessTrip?: boolean;
  businessHours?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'artisan';
  password?: string; // Only for local mock storage
  avatar?: string;
  favorites?: string[]; // Array of product/stall/city IDs
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface ReservationItem {
  id: string;
  cityId: string;
  placeId: string;
  name: string;
  price: number;
  category: string;
  date: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}
