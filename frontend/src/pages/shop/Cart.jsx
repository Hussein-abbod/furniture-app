import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import styles from './Cart.module.css';

const FALLBACK = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600';

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, subtotal, loading } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="container py-20 text-center">Loading cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className={`container ${styles.emptyCart}`}>
        <ShoppingBag size={64} className={styles.emptyIcon} />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary mt-4">Start Shopping</Link>
      </div>
    );
  }

  const shipping = subtotal > 500 ? 0 : 50;

  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>Shopping Cart</h1>
      
      <div className={styles.layout}>
        {/* Cart Items List */}
        <div className={styles.itemsList}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <img 
                src={item.product.image_url || FALLBACK} 
                alt={item.product.name} 
                className={styles.itemImage}
                onError={(e) => { e.target.src = FALLBACK; }} 
              />
              
              <div className={styles.itemDetails}>
                <Link to={`/products/${item.product.id}`} className={styles.itemName}>
                  {item.product.name}
                </Link>
                <span className={styles.itemCategory}>{item.product.category}</span>
                <div className={styles.itemPrice}>
                  ${item.product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className={styles.quantityControls}>
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                  className={styles.qtyBtn}
                >
                  <Minus size={16} />
                </button>
                <span className={styles.qtyValue}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className={styles.qtyBtn}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className={styles.itemSubtotal}>
                ${(item.product.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>

              <button onClick={() => removeItem(item.id)} className={styles.removeBtn} title="Remove item">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className={styles.summarySidebar}>
          <h3>Order Summary</h3>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Estimated Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}</span>
          </div>
          <hr className={styles.summaryDivider} />
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>${(subtotal + shipping).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <button 
            className={`btn btn-primary ${styles.checkoutBtn}`}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          
          <Link to="/products" className={styles.continueLink}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
