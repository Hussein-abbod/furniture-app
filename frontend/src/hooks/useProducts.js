import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories, getFeaturedProducts, getStats } from '../utils/api';

export function useProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ page: 1, page_size: 12, ...initialParams });

  const fetch = useCallback(async (p = params) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getProducts(p);
      setProducts(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(params); }, [params]);

  const updateParams = useCallback((updates) => {
    setParams(prev => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  }, []);

  return { products, total, totalPages, loading, error, params, updateParams, refetch: () => fetch(params) };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);
  return categories;
}

export function useFeatured() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getFeaturedProducts()
      .then(({ data }) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { products, loading };
}

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const refetch = useCallback(() => {
    setLoading(true);
    getStats().then(({ data }) => setStats(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { refetch(); }, []);
  return { stats, loading, refetch };
}
