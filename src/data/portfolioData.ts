export type ProjectCategory =
  | 'All'
  | 'Web Dev'
  | 'Brand Identity'
  | 'Full-Stack'
  | 'Print & Visual';

export type ShowcaseTrack = 'web' | 'graphics';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  year: string;
  showcase: ShowcaseTrack;
  category: Exclude<ProjectCategory, 'All'>;
  disciplines: string[];
  formatSpec: string;
  domainUrl?: string;
  summary: string;
  role: string;
  timeline: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  metrics: ProjectMetric[];
  image: string;
  imageAlt: string;
  imageCropClass?: string;
}

export interface CapabilityItem {
  id: string;
  label: string;
  side: 'left' | 'right';
  accent: string;
  description: string;
  relatedCategory: ProjectCategory;
  targetSection: '#web-showcase' | '#graphics-showcase';
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  rotationClass: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  avatarBg: string;
}

export interface CareerEntry {
  id: string;
  role: string;
  company: string;
  periodStart: string;
  periodEnd: string;
  impact: string;
  highlights: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export type HighlightCategory = 'All' | 'Project' | 'Award' | 'Community';

export interface HighlightItem {
  id: string;
  category: Exclude<HighlightCategory, 'All'>;
  title: string;
  organization: string;
  period: string;
  summary: string;
  detail: string;
  tags: string[];
}

export interface PersonalProfile {
  name: string;
  title: string;
  phone: string;
  phoneHref: string;
  email: string;
  linkedinUrl: string;
  linkedinLabel: string;
  currentLocation: string;
  hometown: string;
  aboutBio: string;
  certifications: string[];
}

export const HERO_PORTRAIT_SRC = '/assets/aistudio/Sandeep_PP_77ba5632.jpg';
export const ABOUT_PORTRAIT_SRC = '/assets/aistudio/Sandeep_PP_77ba5632.jpg';

export const PERSONAL_PROFILE: PersonalProfile = {
  name: 'Sandeep Kohar',
  title: 'Web Developer & Graphics Designer',
  phone: '+977 9817486282',
  phoneHref: 'tel:+9779817486282',
  email: 'prajapatisandeepkumar78@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/sandeepkohar/',
  linkedinLabel: 'linkedin.com/in/sandeepkohar',
  currentLocation: 'Kathmandu, Bagmati Province',
  hometown: 'Kapilvastu, Lumbini',
  aboutBio:
    'Motivated Computer Engineering student skilled in HTML, CSS, graphic designing, and social media post design. Proficient in Microsoft Word and Excel, with a strong understanding of computer technical aspects. Passionate about web development, creative design, and applying technology to solve real-world problems.',
  certifications: ['Graphic Designer', 'Web Developer'],
};

export const EDUCATION_HISTORY: EducationEntry[] = [
  {
    id: 'be-computer',
    degree: 'Bachelor of Computer Engineering',
    institution: 'Himalayan White House International College, Putalisadak',
    period: '2024 – Present',
  },
  {
    id: 'slc',
    degree: 'SLC (+2)',
    institution: 'Kalika Manavgyan Secondary School, Butwal',
    period: '2022 – 2024',
  },
  {
    id: 'see',
    degree: 'SEE',
    institution: 'Shree Tilaurakot Secondary School',
    period: '2012 – 2022',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'frontend-technical',
    label: 'Front-End & Technical',
    items: [
      'HTML',
      'CSS',
      'Responsive Web Design',
      'Basic Computer Troubleshooting',
      'Computer Hardware & Software',
    ],
  },
  {
    id: 'design-skills',
    label: 'Design Skills',
    items: [
      'Graphic Designing',
      'Social Media Post Designing',
      'Front-End UI/UX Design',
    ],
  },
  {
    id: 'tools-software',
    label: 'Tools & Software',
    items: ['Figma / Canva', 'Microsoft Word', 'Microsoft Excel'],
  },
  {
    id: 'soft-skills',
    label: 'Soft Skills',
    items: [
      'Communication',
      'Teamwork',
      'Problem-Solving',
      'Leadership & Adaptability',
    ],
  },
];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'All',
  'Web Dev',
  'Brand Identity',
  'Full-Stack',
  'Print & Visual',
];

export const WEB_SHOWCASE_FILTERS: Array<{ label: string; value: ProjectCategory }> = [
  { label: 'All Web', value: 'All' },
  { label: 'Web Dev', value: 'Web Dev' },
  { label: 'Full-Stack', value: 'Full-Stack' },
];

