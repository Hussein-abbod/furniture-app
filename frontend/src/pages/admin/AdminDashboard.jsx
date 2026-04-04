import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Layers, AlertTriangle, BarChart2, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend,
} from 'recharts';
import { useStats, useProducts } from '../../hooks/useProducts';
import { getChartData } from '../../utils/api';
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

/* Period toggle pills */
const PERIODS = [
  { key: 'day',   label: 'Daily' },
  { key: 'month', label: 'Monthly' },
  { key: 'year',  label: 'Yearly' },
];

/* Custom tooltip */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: entry.color }} />
          {entry.name}: {entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { stats, loading: statsLoading } = useStats();
  const { products, loading: prodsLoading } = useProducts({ page: 1, page_size: 5 });

  const [period, setPeriod] = useState('month');
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    setChartLoading(true);
    getChartData(period)
      .then(({ data }) => {
        const merged = data.labels.map((label, i) => ({
          name: label,
          Revenue: data.revenue[i],
          Orders: data.orders[i],
        }));
        setChartData(merged);
      })
      .catch(() => setChartData([]))
      .finally(() => setChartLoading(false));
  }, [period]);

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
          sub={`${stats?.total_stock?.toLocaleString() || 0} units available`}
        />
        <StatCard
          icon={BarChart2}
          label="Total Revenue"
          value={statsLoading ? '…' : `$${stats?.total_revenue?.toLocaleString() || 0}`}
          color="var(--orange)"
          sub="All time revenue"
        />
        <StatCard
          icon={Layers}
          label="Total Orders"
          value={statsLoading ? '…' : stats?.total_orders}
          color="#3b82f6"
          sub="Orders placed"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={statsLoading ? '…' : stats?.low_stock_count}
          color="#dc2626"
          sub="Items ≤ 5 units"
        />
      </div>

      {/* ── Chart Section ──────────────────────────────────── */}
      <div className={styles.chartPanel}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitleWrap}>
            <TrendingUp size={20} className={styles.chartIcon} />
            <div>
              <h2 className={styles.chartTitle}>Revenue & Orders</h2>
              <p className={styles.chartSub}>Track your performance over time</p>
            </div>
          </div>
          <div className={styles.periodToggle}>
            {PERIODS.map(({ key, label }) => (
              <button
                key={key}
                className={`${styles.periodBtn} ${period === key ? styles.periodActive : ''}`}
                onClick={() => setPeriod(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.chartBody}>
          {chartLoading ? (
            <div className={styles.chartLoading}>
              <div className={styles.spinner} />
              Loading chart data…
            </div>
          ) : chartData.length === 0 ? (
            <div className={styles.chartEmpty}>
              <BarChart2 size={40} />
              <p>No data available for this period</p>
            </div>
          ) : (
            <div className={styles.chartsRow}>
              {/* Revenue area chart */}
              <div className={styles.chartWrap}>
                <h3 className={styles.chartLabel}>Revenue ($)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0C3B2E" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0C3B2E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#999' }}
                      axisLine={{ stroke: '#e8e8e8' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#999' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#0C3B2E"
                      strokeWidth={2.5}
                      fill="url(#revenueGrad)"
                      dot={{ r: 3, fill: '#0C3B2E', strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#0C3B2E', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Orders bar chart */}
              <div className={styles.chartWrap}>
                <h3 className={styles.chartLabel}>Orders</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#999' }}
                      axisLine={{ stroke: '#e8e8e8' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#999' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="Orders"
                      fill="#b46617"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
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
