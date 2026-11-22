import { useState } from 'react';
import { Check, Download, Linkedin, Menu, X } from 'lucide-react';
import { PERSONAL_PROFILE } from '../data/portfolioData';

interface NavbarProps {
  onDownloadResume: () => void;
  resumeDownloaded: boolean;
  inquiryCount: number;
}

const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Web Design', href: '#web-showcase' },
  { label: 'Graphics', href: '#graphics-showcase' },
  { label: 'Skills', href: '#skills' },
];

export function Navbar({
  onDownloadResume,
  resumeDownloaded,
  inquiryCount,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-neutral-100">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6 md:px-10">
        {/* Zone 1: Single-element editorial wordmark */}
        <a
          href="#top"
          className="font-serif italic text-[1.65rem] leading-none tracking-[-0.02em] text-[#111111] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] rounded-sm"
        >
          Sandeep Kohar
        </a>

        {/* Zone 2: Concise single-line navigation links + Resume PDF download */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-[14px] font-medium text-[#525252]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#111111] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#111111] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] rounded-sm"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onDownloadResume}
            aria-label="Download Resume PDF"
            className="inline-flex items-center gap-1.5 py-1 text-[14px] font-medium text-[#111111] whitespace-nowrap shrink-0 transition-opacity duration-150 hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] rounded-sm cursor-pointer"
          >
            {resumeDownloaded ? (
              <Check className="h-3.5 w-3.5 text-[#65A30D]" aria-hidden="true" />
            ) : (
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{resumeDownloaded ? 'Saved PDF' : 'Resume'}</span>
          </button>
        </nav>

        {/* Zone 3: LinkedIn profile + Primary CTA on desktop + mobile drawer button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={PERSONAL_PROFILE.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sandeep Kohar on LinkedIn"
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors duration-150 hover:border-[#111111] hover:bg-[#111111] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
          </a>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-2.5 text-[13px] font-medium text-white whitespace-nowrap shrink-0 transition-transform duration-150 hover:bg-[#262626] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
          >
            {inquiryCount > 0 ? `Contact Me (${inquiryCount})` : 'Contact Me'}
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors hover:bg-neutral-50 md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-neutral-100 bg-white px-6 py-5 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center text-[15px] font-medium text-[#111111] hover:text-[#525252]"
              >
                {link.label}
              </a>
            ))}
            <a
              href={PERSONAL_PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center gap-2 text-[15px] font-medium text-[#111111] hover:text-[#525252]"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
            <button
              type="button"
              onClick={() => {
                onDownloadResume();
                setMobileMenuOpen(false);
              }}
              className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-[14px] font-medium text-[#111111] hover:bg-neutral-50 cursor-pointer"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download Resume PDF</span>
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#111111] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#262626]"
            >
              {inquiryCount > 0 ? `Contact Me (${inquiryCount})` : 'Contact Me'}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
