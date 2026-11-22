import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import {
  ABOUT_PORTRAIT_SRC,
  CAREER_HISTORY,
  EDUCATION_HISTORY,
  PERSONAL_PROFILE,
} from '../data/portfolioData';

export function AboutSection() {
  const [portraitFailed, setPortraitFailed] = useState(false);

  return (
    <section id="about" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-[1140px] px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center">
          <p className="font-serif italic text-[18px] text-[#525252]">Who Am I</p>
          <h2 className="mt-2 font-sans text-[clamp(2.1rem,4.4vw,3.45rem)] font-medium tracking-[-0.03em] text-[#111111]">
            Crafting Code &amp; Design{' '}
            <span className="text-[#A3A3A3]">from Kathmandu</span>
          </h2>
        </div>

        {/* 2-Column Editorial Split: Portrait + Direct Contact | Bio + Key Facts */}
        <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(320px,430px)_1fr] lg:gap-16">
          {/* Left: Gently tilted studio portrait + real contact details */}
          <div className="mx-auto w-full max-w-[430px] lg:mx-0">
            <div className="overflow-hidden rounded-[22px] bg-[#36404F] shadow-[0_24px_56px_-26px_rgba(17,17,17,0.42)] transition-transform duration-300 md:-rotate-[1.5deg] hover:rotate-0">
              <div className="aspect-[4/3.6] w-full overflow-hidden">
                {portraitFailed ? (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-[#36404F] text-white">
                    <span className="font-serif italic text-3xl">{PERSONAL_PROFILE.name}</span>
                    <span className="mt-1 text-xs text-neutral-300">
                      {PERSONAL_PROFILE.title}
                    </span>
                  </div>
                ) : (
                  <img
                    src={ABOUT_PORTRAIT_SRC}
                    alt="Studio portrait of Sandeep Kohar, Web Developer and Graphics Designer"
                    referrerPolicy="no-referrer"
                    onError={() => setPortraitFailed(true)}
                    className="h-full w-full object-cover object-top"
                  />
                )}
              </div>
            </div>

            {/* Real Personal Identity, Contact Details & LinkedIn */}
            <div className="mt-6 border-t border-neutral-200/80 pt-5">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-[15px] font-semibold text-[#111111]">
                    {PERSONAL_PROFILE.name}
                  </p>
                  <p className="text-[12.5px] text-[#666666]">{PERSONAL_PROFILE.title}</p>
                </div>
                <span className="font-serif italic text-[14px] text-[#525252]">
                  B.E. Computer
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-[13px] text-[#404040]">
                <a
                  href={`mailto:${PERSONAL_PROFILE.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-[#111111]"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#737373]" aria-hidden="true" />
                  <span className="break-all">{PERSONAL_PROFILE.email}</span>
                </a>
                <a
                  href={PERSONAL_PROFILE.phoneHref}
                  className="flex items-center gap-2.5 tabular-nums transition-colors hover:text-[#111111]"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#737373]" aria-hidden="true" />
                  <span>{PERSONAL_PROFILE.phone}</span>
                </a>
                <a
                  href={PERSONAL_PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 font-medium text-[#111111] transition-colors hover:underline underline-offset-4"
                >
                  <Linkedin className="h-3.5 w-3.5 shrink-0 text-[#111111]" aria-hidden="true" />
                  <span>{PERSONAL_PROFILE.linkedinLabel}</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-[#737373] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
                <p className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#737373]" aria-hidden="true" />
                  <span>
                    {PERSONAL_PROFILE.currentLocation}
                    <span className="text-[#8A8A8A]"> · {PERSONAL_PROFILE.hometown}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Real About Me Bio & Profile Snapshot */}
          <div className="flex flex-col justify-between lg:pt-2">
            <div>
              <p className="font-serif italic text-[17px] text-[#525252]">About me</p>
              <p className="mt-3 max-w-[580px] text-[15.5px] leading-[1.78] text-[#262626]">
                {PERSONAL_PROFILE.aboutBio}
              </p>
            </div>

            {/* Clean Editorial Facts Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-neutral-200/80 pt-8 sm:grid-cols-3">
              <div>
                <p className="text-[12px] font-medium text-[#737373]">Current Study</p>
                <p className="mt-1.5 text-[14.5px] font-semibold text-[#111111]">
                  {EDUCATION_HISTORY[0].degree}
                </p>
                <p className="mt-0.5 text-[12.5px] text-[#666666] tabular-nums">
                  {EDUCATION_HISTORY[0].period}
                </p>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#737373]">Active Experience</p>
                <p className="mt-1.5 text-[14.5px] font-semibold text-[#111111]">
                  {CAREER_HISTORY.length} Organizations
                </p>
                <p className="mt-0.5 text-[12.5px] text-[#666666]">
                  Design, IT &amp; Campaigns
                </p>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#737373]">Certifications</p>
                <p className="mt-1.5 text-[14.5px] font-semibold text-[#111111]">
                  {PERSONAL_PROFILE.certifications.join(' & ')}
                </p>
                <p className="mt-0.5 text-[12.5px] text-[#666666]">
                  Web &amp; Visual Craft
                </p>
              </div>
            </div>

            {/* Direct Link to Qualification Timeline */}
            <div className="mt-10">
              <a
                href="#qualification"
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-[13.5px] font-medium text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
              >
                <span>Explore Education &amp; Work Journey</span>
                <ArrowDownRight
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
