import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, AlertCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllOrdersAdmin, updateOrderStatus } from '../../utils/api';
import styles from './AdminOrders.module.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await getAllOrdersAdmin();
      setOrders(data);
    } catch (e) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast.success('Order status updated');
      
      // Update local state to avoid full refetch
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toString().includes(search) || 
    (o.shipping_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    pending: '#B46617',
    confirmed: '#6D9773',
    shipped: '#0c3b2e',
    delivered: '#137333',
  };

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.sub}>Manage customer orders and fulfillments</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search by Order ID or Customer Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.panel}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>

              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5}>
                        <div className={`skeleton ${styles.skLine}`} style={{height: '24px'}} />
                      </td>
                    </tr>
                  ))
                : filteredOrders.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} className={styles.empty}>
                        <AlertCircle size={32} />
                        <span>No orders found</span>
                      </td>
                    </tr>
                  )
                  : filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td className={styles.fw500}>#{o.id.toString().padStart(6, '0')}</td>
                      <td>
                        <div className={styles.customerCell}>
                          <span>{o.shipping_name || o.user?.full_name || o.user?.username || `User #${o.user_id}`}</span>
                          <span className={styles.subtext}>{o.shipping_city}, {o.shipping_country}</span>
                        </div>
                      </td>
                      <td className={styles.dateCell}>{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className={styles.priceCell}>${o.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>
                        <select 
                          className={styles.statusSelect}
                          style={{ color: statusColors[o.status] || '#333' }}
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>

                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
