import { useState } from 'react';
import { Award, FolderGit2, Layers, Users } from 'lucide-react';
import {
  HIGHLIGHT_ITEMS,
  type HighlightCategory,
  type HighlightItem,
} from '../data/portfolioData';
import { filterHighlightsByCategory } from '../utils/portfolio';

const HIGHLIGHT_TABS: Array<{
  value: HighlightCategory;
  label: string;
}> = [
  { value: 'All', label: 'All' },
  { value: 'Project', label: 'Projects' },
  { value: 'Award', label: 'Awards' },
  { value: 'Community', label: 'Community' },
];

const OVERVIEW_COLUMNS: Array<{
  category: Exclude<HighlightCategory, 'All'>;
  title: string;
  subtitle: string;
}> = [
  {
    category: 'Project',
    title: 'Projects',
    subtitle: 'Selected engineering & design builds',
  },
  {
    category: 'Award',
    title: 'Awards',
    subtitle: 'Certifications & campus honors',
  },
  {
    category: 'Community',
    title: 'Community',
    subtitle: 'Clubs, leadership & volunteer impact',
  },
];

function CategoryIcon({
  category,
  className = 'h-4 w-4',
}: {
  category: HighlightCategory;
  className?: string;
}) {
  switch (category) {
    case 'Project':
      return <FolderGit2 className={className} aria-hidden="true" />;
    case 'Award':
      return <Award className={className} aria-hidden="true" />;
    case 'Community':
      return <Users className={className} aria-hidden="true" />;
    default:
      return <Layers className={className} aria-hidden="true" />;
  }
}

function HighlightCard({ item }: { item: HighlightItem }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-[22px] border border-neutral-200/90 bg-white p-6 shadow-[0_16px_38px_-26px_rgba(17,17,17,0.16)] transition-all duration-200 hover:border-[#111111]/40 hover:shadow-[0_22px_48px_-26px_rgba(17,17,17,0.22)]">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[12px] font-medium text-[#525252]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A]">
              <CategoryIcon category={item.category} className="h-3.5 w-3.5" />
            </span>
            <span>{item.detail}</span>
          </span>
          <span className="text-[12px] font-medium text-[#737373] tabular-nums whitespace-nowrap">
            {item.period}
          </span>
        </div>

        <h3 className="mt-4 font-sans text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[#111111]">
          {item.title}
        </h3>
        <p className="mt-1 text-[13px] font-medium text-[#666666]">{item.organization}</p>
        <p className="mt-3 text-[13.5px] leading-[1.65] text-[#404040]">{item.summary}</p>
      </div>

      <div className="mt-5 border-t border-neutral-100 pt-3.5">
        <p className="text-[12px] font-medium text-[#666666]">
          {item.tags.join(' · ')}
        </p>
      </div>
    </article>
  );
}

export function HighlightsSection() {
  const [activeTab, setActiveTab] = useState<HighlightCategory>('All');

  const filteredItems = filterHighlightsByCategory(HIGHLIGHT_ITEMS, activeTab);

  return (
    <section
      id="highlights"
      aria-labelledby="highlights-heading"
      className="scroll-mt-20 border-t border-neutral-100 bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1140px] px-6 md:px-10">
        {/* Centered Editorial Section Header */}
        <div className="text-center">
          <p className="font-serif italic text-[18px] text-[#525252]">
            Impact &amp; Leadership
          </p>
          <h2
            id="highlights-heading"
            className="mt-2 font-sans text-[clamp(2.1rem,4.4vw,3.45rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#111111]"
          >
            Projects, Awards &amp;{' '}
            <span className="font-serif italic font-normal">Community</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-[1.6] text-[#525252]">
            Hands-on engineering builds, verified design and web certifications, and active
            leadership across student and civic communities in Kathmandu.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter projects, awards, and community highlights"
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
        >
          {HIGHLIGHT_TABS.map((tab) => {
            const isSelected = activeTab === tab.value;
            const count = filterHighlightsByCategory(HIGHLIGHT_ITEMS, tab.value).length;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                id={`highlights-tab-${tab.value.toLowerCase()}`}
                aria-selected={isSelected}
                aria-controls="highlights-panel"
                onClick={() => setActiveTab(tab.value)}
                className={`inline-flex min-h-[42px] items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer ${
                  isSelected
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : 'border-neutral-200 bg-white text-[#525252] hover:border-[#111111]/50 hover:text-[#111111]'
                }`}
              >
                <CategoryIcon
                  category={tab.value}
                  className={`h-3.5 w-3.5 ${isSelected ? 'text-[#D9FA7A]' : 'text-[#737373]'}`}
                />
                <span>{tab.label}</span>
                <span
                  className={`text-[12px] tabular-nums ${
                    isSelected ? 'text-neutral-300' : 'text-[#8A8A8A]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Panel */}
        <div
          id="highlights-panel"
          role="tabpanel"
          aria-labelledby={`highlights-tab-${activeTab.toLowerCase()}`}
          className="mt-12"
        >
          {activeTab === 'All' ? (
            /* 3-Column Overview: Projects | Awards | Community side by side */
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-7">
              {OVERVIEW_COLUMNS.map((column) => {
                const colItems = filterHighlightsByCategory(HIGHLIGHT_ITEMS, column.category);
                return (
                  <div
                    key={column.category}
                    className="flex flex-col rounded-[24px] border border-neutral-200/90 bg-[#FAFAFA] p-6"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-neutral-200/80 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A]">
                          <CategoryIcon category={column.category} className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className="font-sans text-[19px] font-semibold tracking-[-0.02em] text-[#111111]">
                            {column.title}
                          </h3>
                          <p className="text-[12.5px] text-[#666666]">{column.subtitle}</p>
                        </div>
                      </div>
                      <span className="font-serif italic text-[16px] text-[#737373] tabular-nums">
                        0{colItems.length}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-1 flex-col divide-y divide-neutral-200/80">
                      {colItems.map((item) => (
                        <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className="text-[15px] font-semibold leading-snug text-[#111111]">
                              {item.title}
                            </h4>
                            <span className="shrink-0 text-[11.5px] font-medium text-[#737373] tabular-nums">
                              {item.period}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[12.5px] font-medium text-[#666666]">
                            {item.organization}
                          </p>
                          <p className="mt-2 text-[13px] leading-[1.6] text-[#404040]">
                            {item.summary}
                          </p>
                          <p className="mt-2.5 text-[11.5px] font-medium text-[#737373]">
                            {item.tags.join(' · ')}
                          </p>
                        </article>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab(column.category)}
                      className="mt-5 inline-flex min-h-[40px] w-full items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-[12.5px] font-medium text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
                    >
                      Focus {column.title}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Expanded 3-Card Focused Track View */
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {filteredItems.map((item) => (
                <HighlightCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
