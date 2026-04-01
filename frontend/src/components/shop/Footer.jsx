import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import onyxLogo from '../../assets/images/onyx-logo.png';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}><img src={onyxLogo} alt="ONYX Logo" className={styles.logoImg} /><span>ONYX</span></div>
          <p>Curated furniture for modern living. Crafted with intention, designed to last.</p>
          <div className={styles.socials}>
            <a href="#"><Instagram size={18} /></a>
            <a href="#"><Twitter size={18} /></a>
            <a href="#"><Facebook size={18} /></a>
          </div>
        </div>

        {/* Shop */}
        <div className={styles.col}>
          <h4>Shop</h4>
          <Link to="/products?category=Living Room">Living Room</Link>
          <Link to="/products?category=Bedroom">Bedroom</Link>
          <Link to="/products?category=Dining Room">Dining Room</Link>
          <Link to="/products?category=Office">Office</Link>
          <Link to="/products?category=Outdoor">Outdoor</Link>
        </div>

        {/* Info */}
        <div className={styles.col}>
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Sustainability</a>
          <a href="#">Press</a>
          <a href="#">Careers</a>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <h4>Contact</h4>
          <span><Mail size={14} /> hello@onyx.store</span>
          <span><Phone size={14} /> +1 (800) 123-4567</span>
          <span><MapPin size={14} /> 100 Design District, NY</span>
        </div>
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
