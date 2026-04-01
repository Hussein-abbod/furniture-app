import { useFavorites } from '../../context/FavoritesContext';
import ProductCard from '../../components/shop/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import styles from './Account.module.css';

export default function Favorites() {
  const { favoriteItems } = useFavorites();

  return (
    <>
      <h2 className={styles.pageTitle}>My Favorites</h2>

      {favoriteItems.length === 0 ? (
        <div className="text-center py-10" style={{ color: '#666' }}>
          <Heart size={48} className="mx-auto mb-4" color="#ccc" />
          <h3 style={{fontFamily: 'Outfit', color: '#0c3b2e', marginBottom: '0.5rem'}}>No favorites yet</h3>
          <p>You haven't saved any products to your favorites.</p>
          <Link to="/products" className="btn btn-primary mt-4 inline-block">Discover Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
          {favoriteItems.map(fav => (
            <ProductCard key={fav.product.id} product={fav.product} />
          ))}
        </div>
      )}
    </>
  );
}
