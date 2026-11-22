import { useState } from 'react';
import { Award, Code2, Palette, Sparkles, Wrench } from 'lucide-react';
import { PERSONAL_PROFILE, SKILL_GROUPS } from '../data/portfolioData';

function SkillIcon({ id }: { id: string }) {
  switch (id) {
    case 'frontend-technical':
      return <Code2 className="h-4 w-4" aria-hidden="true" />;
    case 'design-skills':
      return <Palette className="h-4 w-4" aria-hidden="true" />;
    case 'tools-software':
      return <Wrench className="h-4 w-4" aria-hidden="true" />;
    default:
      return <Sparkles className="h-4 w-4" aria-hidden="true" />;
  }
}

export function SkillsSection() {
  const [activeGroupId, setActiveGroupId] = useState<string>(SKILL_GROUPS[0].id);

  return (
    <section
      id="skills"
      className="scroll-mt-20 relative overflow-hidden bg-white py-20 md:py-28"
    >
      {/* Subtle acid-lime atmospheric glow matching the portfolio visual language */}
      <div
        aria-hidden="true"
        className="process-lime-aura pointer-events-none absolute inset-x-0 top-10 bottom-10"
      />

      <div className="relative mx-auto max-w-[1140px] px-6 md:px-10">
        {/* Centered Editorial Header */}
        <div className="text-center">
          <p className="font-serif italic text-[18px] text-[#525252]">
            Capabilities &amp; Craft
          </p>
          <h2 className="mt-2 font-sans text-[clamp(2.1rem,4.4vw,3.45rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#111111]">
            Skills &amp; <span className="font-serif italic font-normal">Expertise</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[540px] text-[15px] leading-[1.6] text-[#525252]">
            Combining responsive front-end engineering, visual communication, and hands-on
            technical problem-solving.
          </p>
        </div>

        {/* 2x2 Editorial Skill Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
          {SKILL_GROUPS.map((group, idx) => {
            const isSelected = activeGroupId === group.id;
            const numberLabel = String(idx + 1).padStart(2, '0');
            return (
              <button
                key={group.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveGroupId(group.id)}
                className={`group flex flex-col justify-between rounded-[24px] border bg-white/95 p-7 text-left backdrop-blur-xs transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] cursor-pointer ${
                  isSelected
                    ? 'border-[#111111] shadow-[0_24px_54px_-28px_rgba(17,17,17,0.28)]'
                    : 'border-neutral-200/90 shadow-[0_14px_34px_-24px_rgba(17,17,17,0.12)] hover:border-neutral-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-serif italic text-[20px] text-[#737373] tabular-nums">
                      {numberLabel}
                    </span>
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? 'border-[#111111] bg-[#111111] text-[#D9FA7A]'
                          : 'border-neutral-200 bg-neutral-50 text-[#111111] group-hover:border-neutral-300'
                      }`}
                    >
                      <SkillIcon id={group.id} />
                    </span>
                  </div>

                  <h3 className="mt-4 font-sans text-[22px] font-medium tracking-[-0.025em] text-[#111111]">
                    {group.label}
                  </h3>

                  <ul className="mt-4 divide-y divide-neutral-100 border-t border-neutral-100">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center justify-between gap-3 py-2.5 text-[14px] text-[#404040] last:pb-0"
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                              isSelected ? 'bg-[#84CC16]' : 'bg-[#111111]'
                            }`}
                          />
                          <span>{item}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>

        {/* Certifications Strip */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[20px] border border-neutral-200/85 bg-white/95 px-6 py-5 sm:flex-row sm:items-center md:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A]">
              <Award className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-serif italic text-[14px] text-[#666666]">Certifications</p>
              <p className="text-[15px] font-semibold text-[#111111]">
                {PERSONAL_PROFILE.certifications.join(' · ')}
              </p>
            </div>
          </div>

          <p className="text-[13px] text-[#525252]">
            Bachelor of Computer Engineering · Himalayan White House International College, Putalisadak
          </p>
        </div>
      </div>
    </section>
  );
}
