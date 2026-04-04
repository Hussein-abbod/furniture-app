import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { checkout as apiCheckout, getProfile } from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        setForm({
          name: data.full_name || data.username || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          phone: data.phone || ''
        });
      })
      .catch((err) => {
        console.error('Failed to load profile', err);
      })
      .finally(() => setFetching(false));
  }, []);

  // If cart is empty, user shouldn't be here
  if (cartItems.length === 0) {
    navigate('/cart', { replace: true });
    return null;
  }

  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const { data } = await apiCheckout({
        full_name: form.name,
        address: form.address,
        city: form.city,
        country: form.country,
        phone: form.phone
      });
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={`container ${styles.pageContainer}`} style={{ textAlign: 'center', padding: '5rem' }}>
        <p>Loading checkout details...</p>
      </div>
    );
  }

  return (
    <div className={`container ${styles.pageContainer}`}>
      <h1 className={styles.title}>Checkout</h1>
      
      <div className={styles.layout}>
        {/* Checkout Form */}
        <div className={styles.formSection}>
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input 
                type="text" 
                required 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})}
                
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input 
                type="tel" 
                required 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Address</label>
              <input 
                type="text" 
                required 
                value={form.address} 
                onChange={e => setForm({...form, address: e.target.value})}
                
              />
            </div>
            <div className={styles.rowGroup}>
              <div className={styles.formGroup}>
                <label>City</label>
                <input 
                  type="text" 
                  required 
                  value={form.city} 
                  onChange={e => setForm({...form, city: e.target.value})}
                  
                />
              </div>
              <div className={styles.formGroup}>
                <label>Country</label>
                <input 
                  type="text" 
                  required 
                  value={form.country} 
                  onChange={e => setForm({...form, country: e.target.value})}
                  
                />
              </div>
            </div>

            <div className={styles.paymentMethod}>
              <h3>Payment Method</h3>
              <div className={styles.paymentBox}>
                <input type="radio" checked readOnly />
                <span>Pay on Delivery</span>
              </div>
            </div>

            <button type="submit" disabled={loading} className={`btn btn-primary ${styles.submitBtn}`}>
              {loading ? 'Processing...' : `Place Order • $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </button>
          </form>
        </div>

        {/* Order Review */}
        <div className={styles.reviewSection}>
          <h2>Order Summary</h2>
          <div className={styles.itemsList}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.reviewItem}>
                <div className={styles.itemImageWrap}>
                   <img src={item.product.image_url} alt={item.product.name} />
                   <span className={styles.itemQty}>{item.quantity}</span>
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.product.name}</span>
                  <span className={styles.itemPrice}>${item.product.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          
          <hr className={styles.divider} />
          
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}</span>
          </div>
          
          <hr className={styles.divider} />
          
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
