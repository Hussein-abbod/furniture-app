import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories, getFeaturedProducts, getStats } from '../utils/api';

// In-memory cache
const cache = {
  products: {},
  categories: null,
  featured: null,
};

export function useProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ page: 1, page_size: 12, ...initialParams });

  const fetch = useCallback(async (p = params) => {
    const cacheKey = JSON.stringify(p);
    
    // Use cache if available
    if (cache.products[cacheKey]) {
      const cached = cache.products[cacheKey];
      setProducts(cached.items);
      setTotal(cached.total);
      setTotalPages(cached.total_pages);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await getProducts(p);
      cache.products[cacheKey] = data; // save to cache
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
  const [categories, setCategories] = useState(cache.categories || []);
  useEffect(() => {
    if (cache.categories) return;
    getCategories().then(({ data }) => {
      cache.categories = data;
      setCategories(data);
    }).catch(() => {});
  }, []);
  return categories;
}

export function useFeatured() {
  const [products, setProducts] = useState(cache.featured || []);
  const [loading, setLoading] = useState(!cache.featured);
  useEffect(() => {
    if (cache.featured) return;
    getFeaturedProducts()
      .then(({ data }) => {
        cache.featured = data;
        setProducts(data);
      })
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
