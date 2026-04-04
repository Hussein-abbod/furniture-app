import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react';
import { useProducts, useCategories } from '../../hooks/useProducts';
import ProductCard from '../../components/shop/ProductCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import Pagination from '../../components/ui/Pagination';
import styles from './Products.module.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useCategories();
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const { products, total, totalPages, loading, params, updateParams } = useProducts({
    page: 1, page_size: 12,
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
  });

  // Sync URL params to internal state (when URL changes via footer/nav)
  useEffect(() => {
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;

    if (category !== params.category || search !== params.search || featured !== params.featured) {
      updateParams({ 
        category, 
        search, 
        featured, 
        page: params.page // Keep page or reset to 1? Usually reset to 1 if category changes
      });
    }
  }, [searchParams]);

  // Sync internal state to URL params & Scroll to top
  useEffect(() => {
    const p = {};
    if (params.category) p.category = params.category;
    if (params.search) p.search = params.search;
    if (params.featured) p.featured = 'true';
    if (params.page > 1) p.page = params.page;
    setSearchParams(p, { replace: true });
    
    // Smooth scroll to results top when filters or page change
    const header = document.querySelector(`.${styles.header}`);
    if (header) {
      header.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [params.category, params.search, params.featured, params.page]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput || undefined, page: 1 });
  };

  const clearFilters = () => {
    setSearchInput('');
    updateParams({ search: undefined, category: undefined, min_price: undefined, max_price: undefined, featured: undefined, page: 1 });
    setSearchParams({});
  };

  const hasFilters = params.search || params.category || params.min_price || params.max_price || params.featured;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Page header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {params.category || (params.featured ? 'Featured' : 'All Furniture')}
            </h1>
            <p className={styles.count}>{loading ? '—' : `${total} products`}</p>
          </div>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchWrap}>
              <Search size={18} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search furniture..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button type="button" className={styles.clearSearch} onClick={() => { setSearchInput(''); updateParams({ search: undefined }); }}>
                  <X size={15} />
                </button>
              )}
            </div>
            <button type="submit" className={`btn btn-primary ${styles.searchBtn}`}>
              <Search size={16} className={styles.searchBtnIcon} />
              <span className={styles.searchBtnText}>Search</span>
            </button>
            <button type="button" className={`btn btn-outline ${styles.filterToggle}`} onClick={() => setShowFilters(v => !v)}>
              <Filter size={16} />
              <span className={styles.filterToggleText}>Filters</span>
            </button>
          </form>
        </div>

        <div className={styles.layout}>
          {/* Sidebar filters */}
          <aside className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
            <div className={styles.filterHeader}>
              <h3>Filters</h3>
              {hasFilters && <button className={styles.clearBtn} onClick={clearFilters}>Clear all</button>}
              <button className={styles.closeFiltersBtn} onClick={() => setShowFilters(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>

            {/* Category */}
            <div className={styles.filterGroup}>
              <h4>Category</h4>
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input type="radio" name="cat" checked={!params.category} onChange={() => updateParams({ category: undefined })} />
                  <span>All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat} className={styles.filterOption}>
                    <input
                      type="radio" name="cat"
                      checked={params.category === cat}
                      onChange={() => updateParams({ category: cat })}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className={styles.filterGroup}>
              <h4>Price Range</h4>
              <div className={styles.priceInputs}>
                <div>
                  <label className="label">Min $</label>
                  <input className="input" type="number" placeholder="0"
                    value={params.min_price || ''}
                    onChange={e => updateParams({ min_price: e.target.value ? +e.target.value : undefined })}
                  />
                </div>
                <div>
                  <label className="label">Max $</label>
                  <input className="input" type="number" placeholder="Any"
                    value={params.max_price || ''}
                    onChange={e => updateParams({ max_price: e.target.value ? +e.target.value : undefined })}
                  />
                </div>
              </div>
            </div>

            {/* Featured */}
            <div className={styles.filterGroup}>
              <label className={styles.filterOption}>
                <input
                  type="checkbox"
                  checked={!!params.featured}
                  onChange={e => updateParams({ featured: e.target.checked ? true : undefined })}
                />
                <span>Featured only</span>
              </label>
            </div>
          </aside>

          {/* Product grid */}
          <div className={styles.main}>
            {loading ? (
              <div className={styles.grid}>
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className={styles.empty}>
                <span>🛋️</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className={styles.grid}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            <Pagination page={params.page} totalPages={totalPages} onChange={p => updateParams({ page: p })} />
          </div>
        </div>
      </div>
    </div>
  );
}
