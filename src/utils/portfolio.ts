import type {
  HighlightCategory,
  HighlightItem,
  PortfolioProject,
  ProjectCategory,
  ShowcaseTrack,
  TestimonialItem,
} from '../data/portfolioData';

export interface InquiryFormInput {
  name: string;
  email: string;
  scope: string;
  budget: string;
  message: string;
}

export interface InquiryValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface InquiryValidationResult {
  valid: boolean;
  errors: InquiryValidationErrors;
  normalized?: InquiryFormInput;
}

export function filterProjectsByCategory(
  projects: PortfolioProject[],
  category: ProjectCategory
): PortfolioProject[] {
  if (category === 'All') {
    return projects;
  }
  return projects.filter((project) => project.category === category);
}

export function filterProjectsByShowcase(
  projects: PortfolioProject[],
  track: ShowcaseTrack,
  category: ProjectCategory = 'All'
): PortfolioProject[] {
  const trackItems = projects.filter((project) => project.showcase === track);
  if (category === 'All') {
    return trackItems;
  }
  return trackItems.filter((project) => project.category === category);
}

export function filterHighlightsByCategory(
  items: HighlightItem[],
  category: HighlightCategory
): HighlightItem[] {
  if (category === 'All') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

export function shouldShowBackToTop(scrollY: number, heroHeight: number): boolean {
  const safeHeroHeight = heroHeight > 0 ? heroHeight : 640;
  const threshold = Math.max(300, safeHeroHeight - 64);
  return scrollY >= threshold;
}

export function getNextSlideIndex(
  currentIndex: number,
  totalSlides: number,
  direction: 'next' | 'prev'
): number {
  if (totalSlides <= 0) {
    return 0;
  }
  const safeCurrent = ((currentIndex % totalSlides) + totalSlides) % totalSlides;
  const delta = direction === 'next' ? 1 : -1;
  return (safeCurrent + delta + totalSlides) % totalSlides;
}

export function getAdjacentProjectId(
  projects: PortfolioProject[],
  currentId: string,
  direction: 'next' | 'prev'
): string | null {
  if (projects.length === 0) {
    return null;
  }
  const currentIndex = projects.findIndex((p) => p.id === currentId);
  if (currentIndex === -1) {
    return projects[0].id;
  }
  const delta = direction === 'next' ? 1 : -1;
  const nextIndex = (currentIndex + delta + projects.length) % projects.length;
  return projects[nextIndex].id;
}

export function paginateTestimonials(
  testimonials: TestimonialItem[],
  pageIndex: number,
  pageSize = 2
): {
  items: TestimonialItem[];
  totalPages: number;
  safePageIndex: number;
} {
  if (testimonials.length === 0 || pageSize <= 0) {
    return { items: [], totalPages: 0, safePageIndex: 0 };
  }
  const totalPages = Math.ceil(testimonials.length / pageSize);
  const safePageIndex = ((pageIndex % totalPages) + totalPages) % totalPages;
  const start = safePageIndex * pageSize;
  return {
    items: testimonials.slice(start, start + pageSize),
    totalPages,
    safePageIndex,
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateInquiryForm(input: InquiryFormInput): InquiryValidationResult {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const scope = input.scope.trim() || 'Web Development';
  const budget = input.budget.trim() || '$10k – $25k';

  const errors: InquiryValidationErrors = {};

  if (name.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (message.length < 10) {
    errors.message = 'Please share a brief note about your project (at least 10 characters).';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    normalized: {
      name,
      email,
      scope,
      budget,
      message,
    },
  };
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface ContactMessageValidationResult {
  valid: boolean;
  errors: ContactMessageErrors;
  normalized?: ContactMessageInput;
}

export function validateContactMessageForm(
  input: ContactMessageInput
): ContactMessageValidationResult {
  const name = input.name.trim();
  const email = input.email.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();

  const errors: ContactMessageErrors = {};

  if (name.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (subject.length < 3) {
    errors.subject = 'Please add a short subject (at least 3 characters).';
  }

  if (message.length < 10) {
    errors.message = 'Please write a message (at least 10 characters).';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    normalized: { name, email, subject, message },
  };
}
