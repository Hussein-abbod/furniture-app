import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Package, Heart, LogOut } from 'lucide-react';
import styles from './Account.module.css';

export default function AccountLayout() {
  const { user, logout } = useAuth();

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.sidebar}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{user?.username}</h3>
            <p>{user?.email}</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <NavLink 
            to="/account/edit" 
            className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <User size={18} /> Profile Settings
          </NavLink>
          <NavLink 
            to="/account/orders" 
            className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <Package size={18} /> Order History
          </NavLink>
          <NavLink 
            to="/account/favorites" 
            className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <Heart size={18} /> Favorites
          </NavLink>
          <button onClick={() => logout()} className={`${styles.navItem} ${styles.logoutBtn}`}>
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
