import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import styles from './ProductCard.module.css';
import { useFavorites } from '../../context/FavoritesContext';

const FALLBACK = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600';

export default function ProductCard({ product }) {
  const { id, name, price, image_url, category, stock } = product;
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = isFavorite(id);
  const outOfStock = stock === 0;

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className={`${styles.card} ${outOfStock ? styles.cardDisabled : ''}`}>
      <Link to={`/products/${id}`} className={styles.imageWrap}>
        <img
          src={image_url || FALLBACK}
          alt={name}
          onError={e => { e.target.src = FALLBACK; }}
          className={styles.image}
          loading="lazy"
          decoding="async"
        />

        {/* Favourite — always visible, tappable on mobile */}
        <button
          className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
          onClick={handleFavorite}
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart size={18} fill={isFav ? '#B46617' : 'none'} color={isFav ? '#B46617' : '#555'} />
        </button>

        {/* Quick-view overlay — desktop hover only */}
        <div className={styles.overlay} aria-hidden="true">
          <Eye size={18} />
          <span className={styles.overlayText}>Quick View</span>
        </div>

        {/* Stock badges */}
        {stock > 0 && stock <= 5 && (
          <span className={`${styles.badge} ${styles.badgeLow}`}>Low Stock</span>
        )}
        {outOfStock && (
          <span className={`${styles.badge} ${styles.badgeOut}`}>Sold Out</span>
        )}
      </Link>

      <div className={styles.body}>
        <span className={styles.category}>{category}</span>
        <Link to={`/products/${id}`} className={styles.name} title={name}>
          {name}
        </Link>
        <div className={styles.footer}>
          <span className={styles.price}>
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <Link
            to={`/products/${id}`}
            className={`btn btn-primary ${styles.viewBtn}`}
            aria-label={`View ${name}`}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