export const GRAPHICS_SHOWCASE_FILTERS: Array<{ label: string; value: ProjectCategory }> = [
  { label: 'All Graphics', value: 'All' },
  { label: 'Brand Identity', value: 'Brand Identity' },
  { label: 'Print & Visual', value: 'Print & Visual' },
];

export const STACK_AND_TOOLS: string[] = [
  'HTML',
  'CSS',
  'Responsive Web Design',
  'Front-End UI/UX Design',
  'Graphic Designing',
  'Social Media Post Designing',
  'Figma / Canva',
  'Microsoft Word',
  'Microsoft Excel',
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'biodiagnostics-path-labs',
    title: 'Biodiagnostics Path Labs',
    client: 'Bio Diagnostics · Reference Lab',
    year: '2026',
    showcase: 'web',
    category: 'Web Dev',
    disciplines: ['Web Dev', 'Healthcare Platform'],
    formatSpec: 'Responsive Web · Patient Portal · Booking UI',
    domainUrl: 'biodiagnostics.com.np',
    summary:
      'Modern clinical website for an ISO 15189:2022 certified reference laboratory across Sukedhara, Kathmandu and Gwarko, Lalitpur featuring online test booking, report lookup, patient portal access, and free home sample collection.',
    role: 'Web Developer & UI Designer',
    timeline: 'Recent · 2026',
    challenge:
      'Patients across Kathmandu and Lalitpur needed a trustworthy, easy-to-navigate diagnostic platform to browse health packages, book free home sample collections, and check verified lab reports online.',
    solution:
      'Engineered a high-trust healthcare web interface with clear Book Test and View Reports actions, dedicated Patient Portal access, theme switcher, instant WhatsApp support, and responsive clinical clarity.',
    deliverables: [
      'Responsive Healthcare Website',
      'Online Test Booking & Packages UI',
      'Patient Portal & Report Access',
      'Light / Dark Mode & WhatsApp Support',
    ],
    metrics: [
      { label: 'Accreditation', value: 'ISO 15189' },
      { label: 'Service Centers', value: '2 Branches' },
      { label: 'Home Collection', value: 'Free Pickup' },
    ],
    image: '/assets/aistudio/image_5b9c49ca.png',
    imageAlt:
      'Biodiagnostics Path Labs reference laboratory website displaying Nepal Government Approved ISO 15189:2022 badge, Book Test and View Reports actions, Patient Portal, and modern clinical lab photography',
    imageCropClass: 'object-contain object-center bg-white',
  },
  {
    id: 'syneo-labs-campaign',
    title: 'Syneo Labs Tech Campaign',
    client: 'Syneo Labs',
    year: '2026',
    showcase: 'graphics',
    category: 'Brand Identity',
    disciplines: ['Graphic Design', 'Brand & Social Media'],
    formatSpec: '16:9 Promotional Graphic · Typography · Social Kit',
    summary:
      'High-impact promotional brand graphic for Syneo Labs (“Where Creativity Meets Innovation”) pairing outlined and brush-script display typography, a blue-to-violet gradient accent panel, and clear service hierarchy for Web Development, SEO, AI Automation, and Social Media Marketing.',
    role: 'Graphic Designer',
    timeline: 'Recent · 2026',
    challenge:
      'Syneo Labs needed a bold, immediately scannable promotional visual showcasing four digital services alongside direct phone and email contact points without crowding the layout.',
    solution:
      'Balanced clean white space with an energetic blue-to-violet vertical accent band, expressive “Tech Problem Solving” typographic contrast, crisp cutout compositing, and high-visibility contact actions.',
    deliverables: [
      'Promotional Campaign Banner (16:9)',
      'Display Typography & Service Hierarchy',
      'Subject Cutout & Gradient Art Direction',
      'Social Media & Digital Marketing Assets',
    ],
    metrics: [
      { label: 'Core Services', value: '4 Tracks' },
      { label: 'Canvas Format', value: '16:9 HD' },
      { label: 'Brand Focus', value: 'Tech & AI' },
    ],
    image: '/assets/aistudio/every_syneo_48d331e7.png',
    imageAlt:
      'Syneo Labs promotional graphic design titled Tech Problem Solving featuring Web Development, SEO Optimization, AI Automation, Social Media Marketing, contact details, and a blue-to-violet gradient accent with laptop presenter',
    imageCropClass: 'object-contain object-center bg-white',
  },
  {
    id: 'devflow-fullstack',
    title: 'DevFlow Cloud Platform',
    client: 'DevFlow Technologies',
    year: '2024',
    showcase: 'web',
    category: 'Full-Stack',
    disciplines: ['Full-Stack', 'TypeScript Web App'],
    formatSpec: 'React · Node.js · Live Telemetry UI',
    domainUrl: 'console.devflow.dev',
    summary:
      'Real-time developer deployment console with live build status streams, interactive TypeScript snippet previews, and edge latency telemetry.',
    role: 'Full-Stack Web Developer',
    timeline: '12 Weeks',
    challenge:
      'Engineering teams struggled to diagnose staging rollouts and API latency spikes across fragmented CLI logs and slow legacy monitoring tools.',
    solution:
      'Architected a responsive full-stack web application using React, Node.js, and WebSocket event streams paired with a razor-sharp monochrome and lime UI system.',
    deliverables: [
      'Full-Stack React & Node App',
      'Live Deployment Pipeline UI',
      'Interactive Code & Latency Views',
      'Reusable Component Library',
    ],
    metrics: [
      { label: 'Deploy Debugging Time', value: '-61%' },
      { label: 'Daily Active Devs', value: '14,200+' },
      { label: 'API Render Latency', value: '42ms' },
    ],
    image: '/src/assets/images/work_webdev_webapp_1795362854512.jpg',
    imageAlt:
      'DevFlow full-stack developer platform dashboard showing deployment pipeline status, TypeScript code preview, and real-time web latency chart',
  },
  {
    id: 'kultur-poster-series',
    title: 'Kultur Art & Design Festival',
    client: 'Kultur Berlin',
    year: '2024',
    showcase: 'graphics',
    category: 'Print & Visual',
    disciplines: ['Graphic Design', 'Posters & Print'],
    formatSpec: 'A0/A1 Posters · 160-Page Monograph',
    summary:
      'Swiss-modernist visual identity, large-format exhibition poster series, wayfinding graphics, and a 160-page editorial monograph for Berlin’s annual arts festival.',
    role: 'Graphics & Editorial Designer',
    timeline: '8 Weeks',
    challenge:
      'Unifying 45 independent exhibitions, talks, and print collateral under one bold geometric graphic language legible from across city transit hubs.',
    solution:
      'Crafted a modular geometric grid combining bold neo-grotesque typography, high-contrast black patterns, and electric chartreuse accents across posters and print editions.',
    deliverables: [
      'Exhibition Poster Series (A0/A1)',
      '160-Page Print Monograph',
      'Social & Web Promo Graphics',
      'Venue Signage & Wayfinding',
    ],
    metrics: [
      { label: 'Festival Attendance', value: '28,000+' },
      { label: 'Monograph First Run', value: 'Sold out' },
      { label: 'Print Touchpoints', value: '60+ assets' },
    ],
    image: '/src/assets/images/work_graphic_editorial_1795362854619.jpg',
    imageAlt:
      'Kultur Berlin art and design festival framed geometric black, white, and lime posters above an open Swiss typography print monograph',
  },
  {
    id: 'casa-luna-architecture',
    title: 'Casa Luna Architecture Site',
    client: 'Atelier Aeterna Architecture',
    year: '2025',
    showcase: 'web',
    category: 'Web Dev',
    disciplines: ['Web Design', 'Editorial Grid'],
    formatSpec: 'Next.js · Tailwind CSS · Motion Transitions',
    domainUrl: 'aeterna.studio',
    summary:
      'Architectural studio portfolio built on an asymmetric Swiss grid showcasing brutalist concrete residences with fluid full-bleed project transitions and instant filtering.',
    role: 'Web Designer & Frontend Engineer',
    timeline: '7 Weeks',
    challenge:
      'The practice’s high-resolution photography was weighed down by heavy slideshows and rigid templates that obscured spatial storytelling on mobile and desktop.',
    solution:
      'Designed and coded a calm monochrome portfolio anchored by acid-lime micro-cues, responsive AVIF media pipelines, and tactile project index pages.',
    deliverables: [
      'Interactive Portfolio Architecture',
      'Responsive Image Optimization',
      'CMS Project Case Templates',
      'Accessibility & SEO Audit',
    ],
    metrics: [
      { label: 'Avg. Session Depth', value: '4.6 pages' },
      { label: 'Client Inquiries', value: '+88%' },
      { label: 'First Input Delay', value: '12ms' },
    ],
    image: '/src/assets/images/web_kinetix_architecture_1795365016023.jpg',
    imageAlt:
      'Atelier Aeterna architecture website showing Casa Luna coastal concrete villa hero and 4-column project showcase grid inside a sleek browser frame',
  },
  {
    id: 'ascent-wealth-app',
    title: 'Ascent Wealth Web App',
    client: 'Ascent Capital Partners',
    year: '2025',
    showcase: 'web',
    category: 'Full-Stack',
    disciplines: ['Web Design', 'Responsive SaaS'],
    formatSpec: 'React · TypeScript · Desktop & Mobile UI',
    domainUrl: 'app.ascentwealth.co',
    summary:
      'Responsive cross-device wealth portal combining real-time portfolio growth analytics, allocation breakdowns, and instant account ledger views across desktop and mobile.',
    role: 'Lead UI & Full-Stack Web Developer',
    timeline: '11 Weeks',
    challenge:
      'High-net-worth clients needed clarity across multi-custodian portfolios without wading through dense spreadsheets or inconsistent mobile screens.',
    solution:
      'Engineered a unified responsive design system and React web application with tabular financial typography, accessible SVG charting, and synchronized mobile views.',
    deliverables: [
      'Responsive Web & Mobile UI Kit',
      'Interactive Portfolio Charts',
      'Account & Allocation API Layer',
      'Design Token Documentation',
    ],
    metrics: [
      { label: 'Mobile Adoption', value: '+112%' },
      { label: 'Task Completion', value: '96.4%' },
      { label: 'Quarterly Retention', value: '98%' },
    ],
    image: '/src/assets/images/web_solara_fintech_1795365016327.jpg',
    imageAlt:
      'Ascent Wealth responsive fintech web application displayed on desktop browser and mobile screen featuring net worth metrics and lime portfolio growth curve',
  },
  {
    id: 'lumina-botanics-packaging',
    title: 'Lumina Botanics Packaging',
    client: 'Lumina Botanics Lab',
    year: '2025',
    showcase: 'graphics',
    category: 'Brand Identity',
    disciplines: ['Graphic Design', 'Packaging & Print'],
    formatSpec: 'Frosted Glass · Recycled Stock · Die-Cut Seals',
    summary:
      'Tactile skincare identity and sustainable packaging suite pairing unbleached speckled cartons, frosted amber-tint dropper vials, and acid-lime botanical monogram seals.',
    role: 'Brand & Packaging Designer',
    timeline: '5 Weeks',
    challenge:
      'Lumina wanted apothecary calm with unmistakable retail standout — avoiding generic minimalist beige boxes that disappear on boutique shelves.',
    solution:
      'Created a crisp serif typographic hierarchy paired with die-cut chartreuse LB botanical seals that wrap cleanly across both bottle labels and carton corners.',
    deliverables: [
      'Monogram & Wordmark Identity',
      'Carton & Bottle Label Mechanicals',
      'Print Finish & Paper Spec',
      'Art Direction & Packshots',
    ],
    metrics: [
      { label: 'Boutique Placement', value: '24 stores' },
      { label: 'Launch Sell-Through', value: '92% in 30d' },
      { label: 'Recycled Paper Stock', value: '100% FSC' },
    ],
    image: '/src/assets/images/graphic_verve_packaging_1795365016028.jpg',
    imageAlt:
      'Lumina Botanics skincare packaging suite showing frosted glass facial oil dropper bottles and textured speckled cartons with lime monogram seals on travertine',
  },
  {
    id: 'resonance-vinyl-print',
    title: 'Resonance Vinyl & Print Kit',
    client: 'Systematic Audio Berlin',
    year: '2024',
    showcase: 'graphics',
    category: 'Print & Visual',
    disciplines: ['Graphic Design', 'Vinyl & Editorial'],
    formatSpec: '180g Gatefold LP · 32p Booklet · Screenprint',
    summary:
      'Limited-edition 12-inch vinyl sleeve, 32-page Swiss typographic liner booklet, and two-color screen-printed tour poster crafted for Berlin’s Systematic Resonance live series.',
    role: 'Visual & Print Designer',
    timeline: '4 Weeks',
    challenge:
      'Translating modular electronic soundscapes into a cohesive physical edition collectors would frame, read, and play across record shops and live venues.',
    solution:
      'Built an architectural geometric grid system using stark black ink and fluorescent chartreuse spot color on heavy uncoated cotton paper and matte board.',
    deliverables: [
      '12-Inch Gatefold Vinyl Jacket',
      '32-Page Typeset Liner Booklet',
      'Two-Color Screenprint Poster',
      'Spot-Color Press Separations',
    ],
    metrics: [
      { label: 'Limited Pressing', value: '1,500 copies' },
      { label: 'Pre-Order Sellout', value: '48 hours' },
      { label: 'Design Annuals', value: '2 features' },
    ],
    image: '/src/assets/images/graphic_forma_vinyl_1795365016578.jpg',
    imageAlt:
      'Systematic Resonance avant-garde vinyl record sleeve, 32-page Swiss typography booklet, and black and chartreuse screen-printed poster flatlay on pale concrete',
  },
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'frontend-dev',
    label: 'Frontend Dev',
    side: 'left',
    accent: '#F97316',
    description:
      'Responsive, accessible web interfaces engineered with React, TypeScript, Tailwind CSS, and fluid motion.',
    relatedCategory: 'Web Dev',
    targetSection: '#web-showcase',
  },
  {
    id: 'fullstack-apps',
    label: 'Full-Stack Apps',
    side: 'left',
    accent: '#0EA5E9',
    description:
      'End-to-end web applications with clean Node.js APIs, real-time dashboards, and dependable database schemas.',
    relatedCategory: 'Full-Stack',
    targetSection: '#web-showcase',
  },
  {
    id: 'web-performance',
    label: 'Web Performance',
    side: 'left',
    accent: '#18181B',
    description:
      'Technical SEO, semantic markup, and Core Web Vitals tuning so every website loads fast and scales cleanly.',
    relatedCategory: 'Web Dev',
    targetSection: '#web-showcase',
  },
  {
    id: 'brand-identity',
    label: 'Brand Identity',
    side: 'right',
    accent: '#EAB308',
    description:
      'Distinctive logos, packaging systems, color palettes, and art direction that give brands unmistakable presence.',
    relatedCategory: 'Brand Identity',
    targetSection: '#graphics-showcase',
  },
  {
    id: 'print-editorial',
    label: 'Print & Editorial',
    side: 'right',
    accent: '#EC4899',
    description:
      'Swiss-inspired poster campaigns, books, pitch decks, and print-ready artwork crafted with typographic precision.',
    relatedCategory: 'Print & Visual',
    targetSection: '#graphics-showcase',
  },
  {
    id: 'visual-systems',
    label: 'Visual Systems',
    side: 'right',
    accent: '#22C55E',
    description:
      'Cohesive graphic guidelines, custom iconography, and social campaign kits that bridge digital and physical media.',
    relatedCategory: 'Brand Identity',
    targetSection: '#graphics-showcase',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Concept',
    description:
      'Aligning on your brand voice, visual direction, and technical site architecture before a single pixel or line of code.',
    deliverables: ['Creative direction & moodboards', 'Site map & wireframes', 'Tech stack & asset plan'],
    rotationClass: 'md:-rotate-2 md:translate-y-4',
  },
  {
    number: '02',
    title: 'Design & Code',
    description:
      'Crafting bold graphic identities alongside clean, responsive React & TypeScript builds with seamless motion.',
    deliverables: ['Brand & graphic collateral', 'Responsive web engineering', 'Interactive UI & CMS setup'],
    rotationClass: 'md:rotate-[1.5deg] md:-translate-y-2',
  },
  {
    number: '03',
    title: 'Launch',
    description:
      'Auditing speed, cross-browser fidelity, and print/export files to ship with clarity and zero handoff friction.',
    deliverables: ['Core Web Vitals & SEO QA', 'Print-ready & SVG brand kit', 'Production deploy & support'],
    rotationClass: 'md:-rotate-[1.5deg] md:translate-y-3',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'daniel-reed',
    quote:
      'Working with Sandeep was seamless from start to finish. He redesigned our entire brand identity and engineered our React storefront with a 99 Lighthouse score — rare to find both craft and code at this level.',
    author: 'Daniel Reed',
    role: 'Founder',
    company: 'Studio Aeterna',
    initials: 'DR',
    avatarBg: '#FDE68A',
  },
  {
    id: 'sarah-nguyen',
    quote:
      'Sandeep transformed Studio Brew from a sketch into a shelf-ready specialty coffee brand. From custom packaging dielines to our launch website, every graphic detail felt intentional and bold.',
    author: 'Sarah Nguyen',
    role: 'Creative Director',
    company: 'Studio Brew Roasters',
    initials: 'SN',
    avatarBg: '#D9F99D',
  },
  {
    id: 'marcus-vance',
    quote:
      'Our engineering team loved collaborating with Sandeep on DevFlow. His TypeScript codebase was clean, modular, and fast, and the graphic language he built elevated our entire developer brand.',
    author: 'Marcus Vance',
    role: 'CTO',
    company: 'DevFlow Technologies',
    initials: 'MV',
    avatarBg: '#E0E7FF',
  },
  {
    id: 'elena-kovacs',
    quote:
      'The Kultur Berlin poster series and 160-page monograph sold out our first print run. Sandeep pairs fearless Swiss typography with real production discipline across both print and web.',
    author: 'Elena Kovacs',
    role: 'Lead Curator',
    company: 'Kultur Berlin',
    initials: 'EK',
    avatarBg: '#FCE7F3',
  },
];

