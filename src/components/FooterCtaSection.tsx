import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { PERSONAL_PROFILE } from '../data/portfolioData';
import type { SubmittedInquiry } from './ContactModal';
import {
  validateContactMessageForm,
  type ContactMessageErrors,
} from '../utils/portfolio';

interface FooterCtaSectionProps {
  onDownloadResume: () => void;
  onSubmitInquiry: (inquiry: SubmittedInquiry) => void;
}

export function FooterCtaSection({
  onDownloadResume,
  onSubmitInquiry,
}: FooterCtaSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ContactMessageErrors>({});
  const [sentMessage, setSentMessage] = useState<{
    name: string;
    subject: string;
    email: string;
    submittedAt: string;
  } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateContactMessageForm({ name, email, subject, message });
    if (!result.valid || !result.normalized) {
      setErrors(result.errors);
      return;
    }

    const submittedAt = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    onSubmitInquiry({
      id: `msg-${Date.now()}`,
      name: result.normalized.name,
      email: result.normalized.email,
      scope: result.normalized.subject,
      budget: 'Direct Message',
      message: result.normalized.message,
      submittedAt,
    });

    setSentMessage({
      name: result.normalized.name,
      subject: result.normalized.subject,
      email: result.normalized.email,
      submittedAt,
    });
    setErrors({});
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <footer
      id="contact"
      className="scroll-mt-20 relative mt-14 overflow-hidden border-t border-neutral-200/80 bg-white text-[#111111]"
    >
      {/* Signature portfolio acid-lime top ambient wash */}
      <div
        aria-hidden="true"
        className="cta-lime-aura pointer-events-none absolute inset-x-0 top-0 h-[320px] opacity-55"
      />

      {/* Main Contact Me Section (Same Format, Native Light Portfolio Theme) */}
      <div className="relative mx-auto max-w-[1140px] px-6 pt-20 pb-20 md:px-10 md:pt-24 md:pb-24">
        {/* Subtle decorative @ marks matching the requested contact layout */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-14 left-6 select-none font-sans text-[52px] font-semibold leading-none text-[#111111]/[0.05] md:left-10"
        >
          @
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-14 right-6 select-none font-sans text-[52px] font-semibold leading-none text-[#111111]/[0.05] md:right-10"
        >
          @
        </span>

        {/* Centered Section Header */}
        <div className="text-center">
          <p className="font-serif italic text-[18px] text-[#525252]">
            Let&apos;s Connect
          </p>
          <h2 className="mt-1.5 font-sans text-[clamp(2.1rem,4.4vw,3.45rem)] font-medium tracking-[-0.03em] text-[#111111]">
            Contact Me
          </h2>
        </div>

        {/* 2-Column Layout: Left Send a Message Card | Right Get in Touch Details */}
        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          {/* Left Column: Send a Message Form Card */}
          <div className="rounded-[24px] border border-neutral-200/90 bg-white/95 p-6 shadow-[0_24px_56px_-28px_rgba(17,17,17,0.16)] backdrop-blur-xs sm:p-8">
            <h3 className="text-center font-sans text-[22px] font-medium tracking-[-0.02em] text-[#111111]">
              Send a Message
            </h3>

            {sentMessage ? (
              <div className="mt-6 rounded-[18px] border border-neutral-200 bg-[#F9FBF5] p-6">
                <div className="flex items-center gap-2.5 text-[#111111]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#65A30D]" aria-hidden="true" />
                  <p className="text-[16px] font-semibold text-[#111111]">Message Sent</p>
                </div>
                <p className="mt-2.5 text-[14px] leading-[1.65] text-[#404040]">
                  Thank you, <strong className="font-semibold text-[#111111]">{sentMessage.name}</strong>.
                  Your note regarding <strong className="font-medium text-[#111111]">{sentMessage.subject}</strong>{' '}
                  was received at {sentMessage.submittedAt}. I&apos;ll respond to{' '}
                  <span className="font-medium text-[#111111] underline underline-offset-2">
                    {sentMessage.email}
                  </span>{' '}
                  within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSentMessage(null)}
                  className="mt-5 inline-flex min-h-[42px] items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-2 text-[13px] font-medium text-[#111111] transition-colors hover:border-[#111111] hover:bg-neutral-50 cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-[13px] font-medium text-[#262626]"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Your name"
                      aria-invalid={Boolean(errors.name)}
                      className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-[14px] text-[#111111] placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-1 focus:outline-[#111111] ${
                        errors.name ? 'border-red-500 bg-red-50/40' : 'border-neutral-200 bg-[#FAFAFA] focus:bg-white'
                      }`}
                    />
                    {errors.name && (
                      <p role="alert" className="mt-1.5 text-[12px] text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[13px] font-medium text-[#262626]"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                      className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-[14px] text-[#111111] placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-1 focus:outline-[#111111] ${
                        errors.email ? 'border-red-500 bg-red-50/40' : 'border-neutral-200 bg-[#FAFAFA] focus:bg-white'
                      }`}
                    />
                    {errors.email && (
                      <p role="alert" className="mt-1.5 text-[12px] text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-[13px] font-medium text-[#262626]"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                    }}
                    placeholder="Website redesign, brand graphics, or collaboration"
                    aria-invalid={Boolean(errors.subject)}
                    className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-[14px] text-[#111111] placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-1 focus:outline-[#111111] ${
                      errors.subject ? 'border-red-500 bg-red-50/40' : 'border-neutral-200 bg-[#FAFAFA] focus:bg-white'
                    }`}
                  />
                  {errors.subject && (
                    <p role="alert" className="mt-1.5 text-[12px] text-red-600">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[13px] font-medium text-[#262626]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                    placeholder="Tell me about your project, goals, and timeline..."
                    aria-invalid={Boolean(errors.message)}
                    className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-[14px] text-[#111111] placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-1 focus:outline-[#111111] ${
                      errors.message ? 'border-red-500 bg-red-50/40' : 'border-neutral-200 bg-[#FAFAFA] focus:bg-white'
                    }`}
                  />
                  {errors.message && (
                    <p role="alert" className="mt-1.5 text-[12px] text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-150 hover:bg-[#262626] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
                >
                  <Send className="h-4 w-4 text-[#D9FA7A]" aria-hidden="true" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Get in Touch Details + Connect with Me + Availability */}
          <div className="flex flex-col justify-between lg:pt-3">
            <div>
              <h3 className="text-center font-sans text-[22px] font-medium tracking-[-0.02em] text-[#111111] lg:text-left">
                Get in Touch
              </h3>

              <div className="mt-7 space-y-6">
                {/* Email */}
                <a
                  href={`mailto:${PERSONAL_PROFILE.email}`}
                  className="group flex items-center gap-4"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A] transition-transform duration-150 group-hover:scale-105">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[#111111]">Email</p>
                    <p className="mt-0.5 break-all text-[14px] text-[#525252] transition-colors group-hover:text-[#111111]">
                      {PERSONAL_PROFILE.email}
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A]">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-[#111111]">Location</p>
                    <p className="mt-0.5 text-[14px] text-[#525252]">
                      {PERSONAL_PROFILE.currentLocation}
                      <span className="text-[#8A8A8A]"> · {PERSONAL_PROFILE.hometown}</span>
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <a
                  href={PERSONAL_PROFILE.phoneHref}
                  className="group flex items-center gap-4"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A] transition-transform duration-150 group-hover:scale-105">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-[#111111]">Phone</p>
                    <p className="mt-0.5 text-[14px] text-[#525252] tabular-nums transition-colors group-hover:text-[#111111]">
                      {PERSONAL_PROFILE.phone}
                    </p>
                  </div>
                </a>
              </div>

              {/* Connect with Me */}
              <div className="mt-10">
                <p className="text-[14px] font-semibold text-[#111111]">Connect with Me</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={PERSONAL_PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with Sandeep Kohar on LinkedIn"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-[#D9FA7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={PERSONAL_PROFILE.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Sandeep Kohar on Instagram"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-[#D9FA7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={PERSONAL_PROFILE.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Sandeep Kohar on Facebook"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-[#D9FA7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                  >
                    <Facebook className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={`mailto:${PERSONAL_PROFILE.email}`}
                    aria-label="Email Sandeep Kohar"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-[#D9FA7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={PERSONAL_PROFILE.phoneHref}
                    aria-label="Call Sandeep Kohar"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-[#D9FA7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={onDownloadResume}
                    aria-label="Download Sandeep Kohar Resume PDF"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-[13px] font-medium text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-[#D9FA7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Resume PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Availability Card */}
            <div className="mt-10 rounded-[18px] border border-neutral-200/90 bg-[#FAFAFA] p-5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A]">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-[15px] font-semibold text-[#111111]">Availability</p>
              </div>
              <p className="mt-2.5 text-[13.5px] leading-[1.65] text-[#525252]">
                I respond to messages within 24 hours. Open to freelance web development,
                graphic design opportunities, and collaborations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Clean Copyright Bar */}
      <div className="border-t border-neutral-200/80 bg-[#FAFAFA] px-6 py-6 text-center">
        <p className="text-[13px] text-[#666666] tabular-nums">
          &copy; 2026 {PERSONAL_PROFILE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
