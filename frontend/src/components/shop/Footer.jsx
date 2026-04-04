import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import onyxLogo from '../../assets/images/onyx-logo.png';
import styles from './Footer.module.css';

/* Accordion column — collapses on mobile, always open on desktop */
function FooterCol({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.col}>
      <button
        className={styles.colToggle}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <h4>{title}</h4>
        <ChevronDown size={16} className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>
      <div className={`${styles.colBody} ${open ? styles.colBodyOpen : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
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
        <FooterCol title="Shop">
          <Link to="/products?category=Living Room">Living Room</Link>
          <Link to="/products?category=Bedroom">Bedroom</Link>
          <Link to="/products?category=Dining Room">Dining Room</Link>
          <Link to="/products?category=Office">Office</Link>
          <Link to="/products?category=Outdoor">Outdoor</Link>
        </FooterCol>

        {/* Company */}
        <FooterCol title="Company">
          <Link to="/about">About Us</Link>
          <a href="#">Sustainability</a>
          <a href="#">Press</a>
          <a href="#">Careers</a>
        </FooterCol>

        {/* Contact */}
        <FooterCol title="Contact">
          <span><Mail size={14} /> hello@onyx.store</span>
          <span><Phone size={14} /> +1 (800) 123-4567</span>
          <span><MapPin size={14} /> 100 Design District, NY</span>
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
