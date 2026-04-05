import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, RotateCcw, Award } from 'lucide-react';
import { useFeatured, useCategories } from '../../hooks/useProducts';
import ProductCard from '../../components/shop/ProductCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import styles from './Home.module.css';
import Threads from '../../components/ui/Threads';
import heroBg from '../../assets/images/handcrafted-wooden-decorative-sculpture.jpg';
import FeaturesCarousel from '../../components/ui/FeaturesCarousel';
import useScrollRevealCards from '../../hooks/useScrollRevealCards';
import { useState, useEffect, useRef } from 'react';

const CATEGORY_IMAGES = {
  'Living Room': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
  'Bedroom':     'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
  'Dining Room': 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600',
  'Office':      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
  'Outdoor':     'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600',
  'Kitchen':     'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
};

const PERKS = [
  { Icon: Truck,      title: 'Free Delivery',   desc: 'On orders over $500' },
  { Icon: Shield,     title: '5-Year Warranty',  desc: 'Craftsmanship guarantee' },
  { Icon: RotateCcw,  title: '30-Day Returns',   desc: 'Hassle-free policy' },
  { Icon: Star,       title: 'Premium Quality',  desc: 'Sustainably sourced' },
];

export default function Home() {
  const { products, loading } = useFeatured();
  const categories = useCategories();
  const { setCardRef, visibleSet } = useScrollRevealCards({ staggerMs: 90 });
  
  const [visibleCategories, setVisibleCategories] = useState(new Set());
  const categoryRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let hasNew = false;
        const newSet = new Set();
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            newSet.add(index);
            hasNew = true;
            observer.unobserve(entry.target);
          }
        });

        if (hasNew) {
          setVisibleCategories(prev => {
            const updated = new Set(prev);
            newSet.forEach(item => updated.add(item));
            return updated;
          });
        }
      },
      { threshold: 0.1 }
    );
    
    // Copy the ref array so we don't hold the lock, standard practice
    const elements = categoryRefs.current;
    elements.forEach(el => {
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Threads
            amplitude={1.6}
            distance={0.2}
            enableMouseInteraction={false}
            color={[0.1, 0.4, 0.2]}
          />
        </div>
        <div className={`container ${styles.heroInner}`} style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.heroText}>

            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              New Collection 2026
            </div>

            <h1 className={styles.heroHeading}>
              Design Spaces<br/>
              <em>You'll Love</em>
            </h1>
            <p className={styles.heroSub}>
              Thoughtfully crafted furniture that transforms your house into a home.
              Explore our curated collection of premium pieces.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/products" className="btn btn-primary">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/products?featured=true" className="btn btn-outline">
                View Featured
              </Link>
            </div>

            <div className={styles.heroStats}>
              {[['500+','Products'],['12K+','Happy Customers'],['50+','Designers']].map(([n, l]) => (
                <div key={l} className={styles.stat}>
                  <strong>{n}</strong><span>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroImages}>
            <div className={styles.imgHero}>
              <img src={heroBg} alt="Modern premium furniture" />
            </div>
            <div className={styles.heroFloatingCard}>
              <div className={styles.heroFloatingIcon}>
                <Award size={20} />
              </div>
              <div>
                <strong>Award Winning</strong>
                <span>Best Furniture Design 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.scrollHint}>
          <div className={styles.scrollDot} />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Perks */}
      <section className={styles.perks}>
        <div className="container">
          <FeaturesCarousel perks={PERKS} />
        </div>
      </section>

      {/* Categories */}
      <section className={`section ${styles.categoriesSection}`}>
        <div className="container">
          <div className={`${styles.sectionHead} ${styles.categorySectionHead}`}>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
          </div>
          <div className={styles.categoriesGrid}>
            {(categories.length ? categories : Object.keys(CATEGORY_IMAGES)).slice(0, 6).map((cat, idx) => (
              <Link 
                key={cat} 
                ref={el => categoryRefs.current[idx] = el}
                data-index={idx}
                to={`/products?category=${encodeURIComponent(cat)}`} 
                className={`${styles.catCard} ${visibleCategories.has(idx) ? styles.visible : ''}`}
                style={{ transitionDelay: `${(idx % 3) * 0.1}s` }}
              >
                <img src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES['Living Room']} alt={cat} />
                <div className={styles.catOverlay}>
                  <span>{cat}</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className={styles.banner}>
        <div className="container">
          <div className={styles.bannerInner}>
            <div className={styles.bannerText}>
              <h2>Crafted for the way you live.</h2>
              <p>Every piece is designed with purpose — to be beautiful, functional, and built to last.</p>
              <Link to="/products" className="btn btn-primary">
                Explore All Products <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.bannerImg}>
              <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700" alt="Bedroom" />
            </div>
          </div>
        </div>
      </section>
     
      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--green-100)', marginTop: -1 }}>
        <div className="container">
          <div className={styles.sectionHead}>

            <h2 className={styles.sectionTitle}>Featured Collection</h2>
            <Link to="/products?featured=true" className={`btn btn-ghost ${styles.seeAll}`}>
              See all <ArrowRight size={15} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : products.slice(0, 8).map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    ref={setCardRef(i)}
                    data-card-index={i}
                    revealed={visibleSet.has(i)}
                  />
                ))
            }
          </div>
        </div>
      </section>

    </div>
  );
}
