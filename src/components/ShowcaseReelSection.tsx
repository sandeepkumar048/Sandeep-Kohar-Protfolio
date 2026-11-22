import { useState } from 'react';
import { ArrowDownRight, Layers } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolioData';

interface ShowcaseReelSectionProps {
  projects: PortfolioProject[];
  onSelectProject: (projectId: string) => void;
}

export function ShowcaseReelSection({
  projects,
  onSelectProject,
}: ShowcaseReelSectionProps) {
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  return (
    <section
      aria-label="Recent web development and graphic design showcase"
      className="py-6 md:py-10"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="showcase-lime-canvas relative overflow-hidden rounded-[28px] p-4 sm:p-6 md:p-8 shadow-[0_24px_60px_-36px_rgba(140,212,18,0.55)]">
          {/* 2x2 Showcase Board Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {projects.map((project) => {
              const isFailed = Boolean(failedIds[project.id]);
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onSelectProject(project.id)}
                  aria-label={`Inspect ${project.title} case study`}
                  className="group relative aspect-[16/10.5] w-full overflow-hidden rounded-[18px] bg-white text-left shadow-[0_14px_34px_-18px_rgba(17,17,17,0.22)] transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
                >
                  {isFailed ? (
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
                        setFailedIds((prev) => ({ ...prev, [project.id]: true }))
                      }
                      className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.03] ${project.imageCropClass ?? 'object-cover'}`}
                    />
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pt-8 pb-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="text-[13px] font-medium text-white">
                      {project.title}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] text-white/90">
                      <span>View Case</span>
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center floating showcase action matching the Dribbble centerpiece */}
          <div className="mt-5 flex justify-center sm:pointer-events-none sm:absolute sm:inset-0 sm:mt-0 sm:items-center">
            <a
              href="#works"
              className="pointer-events-auto inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-white/95 px-5 py-2.5 text-[13px] font-medium text-[#111111] shadow-[0_14px_36px_-10px_rgba(17,17,17,0.3)] backdrop-blur-md transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] text-white">
                <Layers className="h-3.5 w-3.5" />
              </span>
              <span className="whitespace-nowrap">Explore Recent Works</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
