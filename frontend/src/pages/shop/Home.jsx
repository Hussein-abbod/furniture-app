import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { useFeatured, useCategories } from '../../hooks/useProducts';
import ProductCard from '../../components/shop/ProductCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import styles from './Home.module.css';

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

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className="badge badge-green">New Collection 2025</span>
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
            <div className={styles.imgMain}>
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900" alt="Featured sofa" />
            </div>
            <div className={styles.imgStack}>
              <img src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400" alt="Chair" />
              <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400" alt="Table" />
            </div>
          </div>
        </div>

        <div className={styles.scrollHint}>
          <div className={styles.scrollDot} />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Perks */}
      <section className={`section-sm ${styles.perks}`}>
        <div className="container">
          <div className={styles.perksGrid}>
            {PERKS.map(({ Icon, title, desc }) => (
              <div key={title} className={styles.perk}>
                <div className={styles.perkIcon}><Icon size={22} /></div>
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHead}>
            <span className="badge badge-green">Browse By Room</span>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
          </div>
          <div className={styles.categoriesGrid}>
            {(categories.length ? categories : Object.keys(CATEGORY_IMAGES)).slice(0, 6).map(cat => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className={styles.catCard}>
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

      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--green-100)', marginTop: -1 }}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className="badge badge-orange">Editor's Picks</span>
            <h2 className={styles.sectionTitle}>Featured Collection</h2>
            <Link to="/products?featured=true" className={`btn btn-ghost ${styles.seeAll}`}>
              See all <ArrowRight size={15} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)
            }
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
    </div>
  );
}
