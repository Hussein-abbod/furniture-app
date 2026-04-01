import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import onyxLogo from '../../assets/images/onyx-logo.png';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, isUser, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/products?category=Living Room', label: 'Living Room' },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src={onyxLogo} alt="ONYX Logo" className={styles.logoImg} />
          <span>ONYX</span>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          {links.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`${styles.link} ${pathname === l.to ? styles.active : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className={styles.actions}>
          
          {isAuthenticated ? (
            <div className={styles.userActions}>
              {isUser && (
                <Link to="/cart" className={styles.iconBtn}>
                  <ShoppingCart size={22} />
                  {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
                </Link>
              )}

              <div className={styles.dropdown}>
                <button className={styles.iconBtn}>
                  {isAdmin ? <LayoutDashboard size={22} /> : <User size={22} />}
                </button>
                <div className={styles.dropdownMenu}>
                  {isAdmin ? (
                    <Link to="/admin/dashboard" className={styles.dropdownItem}>Admin Dashboard</Link>
                  ) : (
                    <>
                      <Link to="/account" className={styles.dropdownItem}><User size={16}/> Profile</Link>
                      <Link to="/account/orders" className={styles.dropdownItem}>Orders</Link>
                      <Link to="/account/favorites" className={styles.dropdownItem}><Heart size={16}/> Favorites</Link>
                    </>
                  )}
                  <button onClick={handleLogout} className={styles.dropdownItem}><LogOut size={16}/> Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/cart" className={styles.iconBtn}>
                <ShoppingCart size={22} />
              </Link>
              <Link to="/login" className={`btn btn-primary ${styles.loginBtn}`}>
                Sign In
              </Link>
            </>
          )}

          <button className={styles.menuBtn} onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {links.map(l => (
            <Link key={l.to} to={l.to} className={styles.mobileLink}>{l.label}</Link>
          ))}
          {isAuthenticated ? (
            <>
              {!isAdmin && <Link to="/cart" className={styles.mobileLink}>Cart ({itemCount})</Link>}
              {!isAdmin && <Link to="/account" className={styles.mobileLink}>My Account</Link>}
              {isAdmin && <Link to="/admin/dashboard" className={styles.mobileLink}>Admin Dashboard</Link>}
              <button onClick={handleLogout} className={styles.mobileLink}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/cart" className={styles.mobileLink}>Cart</Link>
              <Link to="/login" className={styles.mobileLink}>Sign In / Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
