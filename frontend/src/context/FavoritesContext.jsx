import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFavorites, toggleFavorite as apiToggleFavorite } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated, isUser } = useAuth();
  const [favorites, setFavorites] = useState([]); // List of Favorited Product IDs
  const [favoriteItems, setFavoriteItems] = useState([]); // List of Favorite Objects

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated || !isUser) {
      setFavorites([]);
      setFavoriteItems([]);
      return;
    }
    try {
      const { data } = await getFavorites();
      setFavoriteItems(data);
      setFavorites(data.map(f => f.product_id));
    } catch (e) {
      console.error('Failed to fetch favorites', e);
    }
  }, [isAuthenticated, isUser]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (productId) => {
    if (!isAuthenticated || !isUser) {
        toast.error('Please login to save favorites');
        return false;
    }
    try {
      // Optimistic upate
      const isFav = favorites.includes(productId);
      if (isFav) {
          setFavorites(prev => prev.filter(id => id !== productId));
      } else {
          setFavorites(prev => [...prev, productId]);
      }
      
      await apiToggleFavorite(productId);
      await fetchFavorites(); // re-sync
      return true;
    } catch (e) {
      toast.error('Failed to update favorites');
      await fetchFavorites(); // revert optimistic update
      return false;
    }
  };

  const isFavorite = (productId) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      favoriteItems,
      toggleFavorite,
      isFavorite,
      fetchFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
