import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import onyxLogo from '../../assets/images/onyx-logo.png';
import { getSiteSettings } from '../../utils/api';
import styles from './Footer.module.css';

/* Accordion column — collapses on mobile, always open on desktop */
function FooterCol({ title, children, to }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleHeaderClick = (e) => {
    // If it's a link (like "Shop"), navigate smoothly
    if (to) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(to);
    } else {
      // Otherwise just toggle accordion on mobile
      setOpen(o => !o);
    }
  };

  return (
    <div className={styles.col}>
      <button
        className={`${styles.colToggle} ${to ? styles.colToggleLink : ''}`}
        onClick={handleHeaderClick}
        aria-expanded={open}
      >
        <h4>{title}</h4>
        {!to && <ChevronDown size={16} className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />}
      </button>
      <div className={`${styles.colBody} ${open ? styles.colBodyOpen : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    contact_email: 'husseinobood88@gmail.com',
    contact_phone: '+60 1111769177',
    contact_address: 'Puncak Muzaffar, 75450 Ayer Keroh, Malacca',
  });

  useEffect(() => {
    getSiteSettings()
      .then(({ data }) => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const handleLinkClick = (to) => (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(to);
  };

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Brand — always expanded */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img src={onyxLogo} alt="ONYX Logo" className={styles.logoImg} />
            <span>ONYX</span>
          </div>
          <p>Curated furniture for modern living. Crafted with intention, designed to last.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
          </div>
        </div>

        {/* Shop */}
        <FooterCol title="Shop" to="/products">
          <Link to="/products?category=Living Room" onClick={handleLinkClick("/products?category=Living Room")}>Living Room</Link>
          <Link to="/products?category=Bedroom" onClick={handleLinkClick("/products?category=Bedroom")}>Bedroom</Link>
          <Link to="/products?category=Dining Room" onClick={handleLinkClick("/products?category=Dining Room")}>Dining Room</Link>
          <Link to="/products?category=Office" onClick={handleLinkClick("/products?category=Office")}>Office</Link>
          <Link to="/products?category=Outdoor" onClick={handleLinkClick("/products?category=Outdoor")}>Outdoor</Link>
        </FooterCol>

        {/* Company */}
        <FooterCol title="Company">
          <Link to="/about" onClick={handleLinkClick("/about")}>About Us</Link>
          <Link to="/contact" onClick={handleLinkClick("/contact")}>Contact Us</Link>
          <a href="#">Sustainability</a>
          <a href="#">Careers</a>
        </FooterCol>

        <FooterCol title="Contact">
          <span><Mail size={14} /> {settings.contact_email}</span>
          <span><Phone size={14} /> {settings.contact_phone}</span>
          <span><MapPin size={14} /> {settings.contact_address?.split(',').slice(0, 3).join(',')}</span>
        </FooterCol>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} ONYX Furniture. All rights reserved.</p>
        <div className={styles.legal}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
