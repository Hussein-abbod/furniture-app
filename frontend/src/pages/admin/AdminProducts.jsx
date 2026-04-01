import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts } from '../../hooks/useProducts';
import { deleteProduct } from '../../utils/api';
import Pagination from '../../components/ui/Pagination';
import styles from './AdminProducts.module.css';

const FALLBACK = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const { products, total, totalPages, loading, params, updateParams, refetch } = useProducts({ page: 1, page_size: 10 });

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: search || undefined, page: 1 });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      refetch();
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.sub}>{total} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-outline" style={{ padding: '10px 20px' }}>Search</button>
        </form>
      </div>

      {/* Table */}
      <div className={styles.panel}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j}><div className={`skeleton ${styles.skLine}`} /></td>
                      ))}
                    </tr>
                  ))
                : products.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className={styles.empty}>
                        <AlertCircle size={32} />
                        <span>No products found</span>
                      </td>
                    </tr>
                  )
                  : products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className={styles.productCell}>
                          <img
                            src={p.image_url || FALLBACK}
                            alt={p.name}
                            onError={e => { e.target.src = FALLBACK; }}
                          />
                          <div>
                            <div className={styles.prodName}>{p.name}</div>
                            <div className={styles.prodId}>ID #{p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-green">{p.category}</span></td>
                      <td className={styles.priceCell}>${p.price.toFixed(2)}</td>
                      <td>
                        <span className={p.stock === 0 ? styles.stockOut : p.stock <= 5 ? styles.stockLow : styles.stockOk}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        {p.is_featured === 1
                          ? <span className="badge badge-orange">Featured</span>
                          : <span style={{ color: 'var(--text-light)', fontSize: '.8rem' }}>—</span>
                        }
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link to={`/admin/products/${p.id}/edit`} className={`${styles.actionBtn} ${styles.editBtn}`}>
                            <Pencil size={15} />
                          </Link>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => setConfirmId(p.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        <Pagination page={params.page} totalPages={totalPages} onChange={p => updateParams({ page: p })} />
      </div>

      {/* Delete confirm modal */}
      {confirmId && (
        <div className={styles.overlay} onClick={() => setConfirmId(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}><Trash2 size={28} /></div>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone. The product will be permanently removed.</p>
            <div className={styles.modalActions}>
              <button className="btn btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn btn-orange" onClick={() => handleDelete(confirmId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
