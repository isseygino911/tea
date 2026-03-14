import { useEffect, useRef, useState } from 'react';

export const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Animate when entering viewport, reset when leaving
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Convert float delay to integer class (0.1s -> 1, 0.4s -> 4)
  const delaySteps = Math.round(delay * 10);
  const delayClass = delaySteps > 0 ? `reveal-delay-${Math.min(delaySteps, 4)}` : '';
  const activeClass = isVisible ? 'active' : '';

  return (
    <div ref={ref} className={`reveal ${delayClass} ${activeClass} ${className}`}>
      {children}
    </div>
  );
};