export const CAREER_HISTORY: CareerEntry[] = [
  {
    id: 'syneo-labs',
    role: 'Graphic Designer',
    company: 'Syneo Labs',
    periodStart: 'Oct 2026',
    periodEnd: 'Present',
    impact:
      'Designing promotional graphics, social media visuals, and brand campaign assets for Syneo Labs’ tech and digital services.',
    highlights: [
      'Designed promotional campaign graphics and social media visuals highlighting Web Development, SEO Optimization, AI Automation, and Social Media Marketing.',
      'Crafted cohesive brand typography, visual hierarchy, and digital marketing collateral aligned with Syneo Labs’ identity.',
      'Collaborated on creative concepts to present tech solutions clearly and engagingly across digital platforms.',
    ],
  },
  {
    id: 'elab-nepal',
    role: 'Graphic Designer',
    company: 'eLab Nepal Pvt. Ltd.',
    periodStart: 'Apr 2026',
    periodEnd: 'Present',
    impact:
      'Creating Nepali & English marketing graphics, healthcare campaign visuals, branding, and video scripts for eLab Nepal.',
    highlights: [
      'Created engaging social media content, advertisements, and promotional designs for eLab Nepal.',
      'Developed Nepali and English marketing content for healthcare and diagnostic services.',
      'Planned creative campaigns for home sample collection, health awareness, and special offers.',
      'Managed branding, visual concepts, video scripts, and digital marketing campaigns to boost engagement.',
    ],
  },
  {
    id: 'rotaract-hwic',
    role: 'IT Head & Graphic Designer',
    company: 'Rotaract Club of HWIC',
    periodStart: 'Mar 2025',
    periodEnd: 'Present',
    impact:
      'Leading the IT team and designing cohesive event graphics and digital communications for Rotaract Club of HWIC.',
    highlights: [
      'Led the IT team, managing technical tasks and digital communications for club activities.',
      'Designed creative graphics and social media posts for events and campaigns.',
      'Ensured consistent branding and increased audience engagement through effective design and technical support.',
    ],
  },
  {
    id: 'whitehouse-innovator',
    role: 'Graphic Designer',
    company: 'WhiteHouse Innovator',
    periodStart: 'Dec 2025',
    periodEnd: 'Present',
    impact:
      'Designing social media visuals and digital marketing materials to promote IT club events and initiatives.',
    highlights: [
      'Designed graphics and social media content to promote IT club events and initiatives.',
      'Collaborated with members to ensure professional and visually engaging designs.',
      'Produced digital materials that supported event marketing and enhanced club visibility.',
    ],
  },
  {
    id: 'hult-prize-hwic',
    role: 'Graphic Designer',
    company: 'Hult Prize at HWIC',
    periodStart: 'Nov 2025',
    periodEnd: 'Feb 2026',
    impact:
      'Crafted event promotional graphics, social campaigns, and unified cross-platform branding for Hult Prize at HWIC.',
    highlights: [
      'Created visually compelling graphics and social media posts for event promotion.',
      'Designed marketing materials to boost engagement and visibility.',
      'Collaborated with the team to maintain consistent branding across platforms.',
    ],
  },
];

