import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Heart, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import onyxLogo from '../../assets/images/onyx-logo.png';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { pathname }                  = useLocation();
  const navigate                      = useNavigate();
  const dropdownRef                   = useRef(null);

  const { isAuthenticated, isUser, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  /* Check if a link is active */
  const isActive = (to) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <img src={onyxLogo} alt="ONYX Logo" className={styles.logoImg} />
            <span>ONYX</span>
          </Link>

          {/* Desktop nav links */}
          <ul className={styles.links}>
            {links.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`${styles.link} ${isActive(l.to) ? styles.active : ''}`}
                >
                  {l.label}
                  <span className={styles.linkUnderline} />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className={styles.actions}>
            {isAuthenticated ? (
              <div className={styles.userActions}>
                {isUser && (
                  <Link to="/cart" className={styles.iconBtn} aria-label="Cart">
                    <ShoppingCart size={22} />
                    {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
                  </Link>
                )}

                {/* User dropdown — click-toggled for touch compatibility */}
                <div className={styles.dropdown} ref={dropdownRef}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => setDropdownOpen(o => !o)}
                    aria-expanded={dropdownOpen}
                    aria-label="Account menu"
                  >
                    {isAdmin ? <LayoutDashboard size={22} /> : <User size={22} />}
                  </button>

                  {dropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      {isAdmin ? (
                        <Link to="/admin/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                          Admin Dashboard
                        </Link>
                      ) : (
                        <>
                          <Link to="/account/edit" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <User size={16} /> Profile
                          </Link>
                          <Link to="/account/orders" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <Package size={16} /> Orders
                          </Link>
                          <Link to="/account/favorites" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <Heart size={16} /> Favorites
                          </Link>
                        </>
                      )}
                      <button onClick={handleLogout} className={styles.dropdownItem}>
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/cart" className={styles.iconBtn} aria-label="Cart">
                  <ShoppingCart size={22} />
                </Link>
                <Link to="/login" className={`btn btn-primary ${styles.loginBtn}`}>
                  Sign In
                </Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuInner}>
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`${styles.mobileLink} ${isActive(l.to) ? styles.mobileLinkActive : ''}`}
                >
                  {l.label}
                </Link>
              ))}

              <div className={styles.mobileDivider} />

              {isAuthenticated ? (
                <>
                  {!isAdmin && (
                    <Link to="/cart" className={styles.mobileLink}>
                      <ShoppingCart size={18} />
                      Cart {itemCount > 0 && <span className={styles.mobileBadge}>{itemCount}</span>}
                    </Link>
                  )}
                  {!isAdmin && (
                    <Link to="/account/edit" className={styles.mobileLink}>
                      <User size={18} /> My Account
                    </Link>
                  )}
                  {!isAdmin && (
                    <Link to="/account/favorites" className={styles.mobileLink}>
                      <Heart size={18} /> Favorites
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin/dashboard" className={styles.mobileLink}>
                      <LayoutDashboard size={18} /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className={`${styles.mobileLink} ${styles.mobileLinkLogout}`}>
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/cart" className={styles.mobileLink}>
                    <ShoppingCart size={18} /> Cart
                  </Link>
                  <Link to="/login" className={styles.mobileLink}>
                    <User size={18} /> Sign In / Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop — closes menu when tapping outside */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
    </>
  );
}
