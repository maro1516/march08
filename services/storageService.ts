
import { Booking, User } from "../types";

const BOOKINGS_KEY = "morocco_journey_bookings";
const USERS_KEY = "morocco_journey_users";
const CURRENT_USER_KEY = "morocco_journey_current_user";
const AUDIT_LOGS_KEY = "morocco_journey_audit_logs";
const ITINERARIES_KEY = "morocco_journey_itineraries";

export const storageService = {
  saveBooking: (booking: Booking) => {
    const existing = storageService.getBookings();
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([...existing, booking]));
  },
  getBookings: (): Booking[] => {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  },
  updateBooking: (bookingId: string, updates: Partial<Booking>) => {
    const bookings = storageService.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    }
  },
  getRevenue: () => {
    return storageService.getBookings().reduce((sum, b) => sum + b.amount, 0);
  },
  
  // User Management
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user: User) => {
    const users = storageService.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  },
  updateUser: (userId: string, updates: Partial<User>) => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update current user if it's the same
      const currentUser = storageService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        storageService.setCurrentUser(users[index]);
      }
    }
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  // Favorites Management
  toggleFavorite: (userId: string, itemId: string) => {
    const users = storageService.getUsers();
    let userIndex = users.findIndex(u => u.id === userId);
    
    let user: User;
    if (userIndex === -1) {
      // If user not in local storage, get from current session or create placeholder
      const currentUser = storageService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        user = { ...currentUser, favorites: [] };
      } else {
        return; // Should not happen if called correctly
      }
      users.push(user);
      userIndex = users.length - 1;
    } else {
      user = users[userIndex];
    }

    const favorites = user.favorites || [];
    const isFavorite = favorites.includes(itemId);
    
    if (isFavorite) {
      user.favorites = favorites.filter(id => id !== itemId);
    } else {
      user.favorites = [...favorites, itemId];
    }

    users[userIndex] = user;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Also update current user if it's the same
    const currentUser = storageService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      storageService.setCurrentUser(user);
    }
  },
  
  getUserBookings: (userId: string): Booking[] => {
    return storageService.getBookings().filter(b => b.userId === userId);
  },

  // Audit Management
  saveAuditLog: (log: { action: string; details: string; userId?: string; status: 'success' | 'failure' }) => {
    const logs = storageService.getAuditLogs();
    const newLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify([newLog, ...logs].slice(0, 100)));
  },
  getAuditLogs: () => {
    const data = localStorage.getItem(AUDIT_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Itinerary Management
  saveItinerary: (itinerary: any) => {
    const existing = storageService.getItineraries();
    localStorage.setItem(ITINERARIES_KEY, JSON.stringify([itinerary, ...existing]));
  },
  getItineraries: () => {
    const data = localStorage.getItem(ITINERARIES_KEY);
    return data ? JSON.parse(data) : [];
  },
  getUserItineraries: (userId: string) => {
    return storageService.getItineraries().filter((i: any) => i.userId === userId);
  }
};
