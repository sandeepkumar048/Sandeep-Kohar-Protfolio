import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { shouldShowBackToTop } from '../utils/portfolio';

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const heroEl = document.getElementById('top');
      const heroHeight = heroEl ? heroEl.offsetHeight : 640;
      setVisible(shouldShowBackToTop(window.scrollY, heroHeight));
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  const handleScrollTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={handleScrollTop}
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-5 bottom-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-[#111111] text-[#D9FA7A] shadow-[0_14px_34px_-10px_rgba(17,17,17,0.55)] transition-all duration-200 hover:bg-[#262626] hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] sm:right-7 sm:bottom-7 ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100 cursor-pointer'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
    </button>
  );
}
