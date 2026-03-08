
import { useState, useCallback } from 'react';

export const useRoadmap = () => {
  const [roadmap, setRoadmap] = useState<string[]>([]);

  const addToRoadmap = useCallback((cityId: string) => {
    setRoadmap((prev) => {
      if (prev.includes(cityId)) return prev;
      return [...prev, cityId];
    });
  }, []);

  const removeFromRoadmap = useCallback((cityId: string) => {
    setRoadmap((prev) => prev.filter((id) => id !== cityId));
  }, []);

  const isInRoadmap = useCallback((cityId: string) => {
    return roadmap.includes(cityId);
  }, [roadmap]);

  return {
    roadmap,
    setRoadmap,
    addToRoadmap,
    removeFromRoadmap,
    isInRoadmap,
  };
};
