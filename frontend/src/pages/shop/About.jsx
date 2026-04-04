import { Link } from 'react-router-dom';
import {
  Layers, Shield, Clock, Leaf, ArrowRight,
  MapPin, Users, Package, Globe
} from 'lucide-react';
import styles from './About.module.css';

const STATS = [
  { num: '9+',   label: 'Years in business',  Icon: Clock   },
  { num: '500+', label: 'Products designed',   Icon: Package },
  { num: '12K+', label: 'Happy customers',     Icon: Users   },
  { num: '18',   label: 'Countries served',    Icon: Globe   },
];

const VALUES = [
  {
    Icon: Layers,
    title: 'Uncompromising craft',
    desc: 'We work only with artisans who treat furniture-making as a vocation, not a job. Every piece undergoes a 47-point quality inspection before it leaves the workshop floor.',
  },
  {
    Icon: Shield,
    title: 'Radical transparency',
    desc: 'We publish our material sources, our margin, and our carbon footprint — because trust isn\'t built with marketing copy. It\'s built with receipts.',
  },
  {
    Icon: Clock,
    title: 'Designed to last',
    desc: 'Fast furniture is a contradiction in terms. We design for 25-year life cycles, offer a 5-year warranty on every product, and provide free repair kits for all hardware.',
  },
];

const TEAM = [
  {
    initials: 'KA',
    name: 'Khalid Al-Mansouri',
    role: 'Co-founder & CEO',
    bio: 'Former architect with 15 years in residential design. Obsessed with the intersection of form and daily life.',
    color: '#0C3B2E',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800',
  },
  {
    initials: 'SR',
    name: 'Sara Rashid',
    role: 'Co-founder & Creative Director',
    bio: 'Trained in Milan, built her first collection from reclaimed Dubai dhow wood. Believes constraint breeds creativity.',
    color: '#2d5c40',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
  },
  {
    initials: 'MN',
    name: 'Marco Neri',
    role: 'Head of Craftsmanship',
    bio: 'Third-generation cabinetmaker from Florence. Joined Onyx to bring old-world joinery techniques to modern design.',
    color: '#4a3828',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800',
  },
  {
    initials: 'LA',
    name: 'Layla Al-Amin',
    role: 'Head of Sustainability',
    bio: 'Environmental engineer turned furniture advocate. Oversees every supply chain decision with a single question: can we do better?',
    color: '#1a4a5c',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800',
  },
];

const TIMELINE = [
  {
    year: '2015',
    title: 'The workshop opens',
    desc: 'Khalid and Sara launch Onyx from a 400 sq ft workshop in Al Quoz, Dubai — a team of three with a shared belief that honesty in design is always in fashion.',
    side: 'left',
  },
  {
    year: '2017',
    title: 'First 100 customers',
    desc: 'Word of mouth alone brings 100 customers in the first year. Every single one receives a handwritten thank-you card from the founders.',
    side: 'right',
  },
  {
    year: '2019',
    title: 'Sustainability charter signed',
    desc: 'We commit to 100% sustainably certified wood by 2022 and publish our first supply chain transparency report — the first furniture brand in the region to do so.',
    side: 'left',
  },
  {
    year: '2022',
    title: 'Global reach',
    desc: 'Onyx begins shipping to 18 countries. Marco joins as Head of Craftsmanship, bringing our Italian joinery program to life.',
    side: 'right',
  },
  {
    year: '2025',
    title: '12,000 homes furnished',
    desc: 'A decade in, Onyx has furnished over 12,000 homes worldwide. We\'re still the same company — just bigger, and more certain than ever.',
    side: 'left',
  },
];

const SUSTAINABILITY = [
  { label: 'Sustainably certified wood',    pct: 100 },
  { label: 'Renewable energy in workshops', pct: 84  },
  { label: 'Carbon neutral shipments',      pct: 67  },
  { label: 'Overall carbon neutrality',     pct: 78  },
];

const SUS_TILES = [
  { num: 'Zero',  sub: 'landfill waste from workshops since 2021', dark: true  },
  { num: '40+',   sub: 'local artisan partners employed fairly',    dark: false },
  { num: '2027',  sub: 'target year for full carbon neutrality',    dark: false },
  { num: '5yr',   sub: 'warranty on every single product we sell',  dark: true  },
];

