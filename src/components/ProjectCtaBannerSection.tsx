import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { HERO_PORTRAIT_SRC } from '../data/portfolioData';
import { removeUniformBackground } from '../utils/chromaKey';

interface ProjectCtaBannerSectionProps {
  onContactClick: () => void;
}

export function ProjectCtaBannerSection({
  onContactClick,
}: ProjectCtaBannerSectionProps) {
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);
  const [portraitFailed, setPortraitFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const maxDim = 900;
        const scale = Math.min(
          1,
          maxDim / Math.max(img.naturalWidth, img.naturalHeight)
        );
        const width = Math.max(1, Math.round(img.naturalWidth * scale));
        const height = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const keyed = removeUniformBackground(imageData.data, width, height, {
          tolerance: 28,
          chromaTolerance: 13,
          feather: 26,
          edgeRadius: 4,
        });
        imageData.data.set(keyed);
        ctx.putImageData(imageData, 0, 0);
        setCutoutSrc(canvas.toDataURL('image/png'));
      } catch {
        // Fallback gracefully to the original portrait
      }
    };
    img.src = HERO_PORTRAIT_SRC;
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="new-project-cta"
      aria-labelledby="new-project-cta-heading"
      className="bg-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-[1140px] px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[28px] bg-[#111111] text-white shadow-[0_28px_70px_-30px_rgba(17,17,17,0.48)]">
          {/* Signature Acid-Lime Radial Studio Glow behind portrait */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -bottom-16 h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(183,248,60,0.42)_0%,rgba(217,250,122,0.18)_48%,rgba(17,17,17,0)_76%)] opacity-90 blur-3xl md:h-[420px] md:w-[420px]"
          />

          <div className="relative grid grid-cols-1 items-center gap-8 px-8 pt-10 md:grid-cols-[1.2fr_0.8fr] md:gap-10 md:px-14 md:pt-12 lg:px-16">
            {/* Left Content Column */}
            <div className="pb-2 text-left md:pb-12">
              <h2
                id="new-project-cta-heading"
                className="font-sans text-[clamp(1.85rem,3.4vw,2.65rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white"
              >
                You have a{' '}
                <span className="font-serif italic font-normal text-[#D9FA7A]">
                  new project
                </span>
              </h2>

              <p className="mt-4 max-w-[420px] text-[15.5px] leading-[1.6] text-neutral-300">
                Let&apos;s bring your ideas to life with clean websites and bold
                visual design.
              </p>

              <div className="mt-7">
                <button
                  type="button"
                  onClick={onContactClick}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-[14px] bg-white px-6 py-3 text-[14.5px] font-semibold text-[#111111] whitespace-nowrap shrink-0 shadow-[0_14px_32px_-12px_rgba(0,0,0,0.4)] transition-all duration-150 hover:bg-[#D9FA7A] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9FA7A] cursor-pointer"
                >
                  <span>Contact Me</span>
                  <Send className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Right Cutout Portrait Anchored Flush to Bottom */}
            <div className="relative flex items-end justify-center self-end md:justify-end">
              {portraitFailed ? (
                <div className="mb-8 flex h-[220px] w-[220px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-center">
                  <span className="font-serif italic text-2xl text-[#D9FA7A]">
                    Sandeep Kohar
                  </span>
                  <span className="mt-1 text-xs text-neutral-400">
                    Web Developer &amp; Graphics Designer
                  </span>
                </div>
              ) : (
                <img
                  src={cutoutSrc ?? HERO_PORTRAIT_SRC}
                  alt="Sandeep Kohar smiling portrait for new project collaborations"
                  referrerPolicy="no-referrer"
                  onError={() => setPortraitFailed(true)}
                  className={`block w-[240px] max-w-full object-contain object-bottom sm:w-[270px] md:w-[300px] ${
                    cutoutSrc ? '' : 'mb-6 rounded-2xl'
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
