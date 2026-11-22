import { useEffect, useState } from 'react';
import { Check, Download, GraduationCap } from 'lucide-react';
import { HERO_PORTRAIT_SRC } from '../data/portfolioData';
import { removeUniformBackground } from '../utils/chromaKey';

interface HeroSectionProps {
  onDownloadResume: () => void;
  resumeDownloaded: boolean;
}

const CLIENT_LOGOS = [
  { name: 'Syneo Labs', shape: 'grid' },
  { name: 'eLab Nepal', shape: 'circle' },
  { name: 'Rotaract HWIC', shape: 'split' },
  { name: 'WhiteHouse Innovator', shape: 'ring' },
  { name: 'Hult Prize HWIC', shape: 'hex' },
  { name: 'Computer Engineering', shape: 'bars' },
] as const;

function ClientMark({ shape }: { shape: (typeof CLIENT_LOGOS)[number]['shape'] }) {
  switch (shape) {
    case 'circle':
      return (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="10" cy="10" r="2.5" fill="currentColor" />
        </svg>
      );
    case 'split':
      return (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="2" y="3" width="6" height="14" rx="3" fill="currentColor" />
          <path d="M11 3h2a5 5 0 0 1 0 14h-2V3Z" fill="currentColor" opacity="0.65" />
        </svg>
      );
    case 'ring':
      return (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M15.6 6.4A6.5 6.5 0 1 0 16.5 10h-4.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'hex':
      return (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 2.5 16.5 6.25v7.5L10 17.5 3.5 13.75v-7.5L10 2.5Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    case 'bars':
      return (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="5.5" cy="10" r="3" fill="currentColor" />
          <circle cx="11.5" cy="10" r="3" fill="currentColor" opacity="0.7" />
          <circle cx="16.5" cy="10" r="2" fill="currentColor" opacity="0.45" />
        </svg>
      );
    case 'grid':
      return (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
          <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.6" />
          <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.6" />
          <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
        </svg>
      );
  }
}

export function HeroSection({
  onDownloadResume,
  resumeDownloaded,
}: HeroSectionProps) {
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const maxDim = 1200;
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
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
        // Fallback gracefully to the raw image if canvas extraction fails
      }
    };
    img.src = HERO_PORTRAIT_SRC;
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="top" className="scroll-mt-16 relative overflow-hidden bg-white pt-8 pb-12 md:pt-10 md:pb-16">
      <div className="relative mx-auto max-w-[1360px]">
        {/* Radiant acid-lime atmospheric wash behind hero */}
        <div
          aria-hidden="true"
          className="hero-lime-aura pointer-events-none absolute inset-x-0 top-14 bottom-20"
        />

        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
          {/* Subtle editorial recognition line */}
          <div className="mb-4 flex items-center justify-center gap-2 text-[12px] font-medium text-[#525252]">
            <GraduationCap className="h-4 w-4 text-[#111111]" strokeWidth={1.75} aria-hidden="true" />
            <span>Computer Engineering Student</span>
          </div>

          {/* Monumental Dual-Font Editorial Headline */}
          <div className="text-center">
            <h1 className="mx-auto max-w-5xl">
              <span className="block font-sans text-[clamp(2.35rem,4.8vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.04em] text-[#111111]">
                Hi, I&apos;m Sandeep
              </span>
              <span className="mt-1 block font-serif italic text-[clamp(2.55rem,5.4vw,4.85rem)] font-normal leading-[0.98] tracking-[-0.02em] text-[#111111]">
                Web Developer &amp; Graphics Designer
              </span>
            </h1>
          </div>

          {/* 3-column balanced editorial hero composition around centered portrait */}
          <div className="relative mt-2 grid grid-cols-1 items-end gap-8 md:mt-1 lg:grid-cols-[1fr_minmax(320px,430px)_1fr] lg:gap-6">
            {/* Left Flank: Quiet availability + real experience proof */}
            <div className="order-2 flex flex-col justify-between gap-10 pb-8 lg:order-1 lg:h-full lg:pt-16">
              <div className="max-w-[245px]">
                <p className="text-[13px] font-semibold text-[#111111]">
                  Available for new projects
                </p>
                <p className="mt-1.5 text-[12px] leading-[1.5] text-[#404040]">
                  Responsive web design, social media campaigns, and graphic branding.
                </p>
              </div>

              <div className="flex items-center gap-3.5 max-w-[265px]">
                <div className="flex -space-x-2 shrink-0" aria-hidden="true">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#1F2937] text-[10px] font-semibold text-white">
                    eL
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#3F3F46] text-[10px] font-semibold text-white">
                    RC
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#71717A] text-[10px] font-semibold text-white">
                    HP
                  </span>
                </div>
                <p className="text-[12px] leading-[1.45] text-[#404040]">
                  Graphic Designer &amp; IT Head across{' '}
                  <strong className="font-semibold text-[#111111]">eLab Nepal</strong>,{' '}
                  <strong className="font-semibold text-[#111111]">Rotaract HWIC</strong> &amp; more.
                </p>
              </div>
            </div>

            {/* Center Focal Anchor: Seamless Cutout Portrait over Acid-Lime Glow */}
            <div className="order-1 mx-auto w-full max-w-[380px] lg:order-2 lg:max-w-[430px]">
              <div className="aspect-[1/1.02] w-full">
                {portraitFailed ? (
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl bg-neutral-100/80 text-center px-6">
                    <span className="font-serif italic text-3xl text-[#111111]">Sandeep Kohar</span>
                    <span className="mt-1 text-xs text-[#666666]">
                      Web Developer &amp; Graphics Designer
                    </span>
                  </div>
                ) : (
                  <img
                    src={cutoutSrc ?? HERO_PORTRAIT_SRC}
                    alt="Portrait of Sandeep Kohar, Web Developer and Graphics Designer"
                    referrerPolicy="no-referrer"
                    onError={() => setPortraitFailed(true)}
                    className={`h-full w-full object-cover object-top ${
                      cutoutSrc
                        ? '[mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)]'
                        : 'rounded-[28px]'
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Right Flank: Editorial statement + primary CTA */}
            <div className="order-3 flex flex-col items-start justify-between gap-8 pb-8 lg:h-full lg:items-end lg:pt-20 lg:text-left">
              <p className="max-w-[265px] text-[15px] leading-[1.6] text-[#262626]">
                Computer Engineering student passionate about responsive web development, creative
                graphic design, and solving real-world problems.
              </p>

              <div className="flex w-full max-w-[270px] flex-wrap items-center gap-2.5 lg:justify-start">
                <button
                  type="button"
                  onClick={onDownloadResume}
                  className="relative z-10 inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-[14px] font-medium text-white whitespace-nowrap shrink-0 shadow-[0_10px_28px_-10px_rgba(17,17,17,0.45)] transition-all duration-150 hover:bg-[#262626] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
                >
                  {resumeDownloaded ? (
                    <Check className="h-4 w-4 text-[#D9FA7A]" aria-hidden="true" />
                  ) : (
                    <Download className="h-4 w-4 text-[#D9FA7A]" aria-hidden="true" />
                  )}
                  <span>{resumeDownloaded ? 'Resume Saved' : 'Download Resume'}</span>
                </button>
              </div>
            </div>

            {/* Full-width bottom dissolve fading both lime glow and portrait hem cleanly into white */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/85 to-transparent"
            />
          </div>

          {/* Monochrome Client Logo Bar */}
          <div
            aria-label="Selected client teams"
            className="relative mt-6 border-t border-neutral-100 pt-8 md:mt-8"
          >
            <div className="grid grid-cols-2 gap-y-5 gap-x-4 sm:grid-cols-3 lg:grid-cols-6 items-center justify-items-center text-[#9A9A9A]">
              {CLIENT_LOGOS.map((client) => (
                <div
                  key={client.name}
                  className="flex items-center gap-1.5 text-[13px] font-semibold tracking-[-0.02em] whitespace-nowrap opacity-80 transition-opacity duration-150 hover:opacity-100"
                >
                  <ClientMark shape={client.shape} />
                  <span>{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
