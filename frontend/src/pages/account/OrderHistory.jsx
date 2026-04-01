import { useState, useEffect } from 'react';
import { getMyOrders } from '../../utils/api';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import styles from './Account.module.css';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-10" style={{ color: '#666' }}>
        <PackageOpen size={48} className="mx-auto mb-4" color="#ccc" />
        <h3 style={{fontFamily: 'Outfit', color: '#0c3b2e', marginBottom: '0.5rem'}}>No orders yet</h3>
        <p>You haven't placed any orders. Start exploring our shop!</p>
        <Link to="/products" className="btn btn-primary mt-4 inline-block">Explore Products</Link>
      </div>
    );
  }

  const statusColors = {
    pending: { bg: '#fef3e2', color: '#B46617' },
    confirmed: { bg: '#eef2ee', color: '#6D9773' },
    shipped: { bg: '#eef2ee', color: '#0c3b2e' },
    delivered: { bg: '#e6f4ea', color: '#137333' },
  };

  return (
    <>
      <h2 className={styles.pageTitle}>Order History</h2>
      
      <div className={styles.ordersList}>
        {orders.map(order => {
          const sc = statusColors[order.status] || { bg: '#eee', color: '#333' };
          
          return (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderInfo}>
                <Link to={`/orders/${order.id}`} style={{textDecoration: 'none'}}>
                  <h4>Order #{order.id.toString().padStart(6, '0')}</h4>
                </Link>
                <div className={styles.orderMeta}>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>${order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span>•</span>
                  <span>{order.items?.length || 0} item(s)</span>
                </div>
              </div>
              
              <div className={styles.orderActions}>
                <span 
                  className={styles.statusBadge} 
                  style={{ background: sc.bg, color: sc.color }}
                >
                  {order.status}
                </span>
                <Link 
                  to={`/orders/${order.id}`} 
                  className="btn btn-outline" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginLeft: '1rem' }}
                >
                  View details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
