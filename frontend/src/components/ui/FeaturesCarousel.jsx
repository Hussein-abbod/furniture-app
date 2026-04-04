import React, { useState, useEffect } from 'react';
import styles from './FeaturesCarousel.module.css';

export default function FeaturesCarousel({ perks }) {
  // Start at the first original item to allow seamless infinite backward scrolling
  const [currentIndex, setCurrentIndex] = useState(perks.length); 
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Extend perks: clone left and right arrays to create a seamless infinite loop track
  const extendedPerks = [...perks, ...perks, ...perks];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3000); // Auto-slide every 3 seconds
    
    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    // If we've reached the right clone threshold, snap back quietly to the original list
    if (currentIndex >= perks.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - perks.length);
    } 
    // If we've reached the left clone threshold, snap forward quietly to the original list
    else if (currentIndex < perks.length) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + perks.length);
    }
  };

  const handleDotClick = (index) => {
    setIsTransitioning(true);
    // Find our relative position within the primary array chunk
    const actualIndex = currentIndex % perks.length;
    setCurrentIndex(currentIndex - actualIndex + index);
  };

  return (
    <div 
      className={styles.carouselContainer}
      style={{ '--current-index': currentIndex }}
    >
      <div 
        className={`${styles.carouselTrack} ${!isTransitioning ? styles.noTransition : ''}`}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedPerks.map((perk, index) => {
          const { Icon, title, desc } = perk;
          const isActive = index === currentIndex;
          
          return (
            <div 
              key={`${title}-${index}`} 
              className={`${styles.carouselSlide} ${isActive ? styles.active : ''}`}
            >
              <div className={styles.perkIcon}>
                <Icon size={24} />
              </div>
              <div className={styles.perkContent}>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.dots}>
        {perks.map((_, index) => {
          const isActive = (currentIndex % perks.length) === index;
          return (
            <button
              key={index}
              className={`${styles.dot} ${isActive ? styles.activeDot : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