export const HIGHLIGHT_ITEMS: HighlightItem[] = [
  // Projects
  {
    id: 'proj-biodiagnostics-web',
    category: 'Project',
    title: 'Biodiagnostics Path Labs Website',
    organization: 'Bio Diagnostics · Reference Laboratory',
    period: '2026',
    summary:
      'Responsive healthcare web platform for an ISO 15189:2022 reference lab across Sukedhara, Kathmandu and Gwarko, Lalitpur with online test booking, patient portal, and report viewing.',
    detail: 'Healthcare Web Development',
    tags: ['Responsive Web', 'Patient Portal', 'Diagnostic UI'],
  },
  {
    id: 'proj-elab-campaigns',
    category: 'Project',
    title: 'eLab Nepal Digital Campaign Suite',
    organization: 'eLab Nepal Pvt. Ltd.',
    period: '2026',
    summary:
      'Bilingual Nepali and English diagnostic awareness campaigns, home sample collection promos, and cohesive web-ready brand visuals.',
    detail: 'Healthcare Branding & Digital Campaigns',
    tags: ['Social Media Design', 'Bilingual Copy', 'Brand Visuals'],
  },
  {
    id: 'proj-portfolio-resume',
    category: 'Project',
    title: 'Interactive Portfolio & Resume Builder',
    organization: 'Personal Engineering Project',
    period: '2026',
    summary:
      'Responsive React and TypeScript portfolio featuring slide-wise Web and Graphics showcases, qualification timeline, and instant PDF resume export.',
    detail: 'Front-End Web Engineering',
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  // Awards & Recognitions
  {
    id: 'award-web-developer',
    category: 'Award',
    title: 'Certified Web Developer',
    organization: 'Web Development Certification',
    period: '2025',
    summary:
      'Recognized for hands-on proficiency in semantic HTML, modern CSS, responsive web architecture, and accessible front-end UI implementation.',
    detail: 'Technical Certification',
    tags: ['HTML & CSS', 'Responsive Web', 'UI Engineering'],
  },
  {
    id: 'award-graphic-designer',
    category: 'Award',
    title: 'Certified Graphic Designer',
    organization: 'Graphic Design Certification',
    period: '2025',
    summary:
      'Awarded for mastery of visual hierarchy, brand identity craft, promotional poster design, and high-engagement social media campaigns.',
    detail: 'Design Certification',
    tags: ['Graphic Design', 'Visual Identity', 'Campaign Art'],
  },
  {
    id: 'award-hult-prize-recognition',
    category: 'Award',
    title: 'Hult Prize Campus Design Contribution',
    organization: 'Hult Prize at HWIC',
    period: '2025 – 2026',
    summary:
      'Acknowledged for elevating campus-wide event visibility through consistent multi-platform branding and promotional design materials.',
    detail: 'Campus Innovation Recognition',
    tags: ['Event Branding', 'Marketing Visuals', 'Team Collaboration'],
  },
  // Community & Leadership
  {
    id: 'comm-rotaract-hwic',
    category: 'Community',
    title: 'IT Head & Graphic Designer',
    organization: 'Rotaract Club of HWIC',
    period: 'Mar 2025 – Present',
    summary:
      'Leading the club IT team, coordinating technical operations and digital communications, and designing visuals for community service initiatives.',
    detail: 'Youth Leadership & Tech',
    tags: ['IT Leadership', 'Community Service', 'Digital Comms'],
  },
  {
    id: 'comm-whitehouse-innovator',
    category: 'Community',
    title: 'Graphic Designer & Club Contributor',
    organization: 'WhiteHouse Innovator',
    period: 'Dec 2025 – Present',
    summary:
      'Partnering with Computer Engineering peers to promote tech workshops, hackathons, and student innovation initiatives across campus.',
    detail: 'Student Tech Community',
    tags: ['IT Club', 'Workshop Promos', 'Peer Mentorship'],
  },
  {
    id: 'comm-hult-prize-hwic',
    category: 'Community',
    title: 'Creative & Branding Volunteer',
    organization: 'Hult Prize at HWIC',
    period: 'Nov 2025 – Feb 2026',
    summary:
      'Supported student social-entrepreneurship pitch programs with promotional graphics, social campaigns, and unified cross-channel storytelling.',
    detail: 'Social Entrepreneurship',
    tags: ['Startup Community', 'Social Impact', 'Visual Storytelling'],
  },
];
