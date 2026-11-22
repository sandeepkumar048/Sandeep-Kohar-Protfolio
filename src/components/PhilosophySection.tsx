import { useState } from 'react';
import {
  ArrowRight,
  Code2,
  Gauge,
  Grid2x2,
  Palette,
  PenTool,
  Server,
} from 'lucide-react';
import { CAPABILITIES, type ProjectCategory } from '../data/portfolioData';

interface PhilosophySectionProps {
  onFilterByCategory: (category: ProjectCategory) => void;
}

function CapabilityIcon({ id, color }: { id: string; color: string }) {
  const props = { className: 'h-3.5 w-3.5 shrink-0', style: { color }, 'aria-hidden': true as const };
  switch (id) {
    case 'frontend-dev':
      return <Code2 {...props} />;
    case 'fullstack-apps':
      return <Server {...props} />;
    case 'web-performance':
      return <Gauge {...props} />;
    case 'brand-identity':
      return <Palette {...props} />;
    case 'print-editorial':
      return <PenTool {...props} />;
    default:
      return <Grid2x2 {...props} />;
  }
}

export function PhilosophySection({ onFilterByCategory }: PhilosophySectionProps) {
  const [activeId, setActiveId] = useState<string>('frontend-dev');
  const activeCapability =
    CAPABILITIES.find((item) => item.id === activeId) ?? CAPABILITIES[0];

  const leftCapabilities = CAPABILITIES.filter((c) => c.side === 'left');
  const rightCapabilities = CAPABILITIES.filter((c) => c.side === 'right');

  return (
    <section id="capabilities" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="text-center">
          <p className="font-serif italic text-[19px] text-[#525252]">Hello!</p>
        </div>

        <div className="mt-7 grid grid-cols-1 items-center gap-8 lg:grid-cols-[200px_1fr_200px] lg:gap-10">
          {/* Left Interactive Capabilities */}
          <div className="flex flex-wrap justify-center gap-2.5 lg:flex-col lg:items-start lg:gap-5">
            {leftCapabilities.map((item, idx) => {
              const isSelected = item.id === activeCapability.id;
              const offsetClass =
                idx === 1 ? 'lg:translate-x-4' : idx === 2 ? 'lg:translate-x-1' : '';
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveId(item.id)}
                  className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer ${offsetClass} ${
                    isSelected
                      ? 'border-[#111111] bg-[#111111] text-white shadow-sm'
                      : 'border-neutral-200 bg-white text-[#262626] hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <CapabilityIcon
                    id={item.id}
                    color={isSelected ? '#C6FA52' : item.accent}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Center Editorial Philosophy Statement */}
          <div className="text-center">
            <h2 className="mx-auto max-w-[680px] font-sans text-[clamp(1.65rem,3.1vw,2.65rem)] font-medium leading-[1.24] tracking-[-0.03em] text-[#111111]">
              My focus is on pairing clean, responsive code with bold graphic storytelling{' '}
              <span className="text-[#A3A3A3]">
                to build websites and brands that stand out
              </span>
            </h2>
          </div>

          {/* Right Interactive Capabilities */}
          <div className="flex flex-wrap justify-center gap-2.5 lg:flex-col lg:items-end lg:gap-5">
            {rightCapabilities.map((item, idx) => {
              const isSelected = item.id === activeCapability.id;
              const offsetClass =
                idx === 1 ? 'lg:-translate-x-4' : idx === 2 ? 'lg:-translate-x-1' : '';
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveId(item.id)}
                  className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer ${offsetClass} ${
                    isSelected
                      ? 'border-[#111111] bg-[#111111] text-white shadow-sm'
                      : 'border-neutral-200 bg-white text-[#262626] hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <CapabilityIcon
                    id={item.id}
                    color={isSelected ? '#C6FA52' : item.accent}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active capability focus note + quick jump */}
        <div
          aria-live="polite"
          className="mx-auto mt-10 flex max-w-[680px] flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-6 text-center sm:flex-row sm:text-left"
        >
          <div>
            <p className="text-[13px] font-semibold text-[#111111]">
              {activeCapability.label}
            </p>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#525252]">
              {activeCapability.description}
            </p>
          </div>
          <a
            href={activeCapability.targetSection}
            onClick={() => onFilterByCategory(activeCapability.relatedCategory)}
            className="inline-flex min-h-[40px] items-center gap-1.5 text-[13px] font-medium text-[#111111] whitespace-nowrap shrink-0 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] rounded-sm"
          >
            <span>See {activeCapability.relatedCategory} work</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
