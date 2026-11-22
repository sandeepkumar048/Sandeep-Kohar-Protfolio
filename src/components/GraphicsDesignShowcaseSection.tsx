import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers } from 'lucide-react';
import {
  GRAPHICS_SHOWCASE_FILTERS,
  type PortfolioProject,
  type ProjectCategory,
} from '../data/portfolioData';
import { filterProjectsByShowcase, getNextSlideIndex } from '../utils/portfolio';

interface GraphicsDesignShowcaseSectionProps {
  projects: PortfolioProject[];
  activeFilter: ProjectCategory;
  onChangeFilter: (category: ProjectCategory) => void;
  onSelectProject: (projectId: string) => void;
  onStartGraphicsProject: () => void;
}

export function GraphicsDesignShowcaseSection({
  projects,
  activeFilter,
  onChangeFilter,
  onSelectProject,
  onStartGraphicsProject,
}: GraphicsDesignShowcaseSectionProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const graphicsProjects = filterProjectsByShowcase(projects, 'graphics', activeFilter);
  const totalSlides = graphicsProjects.length;
  const safeSlideIndex = totalSlides > 0 ? slideIndex % totalSlides : 0;

  const handleFilterChange = (category: ProjectCategory) => {
    setSlideIndex(0);
    onChangeFilter(category);
  };

  const handleStep = (direction: 'prev' | 'next') => {
    setSlideIndex((prev) => getNextSlideIndex(prev, totalSlides, direction));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > 45) {
      handleStep(deltaX < 0 ? 'next' : 'prev');
    }
  };

  return (
    <section
      id="graphics-showcase"
      className="scroll-mt-20 border-y border-neutral-200/75 bg-[#F7F8F5] py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        {/* Split Gallery Header + Slide Controls */}
        <div className="flex flex-col gap-6 border-b border-neutral-200/90 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[680px]">
            <p className="font-serif italic text-[18px] text-[#525252]">
              02. Visual Craft
            </p>
            <h2 className="mt-1.5 font-sans text-[clamp(1.95rem,3.4vw,2.95rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#111111]">
              Graphics Design Showcase
            </h2>
            <p className="mt-3 max-w-[540px] text-[15px] leading-[1.6] text-[#525252]">
              Slide through tactile brand identities, retail packaging dielines, exhibition
              posters, and limited-edition print design crafted across paper and screen.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-end shrink-0">
            <div
              role="group"
              aria-label="Filter graphics design showcase"
              className="inline-flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white p-1.5"
            >
              {GRAPHICS_SHOWCASE_FILTERS.map((filter) => {
                const isActive = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleFilterChange(filter.value)}
                    className={`min-h-[38px] rounded-full px-4 py-1.5 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer ${
                      isActive
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'text-[#525252] hover:text-[#111111]'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* Slide Prev / Counter / Next Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStep('prev')}
                aria-label="Previous graphics design slide"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors duration-150 hover:border-[#111111] hover:bg-[#111111] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span
                data-testid="graphics-slide-counter"
                className="min-w-[54px] text-center text-[13px] font-medium text-[#111111] tabular-nums"
              >
                {String(safeSlideIndex + 1).padStart(2, '0')} /{' '}
                {String(totalSlides).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => handleStep('next')}
                aria-label="Next graphics design slide"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors duration-150 hover:border-[#111111] hover:bg-[#111111] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Exhibition Peek Slider */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Graphics design artwork slider"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="mt-10 overflow-hidden"
        >
          <div
            data-testid="graphics-showcase-track"
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform [--slide-offset:calc(var(--idx-mobile)*100%)] md:[--slide-offset:calc(var(--idx-desktop)*84%)]"
            style={
              {
                '--idx-mobile': safeSlideIndex,
                '--idx-desktop':
                  totalSlides > 1 && safeSlideIndex === totalSlides - 1
                    ? safeSlideIndex - 0.1905
                    : safeSlideIndex,
                transform: 'translateX(calc(-1 * var(--slide-offset)))',
              } as React.CSSProperties
            }
          >
            {graphicsProjects.map((project, idx) => {
              const hasFailed = Boolean(failedImages[project.id]);
              const isCurrent = idx === safeSlideIndex;
              const plateNumber = String(idx + 1).padStart(2, '0');

              return (
                <article
                  key={project.id}
                  className="w-full shrink-0 pr-0 md:w-[84%] md:pr-7"
                >
                  <div
                    className={`overflow-hidden rounded-[26px] border bg-white p-4 transition-all duration-300 sm:p-5 ${
                      isCurrent
                        ? 'border-neutral-200/95 shadow-[0_24px_54px_-32px_rgba(17,17,17,0.25)] opacity-100'
                        : 'border-neutral-200/60 opacity-65 hover:opacity-90'
                    }`}
                  >
                    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
                      {/* High-Resolution Gallery Plate */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isCurrent) {
                            setSlideIndex(idx);
                          } else {
                            onSelectProject(project.id);
                          }
                        }}
                        aria-label={
                          isCurrent
                            ? `Open graphics case study for ${project.title}`
                            : `Focus slide ${plateNumber}: ${project.title}`
                        }
                        className="group relative aspect-[4/3] w-full overflow-hidden rounded-[18px] border border-neutral-200/75 bg-white text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] cursor-pointer"
                      >
                        {hasFailed ? (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-100 p-6 text-center">
                            <Layers className="h-6 w-6 text-neutral-400" />
                            <span className="mt-2 text-sm font-medium text-[#111111]">
                              {project.title}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={project.image}
                            alt={project.imageAlt}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImages((prev) => ({
                                ...prev,
                                [project.id]: true,
                              }))
                            }
                            className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.03] ${project.imageCropClass ?? 'object-cover'}`}
                          />
                        )}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pt-10 pb-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                          <span className="text-[12px] font-medium text-white">
                            {project.client}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#D9FA7A]">
                            <span>{isCurrent ? 'Inspect Artwork' : 'View Slide'}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                        </div>
                      </button>

                      {/* Spacious Uncramped Exhibition Details (Zero Truncation) */}
                      <div className="flex flex-col justify-between py-1 lg:py-3">
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="shrink-0 whitespace-nowrap font-serif italic text-[17px] text-[#525252] tabular-nums">
                              Plate {plateNumber}
                            </span>
                            <span className="text-[12px] font-medium text-[#737373] tabular-nums">
                              {project.disciplines.join(' · ')} · {project.year}
                            </span>
                          </div>

                          <h3 className="mt-2.5 font-sans text-[clamp(1.45rem,2.3vw,1.95rem)] font-medium leading-[1.16] tracking-[-0.03em] text-[#111111]">
                            {project.title}
                          </h3>

                          <p className="mt-3 text-[14px] leading-[1.68] text-[#525252]">
                            {project.summary}
                          </p>

                          <p className="mt-4 text-[12.5px] font-medium text-[#262626]">
                            {project.formatSpec}
                          </p>
                        </div>

                        <div className="mt-6 border-t border-neutral-100 pt-5">
                          <div className="grid grid-cols-3 gap-3">
                            {project.metrics.map((metric) => (
                              <div key={metric.label}>
                                <p className="font-sans text-[16px] font-semibold tracking-[-0.02em] text-[#111111] tabular-nums">
                                  {metric.value}
                                </p>
                                <p className="mt-0.5 text-[11px] text-[#666666]">
                                  {metric.label}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => onSelectProject(project.id)}
                              className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#111111] px-5 py-2 text-[13px] font-medium text-white whitespace-nowrap transition-colors duration-150 hover:bg-[#262626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
                            >
                              <span>Inspect Artwork &amp; Case</span>
                              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </button>

                            <button
                              type="button"
                              onClick={onStartGraphicsProject}
                              className="inline-flex min-h-[42px] items-center gap-1.5 px-2 py-2 text-[13px] font-medium text-[#525252] whitespace-nowrap transition-colors hover:text-[#111111] hover:underline underline-offset-4 cursor-pointer"
                            >
                              <span>Commission Work</span>
                              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Interactive Slide Filmstrip Selector */}
        <div
          role="tablist"
          aria-label="Select graphics design slide"
          className={`mt-7 grid grid-cols-2 gap-3 ${
            totalSlides <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-4'
          }`}
        >
          {graphicsProjects.map((project, idx) => {
            const isCurrent = idx === safeSlideIndex;
            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                onClick={() => setSlideIndex(idx)}
                className={`group flex flex-col items-start border-t-2 pt-3 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] cursor-pointer ${
                  isCurrent
                    ? 'border-[#111111]'
                    : 'border-neutral-300/80 hover:border-neutral-500'
                }`}
              >
                <span className="font-serif italic text-[13px] text-[#737373] tabular-nums">
                  Plate {String(idx + 1).padStart(2, '0')} · {project.year}
                </span>
                <span
                  className={`mt-1 text-[13.5px] font-medium leading-[1.35] transition-colors ${
                    isCurrent
                      ? 'text-[#111111]'
                      : 'text-[#666666] group-hover:text-[#111111]'
                  }`}
                >
                  {project.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
