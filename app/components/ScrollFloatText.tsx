'use client';

import { useEffect, useRef } from 'react';

interface ScrollFloatTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  isHeading?: boolean;
}

export default function ScrollFloatText({ 
  children, 
  className = '', 
  delay = 0,
  isHeading = false 
}: ScrollFloatTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a small delay before triggering the animation
            setTimeout(() => {
              entry.target.classList.add('in-view');
            }, delay);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element comes into view
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [delay]);

  const baseClass = isHeading ? 'scroll-float-heading' : 'scroll-float';
  const delayClass = delay > 0 ? `scroll-float-delay-${Math.min(Math.ceil(delay / 100), 5)}` : '';

  return (
    <div
      ref={elementRef}
      className={`${baseClass} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
} 