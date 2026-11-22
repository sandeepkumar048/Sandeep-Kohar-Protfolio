import { useState } from 'react';
import { Briefcase, Calendar, ChevronDown, GraduationCap } from 'lucide-react';
import { CAREER_HISTORY, EDUCATION_HISTORY } from '../data/portfolioData';

type QualificationTab = 'education' | 'work';

interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  highlights?: string[];
}

export function QualificationSection() {
  const [activeTab, setActiveTab] = useState<QualificationTab>('education');
  const [expandedWorkId, setExpandedWorkId] = useState<string | null>(null);

  const items: TimelineEntry[] =
    activeTab === 'education'
      ? EDUCATION_HISTORY.map((edu) => ({
          id: edu.id,
          title: edu.degree,
          subtitle: edu.institution,
          period: edu.period,
        }))
      : CAREER_HISTORY.map((role) => ({
          id: role.id,
          title: role.role,
          subtitle: role.company,
          period: `${role.periodStart} – ${role.periodEnd}`,
          highlights: role.highlights,
        }));

  return (
    <section
      id="qualification"
      aria-labelledby="qualification-heading"
      className="scroll-mt-20 border-t border-neutral-100 bg-white py-20 md:py-24"
    >
      <div className="mx-auto max-w-[920px] px-6 md:px-10">
        {/* Centered Header matching reference format in portfolio editorial typography */}
        <div className="text-center">
          <h2
            id="qualification-heading"
            className="font-sans text-[clamp(2.1rem,4.4vw,3.35rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#111111]"
          >
            Qualification
          </h2>
          <p className="mt-1.5 font-serif italic text-[18px] text-[#666666]">
            My personal journey
          </p>
        </div>

        {/* Centered Education / Work Tab Switcher */}
        <div
          role="tablist"
          aria-label="Qualification categories"
          className="mt-10 flex items-center justify-center gap-8 sm:gap-12"
        >
          <button
            type="button"
            role="tab"
            id="tab-education"
            aria-selected={activeTab === 'education'}
            aria-controls="panel-qualification"
            onClick={() => setActiveTab('education')}
            className={`group relative inline-flex min-h-[44px] items-center gap-2.5 pb-2 text-[17px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] rounded-sm cursor-pointer ${
              activeTab === 'education'
                ? 'text-[#111111]'
                : 'text-[#737373] hover:text-[#111111]'
            }`}
          >
            <GraduationCap
              className={`h-5 w-5 transition-colors ${
                activeTab === 'education'
                  ? 'text-[#111111]'
                  : 'text-[#8A8A8A] group-hover:text-[#111111]'
              }`}
              strokeWidth={1.9}
              aria-hidden="true"
            />
            <span>Education</span>
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-[3px] rounded-full transition-all duration-200 ${
                activeTab === 'education' ? 'bg-[#B7F83C] opacity-100' : 'bg-transparent opacity-0'
              }`}
            />
          </button>

          <button
            type="button"
            role="tab"
            id="tab-work"
            aria-selected={activeTab === 'work'}
            aria-controls="panel-qualification"
            onClick={() => setActiveTab('work')}
            className={`group relative inline-flex min-h-[44px] items-center gap-2.5 pb-2 text-[17px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] rounded-sm cursor-pointer ${
              activeTab === 'work'
                ? 'text-[#111111]'
                : 'text-[#737373] hover:text-[#111111]'
            }`}
          >
            <Briefcase
              className={`h-5 w-5 transition-colors ${
                activeTab === 'work'
                  ? 'text-[#111111]'
                  : 'text-[#8A8A8A] group-hover:text-[#111111]'
              }`}
              strokeWidth={1.9}
              aria-hidden="true"
            />
            <span>Work</span>
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-[3px] rounded-full transition-all duration-200 ${
                activeTab === 'work' ? 'bg-[#B7F83C] opacity-100' : 'bg-transparent opacity-0'
              }`}
            />
          </button>
        </div>

        {/* Alternating Center-Spine Vertical Timeline */}
        <div
          id="panel-qualification"
          role="tabpanel"
          aria-labelledby={activeTab === 'education' ? 'tab-education' : 'tab-work'}
          className="mx-auto mt-12 max-w-[780px]"
        >
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;
            const isLast = index === items.length - 1;
            const isExpanded = expandedWorkId === item.id;

            const cardContent = (
              <div className={isLeft ? 'sm:text-right' : 'sm:text-left'}>
                <h3 className="font-sans text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#111111]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[14px] leading-relaxed text-[#525252]">
                  {item.subtitle}
                </p>
                <p
                  className={`mt-2.5 inline-flex items-center gap-1.5 text-[13px] text-[#737373] tabular-nums ${
                    isLeft ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-[#737373]" aria-hidden="true" />
                  <span>{item.period}</span>
                </p>

                {item.highlights && item.highlights.length > 0 && (
                  <div className="mt-2.5">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedWorkId((prev) => (prev === item.id ? null : item.id))
                      }
                      className={`inline-flex items-center gap-1 text-[12px] font-medium text-[#525252] transition-colors hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] rounded-sm cursor-pointer ${
                        isLeft ? 'sm:flex-row-reverse' : ''
                      }`}
                    >
                      <span>{isExpanded ? 'Hide details' : 'View highlights'}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-150 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isExpanded && (
                      <ul className="mt-2.5 space-y-1.5 rounded-2xl border border-neutral-200/80 bg-[#FAFAFA] p-4 text-left text-[12.5px] leading-[1.6] text-[#404040]">
                        {item.highlights.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2">
                            <span
                              aria-hidden="true"
                              className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#84CC16]"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );

            return (
              <div
                key={item.id}
                className="grid grid-cols-[28px_1fr] gap-x-4 sm:grid-cols-[1fr_44px_1fr] sm:gap-x-6"
              >
                {/* Desktop Left Slot */}
                <div className={`hidden sm:block ${isLast ? 'pb-0' : 'pb-11'}`}>
                  {isLeft ? cardContent : null}
                </div>

                {/* Center Spine (left rail on mobile, center axis on desktop) */}
                <div className="flex flex-col items-center">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full bg-[#111111] ring-4 ring-[#B7F83C]/65"
                  />
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="mt-1 w-[1.5px] flex-1 bg-neutral-300"
                    />
                  )}
                </div>

                {/* Desktop Right Slot & Mobile Content Slot */}
                <div className={isLast ? 'pb-0' : 'pb-11'}>
                  <div className="sm:hidden">{cardContent}</div>
                  <div className="hidden sm:block">{!isLeft ? cardContent : null}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
