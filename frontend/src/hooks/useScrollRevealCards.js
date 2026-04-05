import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Observes a list of card elements and returns which indices are visible,
 * enabling staggered scroll-triggered reveal animations.
 *
 * Elements are observed lazily as they mount (ref callback), so this
 * works seamlessly with async data fetching.
 *
 * @param {Object}  opts
 * @param {number}  opts.threshold   – 0-1 visibility ratio   (default 0.12)
 * @param {string}  opts.rootMargin  – CSS margin around root  (default "0px 0px -40px 0px")
 * @param {number}  opts.staggerMs   – per-card stagger delay  (default 80)
 */
export default function useScrollRevealCards({
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  staggerMs = 80,
} = {}) {
  const observerRef = useRef(null);
  const [visibleSet, setVisibleSet] = useState(new Set());

  // Create the observer once
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newlyVisible = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.cardIndex);
            newlyVisible.push(idx);
            observerRef.current?.unobserve(entry.target);
          }
        });

        if (newlyVisible.length > 0) {
          // Sort so lowest index reveals first
          newlyVisible.sort((a, b) => a - b);

          // Stagger: delay each card's reveal relative to the batch
          newlyVisible.forEach((idx, order) => {
            setTimeout(() => {
              setVisibleSet((prev) => {
                const next = new Set(prev);
                next.add(idx);
                return next;
              });
            }, order * staggerMs);
          });
        }
      },
      { threshold, rootMargin }
    );

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [threshold, rootMargin, staggerMs]);

  // Ref callback factory – observe each element as it mounts
  const setCardRef = useCallback((index) => (el) => {
    if (el && observerRef.current) {
      el.dataset.cardIndex = index;
      observerRef.current.observe(el);
    }
  }, []);

  return { setCardRef, visibleSet };
}
