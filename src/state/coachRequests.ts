import { useState, useEffect, useCallback } from 'react';
import type { RequestItem, RequestFilters } from '../types/requests';
import { fetchRequests } from '../services/requests';

const FILTERS_KEY = 'sb:coach:filters';

const defaultFilters: RequestFilters = {
  status: 'new',
  club: 'all',
  tags: [],
  period: 'all',
  sort: 'newest',
  search: ''
};

export function useCoachRequests() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestFilters>(() => {
    try {
      const saved = localStorage.getItem(FILTERS_KEY);
      return saved ? { ...defaultFilters, ...JSON.parse(saved) } : defaultFilters;
    } catch {
      return defaultFilters;
    }
  });

  // Save filters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Failed to save filters:', error);
    }
  }, [filters]);

  // Load requests when filters change
  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchRequests(filters);
      setRequests(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateFilters = useCallback((newFilters: Partial<RequestFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const refreshRequests = useCallback(() => {
    loadRequests();
  }, [loadRequests]);

  return {
    requests,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshRequests
  };
}