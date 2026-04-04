import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../../utils/api';
import { CheckCircle2, Package, Printer, ClipboardList, CheckCircle, Truck, PackageCheck } from 'lucide-react';
import styles from './OrderConfirmation.module.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id)
      .then(({ data }) => setOrder(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container py-20 text-center">Loading invoice...</div>;
  if (!order) return <div className="container py-20 text-center">Order not found</div>;

  const handlePrint = () => {
    window.print();
  };

  const statusColor = {
    pending: '#FFBA00',
    confirmed: '#6D9773',
    shipped: '#0c3b2e',
    delivered: '#B46617'
  }[order.status] || '#666';

  const orderStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];
  const currentStatusIndex = orderStatuses.indexOf(order.status);
  
  // Calculate fill percentage for the connecting line
  // 3 segments total to connect 4 dots. (0% for index 0, 33% for index 1, 66% for index 2, 100% for index 3)
  const lineProgress = currentStatusIndex === -1 ? 0 : (currentStatusIndex / (orderStatuses.length - 1)) * 100;

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.trackerCard} id="order-tracker">
        <h3 className={styles.trackerTitle}>Track Your Order</h3>
        <div className={styles.trackerSteps}>
          <div className={styles.trackerLineBg}>
            <div className={styles.trackerLineFill} style={{ width: `${lineProgress}%` }}></div>
          </div>
          
          <div className={`${styles.stepItem} ${currentStatusIndex >= 0 ? styles.completed : ''} ${currentStatusIndex === 0 ? styles.active : ''}`}>
            <div className={styles.stepIconWrapper}>
              <ClipboardList size={22} />
            </div>
            <span className={styles.stepLabel}>Pending</span>
          </div>

          <div className={`${styles.stepItem} ${currentStatusIndex >= 1 ? styles.completed : ''} ${currentStatusIndex === 1 ? styles.active : ''}`}>
            <div className={styles.stepIconWrapper}>
              <CheckCircle size={22} />
            </div>
            <span className={styles.stepLabel}>Confirmed</span>
          </div>

          <div className={`${styles.stepItem} ${currentStatusIndex >= 2 ? styles.completed : ''} ${currentStatusIndex === 2 ? styles.active : ''}`}>
            <div className={styles.stepIconWrapper}>
              <Truck size={22} />
            </div>
            <span className={styles.stepLabel}>Shipped</span>
          </div>

          <div className={`${styles.stepItem} ${currentStatusIndex >= 3 ? styles.completed : ''} ${currentStatusIndex === 3 ? styles.active : ''}`}>
            <div className={styles.stepIconWrapper}>
              <PackageCheck size={22} />
            </div>
            <span className={styles.stepLabel}>Delivered</span>
          </div>
        </div>
      </div>

      <div className={styles.invoiceCard} id="printable-invoice">
        <div className={styles.invoiceHeader}>
          <div className={styles.brand}>
            <CheckCircle2 size={48} className={styles.successIcon} />
            <h1>Thank you for your order!</h1>
            <p>We've received your order and are processing it.</p>
          </div>
          <button onClick={handlePrint} className={`btn btn-outline ${styles.printBtn}`}>
            <Printer size={18} /> Print Invoice
          </button>
        </div>

        <div className={styles.invoiceMeta}>
          <div className={styles.metaGroup}>
            <span>Order Number</span>
            <strong>#{order.id.toString().padStart(6, '0')}</strong>
          </div>
          <div className={styles.metaGroup}>
            <span>Date</span>
            <strong>{new Date(order.created_at).toLocaleDateString()}</strong>
          </div>
          <div className={styles.metaGroup}>
            <span>Status</span>
            <strong style={{ color: statusColor, textTransform: 'capitalize' }}>
              {order.status}
            </strong>
          </div>
        </div>

        <div className={styles.itemsSection}>
          <h2>Order Items</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.itemNameWrapper}>
                      <Package size={16} className={styles.itemIcon} />
                      {item.product?.name || 'Unknown Product'}
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">${item.unit_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="text-right">${(item.quantity * item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.totalsSection}>
          <div className={styles.totalsGroup}>
            <div className={styles.totalsRow}>
              <span>Order Total</span>
              <strong>${order.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        <Link to="/account/orders" className="btn btn-outline">View Order History</Link>
      </div>
    </div>
  );
}
