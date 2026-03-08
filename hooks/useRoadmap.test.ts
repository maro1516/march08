
import { renderHook, act } from '@testing-library/react';
import { useRoadmap } from './useRoadmap';
import { describe, it, expect } from 'vitest';

describe('useRoadmap', () => {
  it('should start with an empty roadmap', () => {
    const { result } = renderHook(() => useRoadmap());
    expect(result.current.roadmap).toEqual([]);
  });

  it('should add a city to the roadmap', () => {
    const { result } = renderHook(() => useRoadmap());
    act(() => {
      result.current.addToRoadmap('mar-01');
    });
    expect(result.current.roadmap).toContain('mar-01');
  });

  it('should not add duplicate cities', () => {
    const { result } = renderHook(() => useRoadmap());
    act(() => {
      result.current.addToRoadmap('mar-01');
      result.current.addToRoadmap('mar-01');
    });
    expect(result.current.roadmap).toHaveLength(1);
  });

  it('should remove a city from the roadmap', () => {
    const { result } = renderHook(() => useRoadmap());
    act(() => {
      result.current.addToRoadmap('mar-01');
      result.current.removeFromRoadmap('mar-01');
    });
    expect(result.current.roadmap).not.toContain('mar-01');
  });
});
