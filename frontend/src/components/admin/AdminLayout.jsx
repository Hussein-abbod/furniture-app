import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, Plus, LogOut,
  Menu, X, ChevronRight
} from 'lucide-react';
import onyxLogo from '../../assets/images/onyx-logo.png';
import styles from './AdminLayout.module.css';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products',  icon: Package,         label: 'Products' },
  { to: '/admin/products/new', icon: Plus,          label: 'Add Product' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link to="/admin/dashboard" className={styles.logo}>
            <img src={onyxLogo} alt="ONYX Logo" className={styles.logoImg} />
            {!collapsed && <span>ONYX</span>}
          </Link>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(v => !v)}>
            {collapsed ? <ChevronRight size={16} /> : <X size={16} />}
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.navItem} ${pathname === to ? styles.active : ''}`}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          {!collapsed && (
            <div className={styles.adminBadge}>
              <div className={styles.avatar}>{admin?.username?.[0]?.toUpperCase()}</div>
              <div>
                <div className={styles.adminName}>{admin?.username}</div>
                <div className={styles.adminRole}>Administrator</div>
              </div>
            </div>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setCollapsed(v => !v)}>
            <Menu size={20} />
          </button>
          <div className={styles.topbarRight}>
            <Link to="/" target="_blank" className="btn btn-ghost" style={{ fontSize: '.82rem' }}>
              View Store ↗
            </Link>
          </div>
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
