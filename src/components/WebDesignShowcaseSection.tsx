import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Layers } from 'lucide-react';
import {
  WEB_SHOWCASE_FILTERS,
  type PortfolioProject,
  type ProjectCategory,
} from '../data/portfolioData';
import { filterProjectsByShowcase, getNextSlideIndex } from '../utils/portfolio';

interface WebDesignShowcaseSectionProps {
  projects: PortfolioProject[];
  activeFilter: ProjectCategory;
  onChangeFilter: (category: ProjectCategory) => void;
  onSelectProject: (projectId: string) => void;
  onStartWebProject: () => void;
}

export function WebDesignShowcaseSection({
  projects,
  activeFilter,
  onChangeFilter,
  onSelectProject,
  onStartWebProject,
}: WebDesignShowcaseSectionProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const webProjects = filterProjectsByShowcase(projects, 'web', activeFilter);
  const totalSlides = webProjects.length;
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
    <section id="web-showcase" className="scroll-mt-20 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        {/* Split Editorial Header + Slide Navigation Controls */}
        <div className="flex flex-col gap-6 border-b border-neutral-200/80 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[660px]">
            <p className="font-serif italic text-[18px] text-[#525252]">
              01. Digital Craft
            </p>
            <h2 className="mt-1.5 font-sans text-[clamp(1.95rem,3.4vw,2.95rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#111111]">
              Web Design Showcase
            </h2>
            <p className="mt-3 max-w-[540px] text-[15px] leading-[1.6] text-[#525252]">
              Slide through custom websites, storefronts, and full-stack web apps engineered
              for crisp typography, fluid interaction, and fast Core Web Vitals.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-end shrink-0">
            <div
              role="group"
              aria-label="Filter web design showcase"
              className="inline-flex items-center gap-1 rounded-full bg-neutral-100 p-1.5"
            >
              {WEB_SHOWCASE_FILTERS.map((filter) => {
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
                aria-label="Previous web design slide"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors duration-150 hover:border-[#111111] hover:bg-[#111111] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span
                data-testid="web-slide-counter"
                className="min-w-[54px] text-center text-[13px] font-medium text-[#111111] tabular-nums"
              >
                {String(safeSlideIndex + 1).padStart(2, '0')} /{' '}
                {String(totalSlides).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => handleStep('next')}
                aria-label="Next web design slide"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors duration-150 hover:border-[#111111] hover:bg-[#111111] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Slide-Wise Stage */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Web design projects slider"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="mt-10 overflow-hidden rounded-[28px] border border-neutral-200/85 bg-[#FAFAFA]"
        >
          <div
            data-testid="web-showcase-track"
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
            style={{ transform: `translateX(-${safeSlideIndex * 100}%)` }}
          >
            {webProjects.map((project, idx) => {
              const hasFailed = Boolean(failedImages[project.id]);
              return (
                <article
                  key={project.id}
                  aria-hidden={idx !== safeSlideIndex}
                  className="w-full shrink-0 p-4 sm:p-6 md:p-7"
                >
                  <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
                    {/* Slide Visual Frame */}
                    <button
                      type="button"
                      tabIndex={idx === safeSlideIndex ? 0 : -1}
                      onClick={() => onSelectProject(project.id)}
                      aria-label={`Open web case study for ${project.title}`}
                      className="group flex flex-col overflow-hidden rounded-[20px] border border-neutral-200/90 bg-white text-left transition-shadow duration-200 hover:shadow-[0_24px_54px_-32px_rgba(17,17,17,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] cursor-pointer"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 bg-[#F7F7F8] px-4 py-2.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#525252]">
                          <Globe className="h-3.5 w-3.5 text-[#737373]" aria-hidden="true" />
                          <span>{project.domainUrl ?? 'sandeepkohar.design'}</span>
                        </div>
                        <span className="text-[11px] text-[#737373] tabular-nums">
                          {project.year}
                        </span>
                      </div>

                      <div className="relative aspect-[16/10] w-full flex-1 overflow-hidden bg-white">
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
                      </div>
                    </button>

                    {/* Slide Editorial Details */}
                    <div className="flex flex-col justify-between py-1 lg:py-3">
                      <div>
                        <p className="text-[12px] font-medium text-[#666666] tabular-nums">
                          Slide {String(idx + 1).padStart(2, '0')} · {project.client} ·{' '}
                          {project.year}
                        </p>
                        <h3 className="mt-2.5 font-sans text-[clamp(1.55rem,2.5vw,2.1rem)] font-medium leading-[1.15] tracking-[-0.03em] text-[#111111]">
                          {project.title}
                        </h3>
                        <p className="mt-3.5 text-[14.5px] leading-[1.68] text-[#525252]">
                          {project.summary}
                        </p>
                        <p className="mt-4 text-[12.5px] font-medium text-[#262626]">
                          {project.formatSpec}
                        </p>
                      </div>

                      <div className="mt-7 border-t border-neutral-200/80 pt-5">
                        <div className="grid grid-cols-3 gap-3">
                          {project.metrics.map((metric) => (
                            <div key={metric.label}>
                              <p className="font-sans text-[18px] font-semibold tracking-[-0.02em] text-[#111111] tabular-nums">
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
                            tabIndex={idx === safeSlideIndex ? 0 : -1}
                            onClick={() => onSelectProject(project.id)}
                            className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#111111] px-5 py-2 text-[13px] font-medium text-white whitespace-nowrap transition-colors duration-150 hover:bg-[#262626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
                          >
                            <span>Inspect Case Study</span>
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                          </button>

                          <button
                            type="button"
                            tabIndex={idx === safeSlideIndex ? 0 : -1}
                            onClick={onStartWebProject}
                            className="inline-flex min-h-[42px] items-center gap-1.5 px-2 py-2 text-[13px] font-medium text-[#525252] whitespace-nowrap transition-colors hover:text-[#111111] hover:underline underline-offset-4 cursor-pointer"
                          >
                            <span>Start a Web Project</span>
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Interactive Slide Filmstrip Index Selector */}
        <div
          role="tablist"
          aria-label="Select web design slide"
          className={`mt-6 grid grid-cols-2 gap-3 ${
            totalSlides <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-4'
          }`}
        >
          {webProjects.map((project, idx) => {
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
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <span className="text-[11px] font-medium text-[#737373] tabular-nums">
                  {String(idx + 1).padStart(2, '0')} · {project.category}
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
