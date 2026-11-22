import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '../data/portfolioData';
import { paginateTestimonials } from '../utils/portfolio';

export function TestimonialsSection() {
  const [pageIndex, setPageIndex] = useState(0);
  const { items, totalPages, safePageIndex } = paginateTestimonials(
    TESTIMONIALS,
    pageIndex,
    2
  );

  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1140px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
          {items.map((item, idx) => (
            <article
              key={item.id}
              className={`flex flex-col justify-between ${
                idx === 0
                  ? 'md:pr-12 lg:pr-16'
                  : 'border-t border-neutral-200 pt-10 md:border-t-0 md:border-l md:pt-16 md:pl-12 lg:pl-16'
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                <blockquote className="max-w-[380px] text-[15px] leading-[1.68] text-[#262626]">
                  {item.quote}
                </blockquote>
                <span
                  aria-hidden="true"
                  className="font-sans text-[44px] font-bold leading-none text-[#111111] select-none shrink-0"
                >
                  &rdquo;
                </span>
              </div>

              <div className="mt-7 flex items-center gap-3.5">
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: item.avatarBg }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-semibold text-[#111111] shrink-0"
                >
                  {item.initials}
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-[#111111]">
                    {item.author}
                  </p>
                  <p className="text-[12px] text-[#666666]">
                    {item.role} at {item.company}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Subtle testimonial pagination controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPageIndex((prev) => prev - 1)}
              aria-label="Previous client testimonials"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[12px] font-medium text-[#666666] tabular-nums">
              0{safePageIndex + 1} / 0{totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPageIndex((prev) => prev + 1)}
              aria-label="Next client testimonials"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
