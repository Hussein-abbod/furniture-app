import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import styles from './ProductCard.module.css';

const FALLBACK = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600';

export default function ProductCard({ product }) {
  const { id, name, price, image_url, category, stock } = product;

  return (
    <div className={styles.card}>
      <Link to={`/products/${id}`} className={styles.imageWrap}>
        <img
          src={image_url || FALLBACK}
          alt={name}
          onError={e => { e.target.src = FALLBACK; }}
          className={styles.image}
        />
        <div className={styles.overlay}>
          <Eye size={18} /> Quick View
        </div>
        {stock <= 5 && stock > 0 && (
          <span className={`${styles.badge} ${styles.badgeLow}`}>Low Stock</span>
        )}
        {stock === 0 && (
          <span className={`${styles.badge} ${styles.badgeOut}`}>Sold Out</span>
        )}
      </Link>

      <div className={styles.body}>
        <span className={styles.category}>{category}</span>
        <Link to={`/products/${id}`} className={styles.name}>{name}</Link>
        <div className={styles.footer}>
          <span className={styles.price}>${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <Link to={`/products/${id}`} className={`btn btn-primary ${styles.viewBtn}`}>View</Link>
        </div>
      </div>
    </div>
  );
}
