import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolioData';

interface CaseStudyModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onStartProject: (scope: string) => void;
}

export function CaseStudyModal({
  project,
  onClose,
  onNavigate,
  onStartProject,
}: CaseStudyModalProps) {
  useEffect(() => {
    if (!project) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        onNavigate('next');
      } else if (event.key === 'ArrowLeft') {
        onNavigate('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [project, onClose, onNavigate]);

  if (!project) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 sm:p-6 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-[920px] overflow-y-auto rounded-[28px] bg-white shadow-2xl">
        {/* Sticky modal header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-neutral-100 bg-white/95 px-6 py-4 backdrop-blur-md sm:px-8">
          <div className="min-w-0">
            <p className="text-[12px] text-[#666666] tabular-nums">
              {project.client} · {project.disciplines.join(' · ')} · {project.year}
            </p>
            <h2
              id="case-study-title"
              className="truncate font-sans text-[20px] font-semibold tracking-[-0.02em] text-[#111111]"
            >
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* High-Resolution Preview Frame */}
          <div className="aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-neutral-200 bg-white">
            <img
              src={project.image}
              alt={project.imageAlt}
              referrerPolicy="no-referrer"
              className={`h-full w-full ${project.imageCropClass ?? 'object-cover'}`}
            />
          </div>

          {/* Summary & Meta */}
          <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-[1.5fr_1fr]">
            <p className="text-[16px] leading-[1.68] text-[#262626]">{project.summary}</p>
            <dl className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4 text-[13px] md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <div>
                <dt className="text-[#737373]">Role</dt>
                <dd className="mt-1 font-medium text-[#111111]">{project.role}</dd>
              </div>
              <div>
                <dt className="text-[#737373]">Timeline</dt>
                <dd className="mt-1 font-medium text-[#111111] tabular-nums">
                  {project.timeline}
                </dd>
              </div>
            </dl>
          </div>

          {/* Quantitative Outcomes Strip */}
          <div className="mt-8 grid grid-cols-1 gap-4 rounded-[20px] bg-[#F8F9FA] p-5 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="sm:px-2">
                <p className="font-sans text-[24px] font-semibold tracking-[-0.03em] text-[#111111] tabular-nums">
                  {metric.value}
                </p>
                <p className="mt-1 text-[12px] text-[#666666]">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Challenge & Solution */}
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-sans text-[15px] font-semibold text-[#111111]">
                The Challenge
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.68] text-[#525252]">
                {project.challenge}
              </p>
            </div>
            <div>
              <h3 className="font-sans text-[15px] font-semibold text-[#111111]">
                The Solution
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.68] text-[#525252]">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Deliverables */}
          <div className="mt-8 border-t border-neutral-100 pt-6">
            <h3 className="font-sans text-[13px] font-semibold text-[#111111]">
              Key Deliverables
            </h3>
            <p className="mt-2 text-[14px] text-[#525252]">
              {project.deliverables.join(' · ')}
            </p>
          </div>

          {/* Footer Navigation & CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('prev')}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-[13px] font-medium text-[#111111] transition-colors hover:bg-neutral-50 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('next')}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-[13px] font-medium text-[#111111] transition-colors hover:bg-neutral-50 cursor-pointer"
              >
                <span>Next Project</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                onStartProject(
                  project.category === 'Brand Identity' || project.category === 'Print & Visual'
                    ? 'Graphic Design'
                    : project.category === 'Full-Stack'
                      ? 'Full-Stack Build'
                      : 'Web Development'
                )
              }
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#111111] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#262626] cursor-pointer"
            >
              <span>Discuss a similar project</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