export default function About() {
  return (
    <div className={styles.page}>

      {/* ── Hero ──────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Our story</span>
          <h1 className={styles.heroH1}>
            Furniture Built<br />for <em>Generations</em>
          </h1>
          <p className={styles.heroP}>
            Onyx was founded on a single belief — that beautiful furniture should be honest.
            Honest in its materials, its craft, and its price. We design pieces that outlast
            trends and outlive expectations.
          </p>
          <div className={styles.heroPills}>
            <span className={styles.pill}><MapPin size={12} /> Est. 2015, Dubai</span>
            <span className={styles.pill}><Leaf size={12} /> Sustainably sourced</span>
            <span className={styles.pill}><Globe size={12} /> 18 countries</span>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.hvTall}>
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200"
              alt="Premium furniture"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '22px' }}
            />
          </div>
          <div className={styles.hvStack}>
            <div className={`${styles.hvSm} ${styles.hvSm1}`}>
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
                alt="Minimal Scandinavian interior"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
              />
            </div>
            <div className={`${styles.hvSm} ${styles.hvSm2}`}>
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
                alt="Premium sofa"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────── */}
      <section className={styles.statsStrip}>
        {STATS.map(({ num, label, Icon }) => (
          <div key={label} className={styles.statItem}>
            <div className={styles.statIconWrap}><Icon size={20} /></div>
            <div className={styles.statNum}>{num}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </section>

      {/* ── Story ─────────────────────────────────── */}
      <section className={styles.story}>
        <div className={styles.storyText}>
          <span className={`badge badge-green ${styles.tag}`}>Who we are</span>
          <h2 className={styles.storyH2}>
            We don't make furniture.<br />We make heirlooms.
          </h2>
          <p className={styles.storyP}>
            Onyx began in a small workshop in Dubai in 2015. Two designers, one shared
            obsession — furniture that earns its place in a home. Not through marketing or
            trend-chasing, but through the quiet authority of things made exceptionally well.
          </p>
          <p className={styles.storyP}>
            Every joint is hand-checked. Every finish is applied in three coats minimum.
            Every piece ships with a care card written by the craftsperson who built it.
            That's not a process — it's a promise.
          </p>
          <blockquote className={styles.quote}>
            "We want people to stop and say — who made this, and how do I get more?"
          </blockquote>
          <p className={styles.storyP}>
            Today we work with 40 artisan partners across 12 countries, all sharing our
            conviction that the best materials deserve the best hands.
          </p>
        </div>

        <div className={styles.storyVisual}>
          <div className={styles.storyImgMain}>
            <img
              src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200"
              alt="Our workshop"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '26px' }}
            />
          </div>
          <div className={styles.storyImgFloat}>
            <div className={styles.floatNum}>40+</div>
            <div className={styles.floatLabel}>Artisan partners worldwide</div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────── */}
      <section className={styles.values}>
        <div className={styles.secHead}>
          <span className={`badge badge-green ${styles.tagLight}`}>What drives us</span>
          <h2 className={styles.secH2}>Built on three principles</h2>
        </div>
        <div className={styles.valuesGrid}>
          {VALUES.map(({ Icon, title, desc }) => (
            <div key={title} className={styles.valCard}>
              <div className={styles.valIcon}><Icon size={22} /></div>
              <h3 className={styles.valH3}>{title}</h3>
              <p className={styles.valP}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ──────────────────────────────────── */}
      <section className={styles.team}>
        <div className={styles.teamHead}>
          <span className={`badge badge-green ${styles.tag}`}>The people</span>
          <h2 className={styles.secH2} style={{ marginTop: '12px' }}>Meet the founders</h2>
        </div>
        <div className={styles.teamGrid}>
          {TEAM.map(({ initials, name, role, bio, color, image }) => (
            <div key={name} className={styles.teamCard}>
              <div className={styles.teamAvatar} style={{ background: color }}>
                {image ? (
                  <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials
                )}
              </div>
              <div className={styles.teamBody}>
                <div className={styles.teamName}>{name}</div>
                <div className={styles.teamRole}>{role}</div>
                <p className={styles.teamBio}>{bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────── */}
      <section className={styles.timeline}>
        <div className={styles.tlHead}>
          <span className={styles.tlTag}>Our journey</span>
          <h2 className={styles.tlH2}>A decade of intention</h2>
          <p className={styles.tlSub}>Every milestone earned, not rushed.</p>
        </div>
        <div className={styles.tlTrack}>
          <div className={styles.tlLine} />
          {TIMELINE.map(({ year, title, desc, side }) => (
            <div key={year} className={`${styles.tlItem} ${side === 'right' ? styles.tlRight : ''}`}>
              <div className={styles.tlYearWrap}>
                <div className={styles.tlYear}>{year}</div>
              </div>
              <div className={styles.tlContent}>
                <h4 className={styles.tlTitle}>{title}</h4>
                <p className={styles.tlDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sustainability ────────────────────────── */}
      <section className={styles.sustain}>
        <div className={styles.sustainText}>
          <span className={`badge badge-green ${styles.tag}`}>Sustainability</span>
          <h2 className={styles.storyH2} style={{ marginTop: '16px' }}>
            We take the planet<br />as seriously as design.
          </h2>
          <p className={styles.storyP}>
            Every material decision is weighed against its environmental cost.
            We track, report, and improve — every single year.
          </p>
          <p className={styles.storyP}>
            Our goal is full carbon neutrality by 2027. We're 78% of the way there.
          </p>
          <div className={styles.bars}>
            {SUSTAINABILITY.map(({ label, pct }) => (
              <div key={label} className={styles.barRow}>
                <div className={styles.barLabelRow}>
                  <span className={styles.barName}>{label}</span>
                  <span className={styles.barPct}>{pct}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.susTiles}>
          {SUS_TILES.map(({ num, sub, dark }) => (
            <div
              key={num}
              className={`${styles.susTile} ${dark ? styles.susTileDark : styles.susTileLight}`}
            >
              <div className={styles.susTileNum}>{num}</div>
              <div className={styles.susTileSub}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────── */}
      <section 
        className={styles.ctaBanner}
        style={{
          backgroundImage: `linear-gradient(rgba(12, 59, 46, 0.85), rgba(12, 59, 46, 0.85)), url('https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h2 className={styles.ctaH2}>
          Ready to find your<br />forever piece?
        </h2>
        <p className={styles.ctaP}>
          Every Onyx product comes with free delivery over $500, a 5-year warranty,
          and the quiet confidence of something built to last.
        </p>
        <div className={styles.ctaBtns}>
          <Link to="/products" className={`btn btn-primary ${styles.ctaPrimary}`}>
            Explore the Collection <ArrowRight size={16} />
          </Link>
          <Link to="/" className={`btn btn-outline ${styles.ctaOutline}`}>
            Get in Touch
          </Link>
        </div>
      </section>

    </div>
  );
}
