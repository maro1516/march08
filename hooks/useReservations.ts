
import { useState, useCallback } from 'react';
import { ReservationItem } from '../types';

export const useReservations = () => {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);

  const addToReservations = useCallback((item: ReservationItem) => {
    setReservations((prev) => {
      // Allow multiple reservations of the same place if needed, 
      // but usually we might want to check if it's already there for the same date.
      // For simplicity, we just add it.
      return [...prev, item];
    });
  }, []);

  const removeFromReservations = useCallback((reservationId: string) => {
    setReservations((prev) => prev.filter((item) => item.id !== reservationId));
  }, []);

  const clearReservations = useCallback(() => {
    setReservations([]);
  }, []);

  return {
    reservations,
    addToReservations,
    removeFromReservations,
    clearReservations,
  };
};
