import { useRef, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { BackToTopButton } from './components/BackToTopButton';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ContactModal, type SubmittedInquiry } from './components/ContactModal';
import { FooterCtaSection } from './components/FooterCtaSection';
import { GraphicsDesignShowcaseSection } from './components/GraphicsDesignShowcaseSection';
import { HeroSection } from './components/HeroSection';
import { HighlightsSection } from './components/HighlightsSection';
import { LinkedInPostsSection } from './components/LinkedInPostsSection';
import { Navbar } from './components/Navbar';
import { PhilosophySection } from './components/PhilosophySection';
import { QualificationSection } from './components/QualificationSection';
import { ShowcaseReelSection } from './components/ShowcaseReelSection';
import { SkillsSection } from './components/SkillsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WebDesignShowcaseSection } from './components/WebDesignShowcaseSection';
import {
  PORTFOLIO_PROJECTS,
  type ProjectCategory,
} from './data/portfolioData';
import { getAdjacentProjectId } from './utils/portfolio';
import { downloadResumePdf } from './utils/resumePdf';

export default function App() {
  const [webFilter, setWebFilter] = useState<ProjectCategory>('All');
  const [graphicsFilter, setGraphicsFilter] = useState<ProjectCategory>('All');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactScope, setContactScope] = useState<string | undefined>(undefined);
  const [submittedInquiries, setSubmittedInquiries] = useState<SubmittedInquiry[]>([]);
  const [resumeDownloaded, setResumeDownloaded] = useState(false);
  const downloadTimerRef = useRef<number | null>(null);

  const activeProject =
    PORTFOLIO_PROJECTS.find((item) => item.id === activeProjectId) ?? null;

  const handleOpenContact = (scope?: string) => {
    setContactScope(scope);
    setContactOpen(true);
  };

  const handleDownloadResume = () => {
    downloadResumePdf('Sandeep_Kohar_Resume.pdf');
    setResumeDownloaded(true);
    if (downloadTimerRef.current !== null) {
      window.clearTimeout(downloadTimerRef.current);
    }
    downloadTimerRef.current = window.setTimeout(() => {
      setResumeDownloaded(false);
    }, 2800);
  };

  const handleFilterFromCapability = (category: ProjectCategory) => {
    if (category === 'Web Dev' || category === 'Full-Stack') {
      setWebFilter(category);
    } else if (category === 'Brand Identity' || category === 'Print & Visual') {
      setGraphicsFilter(category);
    } else {
      setWebFilter('All');
      setGraphicsFilter('All');
    }
  };

  const handleNavigateProject = (direction: 'prev' | 'next') => {
    if (!activeProjectId) {
      return;
    }
    const nextId = getAdjacentProjectId(PORTFOLIO_PROJECTS, activeProjectId, direction);
    if (nextId) {
      setActiveProjectId(nextId);
    }
  };

  const handleStartSimilarProject = (scope: string) => {
    setActiveProjectId(null);
    handleOpenContact(scope);
  };

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <Navbar
        onDownloadResume={handleDownloadResume}
        resumeDownloaded={resumeDownloaded}
        inquiryCount={submittedInquiries.length}
      />

      <main>
        <HeroSection
          onDownloadResume={handleDownloadResume}
          resumeDownloaded={resumeDownloaded}
        />

        <AboutSection />

        <QualificationSection />

        <ShowcaseReelSection
          projects={PORTFOLIO_PROJECTS.slice(0, 4)}
          onSelectProject={(id) => setActiveProjectId(id)}
        />

        <PhilosophySection onFilterByCategory={handleFilterFromCapability} />

        <SkillsSection />

        <TestimonialsSection />

        <div id="works">
          <WebDesignShowcaseSection
            projects={PORTFOLIO_PROJECTS}
            activeFilter={webFilter}
            onChangeFilter={setWebFilter}
            onSelectProject={(id) => setActiveProjectId(id)}
            onStartWebProject={() => handleOpenContact('Web Development')}
          />

          <GraphicsDesignShowcaseSection
            projects={PORTFOLIO_PROJECTS}
            activeFilter={graphicsFilter}
            onChangeFilter={setGraphicsFilter}
            onSelectProject={(id) => setActiveProjectId(id)}
            onStartGraphicsProject={() => handleOpenContact('Graphic Design')}
          />
        </div>

        <HighlightsSection />

        <LinkedInPostsSection />
      </main>

      <FooterCtaSection
        onDownloadResume={handleDownloadResume}
        onSubmitInquiry={(inquiry) =>
          setSubmittedInquiries((prev) => [inquiry, ...prev])
        }
      />

      <CaseStudyModal
        project={activeProject}
        onClose={() => setActiveProjectId(null)}
        onNavigate={handleNavigateProject}
        onStartProject={handleStartSimilarProject}
      />

      <ContactModal
        open={contactOpen}
        defaultScope={contactScope}
        submittedInquiries={submittedInquiries}
        onClose={() => setContactOpen(false)}
        onSubmitInquiry={(inquiry) =>
          setSubmittedInquiries((prev) => [inquiry, ...prev])
        }
      />

      <BackToTopButton />
    </div>
  );
}
