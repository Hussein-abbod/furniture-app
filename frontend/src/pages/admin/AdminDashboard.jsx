import { Link } from 'react-router-dom';
import { Package, Layers, AlertTriangle, BarChart2, Plus, ArrowRight } from 'lucide-react';
import { useStats, useProducts } from '../../hooks/useProducts';
import styles from './AdminDashboard.module.css';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className={styles.statCard} style={{ '--accent': color }}>
      <div className={styles.statIcon}><Icon size={22} /></div>
      <div className={styles.statBody}>
        <div className={styles.statValue}>{value ?? '—'}</div>
        <div className={styles.statLabel}>{label}</div>
        {sub && <div className={styles.statSub}>{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { stats, loading: statsLoading } = useStats();
  const { products, loading: prodsLoading } = useProducts({ page: 1, page_size: 5 });

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.sub}>Welcome back — here's what's happening in your store.</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={Package}
          label="Total Products"
          value={statsLoading ? '…' : stats?.total_products}
          color="var(--green-700)"
          sub="In catalogue"
        />
        <StatCard
          icon={Layers}
          label="Total Stock"
          value={statsLoading ? '…' : stats?.total_stock?.toLocaleString()}
          color="var(--orange)"
          sub="Units available"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={statsLoading ? '…' : stats?.low_stock_count}
          color="#dc2626"
          sub="Items ≤ 5 units"
        />
        <StatCard
          icon={BarChart2}
          label="Categories"
          value={statsLoading ? '…' : stats?.categories?.length}
          color="var(--yellow)"
          sub="Active categories"
        />
      </div>

      <div className={styles.twoCol}>
        {/* Recent products */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Recent Products</h2>
            <Link to="/admin/products" className={styles.panelLink}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
            </div>
            {prodsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={styles.tableRowSkeleton}>
                    <div className={`skeleton ${styles.skLine}`} style={{ width: '60%' }} />
                    <div className={`skeleton ${styles.skLine}`} style={{ width: '40%' }} />
                    <div className={`skeleton ${styles.skLine}`} style={{ width: '30%' }} />
                    <div className={`skeleton ${styles.skLine}`} style={{ width: '25%' }} />
                  </div>
                ))
              : products.map(p => (
                  <Link key={p.id} to={`/admin/products/${p.id}/edit`} className={styles.tableRow}>
                    <div className={styles.productCell}>
                      <img src={p.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80'} alt={p.name}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80'; }}
                      />
                      <span>{p.name}</span>
                    </div>
                    <span className="badge badge-green">{p.category}</span>
                    <span className={styles.priceCell}>${p.price.toFixed(2)}</span>
                    <span className={p.stock <= 5 ? styles.lowStock : styles.normalStock}>{p.stock}</span>
                  </Link>
                ))
            }
          </div>
        </div>

        {/* Categories chart */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>By Category</h2>
          </div>
          {statsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.catRow}>
                  <div className={`skeleton ${styles.skLine}`} style={{ width: '40%' }} />
                  <div className={`skeleton ${styles.skBar}`} />
                </div>
              ))
            : stats?.categories?.map(({ name, count }) => {
                const max = Math.max(...(stats.categories.map(c => c.count)));
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={name} className={styles.catRow}>
                    <span className={styles.catName}>{name}</span>
                    <div className={styles.barWrap}>
                      <div className={styles.bar} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={styles.catCount}>{count}</span>
                  </div>
                );
              })
          }
        </div>
      </div>
    </div>
  );
}
