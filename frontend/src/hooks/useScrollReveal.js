import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref and a boolean `inView` that flips to true
 * once the element enters the viewport.
 *
 * @param {Object}  opts
 * @param {string}  opts.threshold  – 0-1 visibility ratio (default 0.15)
 * @param {string}  opts.rootMargin – CSS margin around root  (default "0px 0px -60px 0px")
 * @param {boolean} opts.once       – stop observing after first trigger (default true)
 */
export default function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
