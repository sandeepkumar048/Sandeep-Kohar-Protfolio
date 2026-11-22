import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { PERSONAL_PROFILE } from '../data/portfolioData';
import {
  validateInquiryForm,
  type InquiryFormInput,
  type InquiryValidationErrors,
} from '../utils/portfolio';

export interface SubmittedInquiry extends InquiryFormInput {
  id: string;
  submittedAt: string;
}

interface ContactModalProps {
  open: boolean;
  defaultScope?: string;
  submittedInquiries: SubmittedInquiry[];
  onClose: () => void;
  onSubmitInquiry: (inquiry: SubmittedInquiry) => void;
}

const SCOPES = [
  'Web Development',
  'Graphic Design',
  'Social Media Design',
  'Brand & UI/UX',
];

const BUDGETS = [
  'Under $500',
  '$500 – $1,500',
  '$1,500 – $3,000',
  'Custom / Ongoing',
];

export function ContactModal({
  open,
  defaultScope,
  submittedInquiries,
  onClose,
  onSubmitInquiry,
}: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState(defaultScope || SCOPES[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<InquiryValidationErrors>({});
  const [lastSubmitted, setLastSubmitted] = useState<SubmittedInquiry | null>(null);

  useEffect(() => {
    if (defaultScope && SCOPES.includes(defaultScope)) {
      setScope(defaultScope);
    }
  }, [defaultScope]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateInquiryForm({ name, email, scope, budget, message });
    if (!result.valid || !result.normalized) {
      setErrors(result.errors);
      return;
    }

    const created: SubmittedInquiry = {
      ...result.normalized,
      id: `inq-${Date.now()}`,
      submittedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    onSubmitInquiry(created);
    setLastSubmitted(created);
    setErrors({});
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 sm:p-6 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-serif italic text-[17px] text-[#525252]">Start a Conversation</p>
            <h2
              id="contact-modal-title"
              className="mt-1 font-sans text-[26px] font-medium tracking-[-0.03em] text-[#111111]"
            >
              Tell me about your project
            </h2>
            <p className="mt-1.5 text-[12.5px] text-[#666666]">
              Direct: <span className="text-[#111111]">{PERSONAL_PROFILE.email}</span> ·{' '}
              <span className="tabular-nums text-[#111111]">{PERSONAL_PROFILE.phone}</span> ·{' '}
              <a
                href={PERSONAL_PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#111111] underline underline-offset-2 hover:opacity-75"
              >
                LinkedIn
              </a>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact dialog"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#111111] transition-colors hover:bg-neutral-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {lastSubmitted ? (
          <div className="mt-6 rounded-[20px] border border-neutral-200 bg-[#F9FBF5] p-6">
            <div className="flex items-center gap-2.5 text-[#111111]">
              <CheckCircle2 className="h-5 w-5 text-[#65A30D] shrink-0" />
              <h3 className="text-[16px] font-semibold">Inquiry received</h3>
            </div>
            <p className="mt-2.5 text-[14px] leading-[1.6] text-[#404040]">
              Thank you, <strong className="font-semibold text-[#111111]">{lastSubmitted.name}</strong>.
              Your brief for <strong className="font-medium text-[#111111]">{lastSubmitted.scope}</strong>{' '}
              ({lastSubmitted.budget}) has been logged at {lastSubmitted.submittedAt}. I&apos;ll reply
              to <span className="underline">{lastSubmitted.email}</span> within one business day.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setLastSubmitted(null)}
                className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-[13px] font-medium text-[#111111] hover:bg-neutral-50 cursor-pointer"
              >
                Send another note
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#111111] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#262626] cursor-pointer"
              >
                Back to portfolio
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="inquiry-name"
                  className="block text-[13px] font-medium text-[#262626]"
                >
                  Your Name
                </label>
                <input
                  id="inquiry-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Alex Rivera"
                  aria-invalid={Boolean(errors.name)}
                  className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-[14px] text-[#111111] placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-1 focus:outline-[#111111] ${
                    errors.name ? 'border-red-500 bg-red-50/30' : 'border-neutral-200 bg-white'
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
                  htmlFor="inquiry-email"
                  className="block text-[13px] font-medium text-[#262626]"
                >
                  Work Email
                </label>
                <input
                  id="inquiry-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="alex@studio.com"
                  aria-invalid={Boolean(errors.email)}
                  className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-[14px] text-[#111111] placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-1 focus:outline-[#111111] ${
                    errors.email ? 'border-red-500 bg-red-50/30' : 'border-neutral-200 bg-white'
                  }`}
                />
                {errors.email && (
                  <p role="alert" className="mt-1.5 text-[12px] text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Project Scope Selector */}
            <div>
              <span className="block text-[13px] font-medium text-[#262626]">
                Project Focus
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {SCOPES.map((item) => {
                  const selected = scope === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setScope(item)}
                      className={`min-h-[38px] rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-neutral-200 bg-white text-[#404040] hover:border-neutral-300'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Select */}
            <div>
              <label
                htmlFor="inquiry-budget"
                className="block text-[13px] font-medium text-[#262626]"
              >
                Estimated Budget
              </label>
              <select
                id="inquiry-budget"
                name="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] text-[#111111] focus:outline-2 focus:outline-offset-1 focus:outline-[#111111]"
              >
                {BUDGETS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="inquiry-message"
                className="block text-[13px] font-medium text-[#262626]"
              >
                Project Details
              </label>
              <textarea
                id="inquiry-message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                }}
                placeholder="Share your goals, product stage, and target timeline..."
                aria-invalid={Boolean(errors.message)}
                className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-[14px] text-[#111111] placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-1 focus:outline-[#111111] ${
                  errors.message ? 'border-red-500 bg-red-50/30' : 'border-neutral-200 bg-white'
                }`}
              />
              {errors.message && (
                <p role="alert" className="mt-1.5 text-[12px] text-red-600">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <p className="text-[12px] text-[#737373]">
                Typical response time: under 24 hours
              </p>
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#111111] px-6 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#262626] cursor-pointer"
              >
                <span>Send Inquiry</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* Recent sent inquiries tracker if any submitted in this session */}
        {submittedInquiries.length > 0 && !lastSubmitted && (
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-[12px] font-medium text-[#525252]">
              Sent in this session ({submittedInquiries.length})
            </p>
            <ul className="mt-2 space-y-1.5 text-[12px] text-[#666666]">
              {submittedInquiries.map((inq) => (
                <li key={inq.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    {inq.name} · {inq.scope} ({inq.budget})
                  </span>
                  <span className="shrink-0 tabular-nums">{inq.submittedAt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
