import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Tag, Layers, CheckCircle, XCircle, Heart } from 'lucide-react';
import { getProduct } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import styles from './ProductDetail.module.css';

const FALLBACK = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.grid}>
          <div className={`skeleton ${styles.imgSkeleton}`} />
          <div className={styles.infoSkeleton}>
            {[200, 280, 120, 160, 100].map((w, i) => (
              <div key={i} className={`skeleton ${styles.line}`} style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.error}>
          <h2>Product not found</h2>
          <Link to="/products" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    </div>
  );

  const inStock = product.stock > 0;
  const isFav = isFavorite(product.id);

  return (
    <div className={`${styles.page} page-enter`}>
      <div className="container">
        <Link to="/products" className={styles.back}>
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className={styles.grid}>
          {/* Image */}
          <div className={styles.imageWrap}>
            <img
              src={product.image_url || FALLBACK}
              alt={product.name}
              onError={e => { e.target.src = FALLBACK; }}
              className={styles.image}
            />
            {!inStock && <div className={styles.soldOut}>Sold Out</div>}
          </div>

          {/* Info */}
          <div className={styles.info}>
            <div className={styles.meta}>
              <span className={`badge badge-green`}>{product.category}</span>
              {product.is_featured === 1 && <span className="badge badge-orange">Featured</span>}
            </div>

            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.price}>
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>

            <p className={styles.description}>{product.description || 'A beautifully crafted furniture piece for your home.'}</p>

            <div className={styles.details}>
              <div className={styles.detail}>
                <Tag size={16} />
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{product.category}</span>
              </div>
              <div className={styles.detail}>
                <Package size={16} />
                <span className={styles.detailLabel}>Stock</span>
                <span className={styles.detailValue}>{product.stock} units</span>
              </div>
              <div className={styles.detail}>
                <Layers size={16} />
                <span className={styles.detailLabel}>Availability</span>
                <span className={`${styles.detailValue} ${inStock ? styles.inStock : styles.outStock}`}>
                  {inStock ? <><CheckCircle size={14} /> In Stock</> : <><XCircle size={14} /> Out of Stock</>}
                </span>
              </div>
            </div>

            <div className={styles.actions} style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                className="btn btn-primary" 
                disabled={!inStock}
                onClick={() => addToCart(product.id, 1)}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}
              >
                <Package size={18} /> {inStock ? 'Add to Cart' : 'Sold Out'}
              </button>
              
              <button 
                className="btn btn-outline" 
                onClick={() => toggleFavorite(product.id)}
                style={{ padding: '0 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                title={isFav ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart size={20} fill={isFav ? '#B46617' : 'none'} color={isFav ? '#B46617' : '#333'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className={styles.trust}>
              {['Free shipping over $500','5-year warranty','30-day returns'].map(t => (
                <div key={t} className={styles.trustItem}>
                  <CheckCircle size={14} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
