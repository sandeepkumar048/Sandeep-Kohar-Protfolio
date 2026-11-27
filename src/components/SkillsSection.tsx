import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Code2,
  LayoutGrid,
  PenTool,
  Users,
  X,
} from 'lucide-react';
import {
  PERSONAL_PROFILE,
  SKILL_GROUPS,
  type SkillGroup,
} from '../data/portfolioData';

const SKILL_GROUP_META: Record<
  string,
  { lines: [string, string]; subtitle: string }
> = {
  'frontend-technical': {
    lines: ['Front-End &', 'Technical'],
    subtitle:
      'Responsive markup, styling, and practical hardware and software troubleshooting.',
  },
  'design-skills': {
    lines: ['Design', 'Skills'],
    subtitle:
      'Visual communication, graphic branding, social media campaigns, and clean UI/UX.',
  },
  'tools-software': {
    lines: ['Tools &', 'Software'],
    subtitle:
      'Everyday design, layout, documentation, and spreadsheet productivity tools.',
  },
  'soft-skills': {
    lines: ['Soft', 'Skills'],
    subtitle:
      'Collaborative engineering mindset shaped across studio projects and campus teams.',
  },
};

function ServiceFrameIcon({
  id,
  className = 'h-7 w-7',
}: {
  id: string;
  className?: string;
}) {
  switch (id) {
    case 'frontend-technical':
      return <Code2 className={className} strokeWidth={1.75} aria-hidden="true" />;
    case 'design-skills':
      return <PenTool className={className} strokeWidth={1.75} aria-hidden="true" />;
    case 'tools-software':
      return (
        <LayoutGrid className={className} strokeWidth={1.75} aria-hidden="true" />
      );
    default:
      return <Users className={className} strokeWidth={1.75} aria-hidden="true" />;
  }
}

export function SkillsSection() {
  const [activeGroup, setActiveGroup] = useState<SkillGroup | null>(null);

  useEffect(() => {
    if (!activeGroup) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveGroup(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeGroup]);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
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
          <h2
            id="skills-heading"
            className="mt-2 font-sans text-[clamp(2.1rem,4.4vw,3.45rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#111111]"
          >
            Skills &amp; <span className="font-serif italic font-normal">Expertise</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[540px] text-[15px] leading-[1.6] text-[#525252]">
            Combining responsive front-end engineering, visual communication, and hands-on
            technical problem-solving.
          </p>
        </div>

        {/* Services Modal-Frame Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SKILL_GROUPS.map((group) => {
            const meta = SKILL_GROUP_META[group.id];
            return (
              <article
                key={group.id}
                className="group flex flex-col justify-between rounded-[18px] border border-neutral-200/80 bg-white px-7 pt-14 pb-8 shadow-[0_14px_38px_-24px_rgba(17,17,17,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#111111]/35 hover:shadow-[0_24px_52px_-26px_rgba(17,17,17,0.22)]"
              >
                <div>
                  <span className="inline-flex text-[#111111] transition-colors duration-200 group-hover:text-[#5C9100]">
                    <ServiceFrameIcon id={group.id} className="h-7 w-7" />
                  </span>

                  <h3 className="mt-6 font-sans text-[21px] font-semibold leading-[1.28] tracking-[-0.02em] text-[#111111]">
                    {meta ? (
                      <>
                        <span className="block">{meta.lines[0]}</span>
                        <span className="block">{meta.lines[1]}</span>
                      </>
                    ) : (
                      group.label
                    )}
                  </h3>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setActiveGroup(group)}
                    aria-label={`View more about ${group.label}`}
                    className="inline-flex min-h-[40px] items-center gap-2 text-[14px] font-medium text-[#525252] transition-colors duration-150 hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] rounded-sm cursor-pointer"
                  >
                    <span>View More</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </article>
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

      {/* Services Modal Frame Popup */}
      {activeGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5 backdrop-blur-xs"
          onClick={() => setActiveGroup(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="skills-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[480px] rounded-[22px] border border-neutral-200 bg-white p-7 shadow-[0_32px_80px_-24px_rgba(17,17,17,0.35)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A]">
                  <ServiceFrameIcon id={activeGroup.id} className="h-5 w-5" />
                </span>
                <div>
                  <h3
                    id="skills-modal-title"
                    className="font-sans text-[21px] font-semibold leading-snug tracking-[-0.02em] text-[#111111]"
                  >
                    {activeGroup.label}
                  </h3>
                  <p className="mt-0.5 text-[12.5px] font-medium text-[#737373] tabular-nums">
                    {activeGroup.items.length} core skills
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveGroup(null)}
                aria-label={`Close ${activeGroup.label} details`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-[#525252] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {SKILL_GROUP_META[activeGroup.id]?.subtitle && (
              <p className="mt-4 text-[14px] leading-[1.6] text-[#525252]">
                {SKILL_GROUP_META[activeGroup.id].subtitle}
              </p>
            )}

            <ul className="mt-6 space-y-3 border-t border-neutral-100 pt-5">
              {activeGroup.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-[14.5px] text-[#262626]"
                >
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#65A30D]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
