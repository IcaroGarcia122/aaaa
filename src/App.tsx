import React, { useState, useEffect } from 'react';
import {
  initialContactInfo,
  ContactInfo,
  HeroSettings,
  Article,
  Lawyer,
  getStoredHeroSettings,
  saveStoredHeroSettings,
  getStoredArticles,
  saveStoredArticles,
  getStoredLawyers,
  saveStoredLawyers,
} from './data/officeData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Team } from './components/Team';
import { PracticeAreas } from './components/PracticeAreas';
import { CtaSection } from './components/CtaSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PrivacyModal } from './components/PrivacyModal';
import { TechnicalProductionPage } from './components/TechnicalProductionPage';
import { CorporatePage } from './components/CorporatePage';
import { AdminPanel } from './components/AdminPanel';
import { HighlightsSection } from './components/HighlightsSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';

export default function App() {
  const [currentView, setCurrentView] = useState<'institutional' | 'technical-production' | 'corporate' | 'admin'>(() => {
    if (window.location.hash === '#producao-tecnica') return 'technical-production';
    if (window.location.hash === '#empresarial') return 'corporate';
    if (window.location.hash === '#admin' || window.location.hash === '#painel') return 'admin';
    return 'institutional';
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('nicolau_contact_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialContactInfo;
      }
    }
    return initialContactInfo;
  });

  const [heroSettings, setHeroSettings] = useState<HeroSettings>(() => getStoredHeroSettings());
  const [articlesList, setArticlesList] = useState<Article[]>(() => getStoredArticles());
  const [lawyersList, setLawyersList] = useState<Lawyer[]>(() => getStoredLawyers());

  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [preselectedArea, setPreselectedArea] = useState<string>('');
  const [preselectedLawyer, setPreselectedLawyer] = useState<string>('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Sync hash with views
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#producao-tecnica') {
        setCurrentView('technical-production');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#empresarial') {
        setCurrentView('corporate');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#admin' || window.location.hash === '#painel') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('institutional');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (currentView !== 'institutional') return;

    const handleScroll = () => {
      const sections = ['inicio', 'destaques', 'sobre', 'equipe', 'comunicados', 'areas', 'contato'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const scrollToSection = (id: string) => {
    if (currentView !== 'institutional') {
      window.location.hash = '';
      setCurrentView('institutional');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCorporatePage = () => {
    window.location.hash = 'empresarial';
    setCurrentView('corporate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTechnicalProduction = () => {
    window.location.hash = 'producao-tecnica';
    setCurrentView('technical-production');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToInstitutional = () => {
    window.location.hash = '';
    setCurrentView('institutional');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateContactInfo = (updated: ContactInfo) => {
    setContactInfo(updated);
    localStorage.setItem('nicolau_contact_info', JSON.stringify(updated));
  };

  const handleUpdateHeroSettings = (updated: HeroSettings) => {
    setHeroSettings(updated);
    saveStoredHeroSettings(updated);
  };

  const handleUpdateArticles = (updated: Article[]) => {
    setArticlesList(updated);
    saveStoredArticles(updated);
  };

  const handleUpdateLawyers = (updated: Lawyer[]) => {
    setLawyersList(updated);
    saveStoredLawyers(updated);
  };

  const handleScheduleWithLawyer = (lawyerName: string) => {
    setPreselectedLawyer(lawyerName);
    scrollToSection('contato');
  };

  const handleSelectAreaForContact = (areaTitle: string) => {
    setPreselectedArea(areaTitle);
    scrollToSection('contato');
  };

  const handleConsultFromArticle = (topicTitle: string) => {
    handleBackToInstitutional();
    setPreselectedArea(topicTitle);
    setTimeout(() => {
      scrollToSection('contato');
    }, 150);
  };

  // View: Administrative Control Panel
  if (currentView === 'admin') {
    return (
      <AdminPanel
        contactInfo={contactInfo}
        heroSettings={heroSettings}
        articlesList={articlesList}
        lawyersList={lawyersList}
        onUpdateContactInfo={handleUpdateContactInfo}
        onUpdateHeroSettings={handleUpdateHeroSettings}
        onUpdateArticles={handleUpdateArticles}
        onUpdateLawyers={handleUpdateLawyers}
        onExit={handleBackToInstitutional}
      />
    );
  }

  // View: Technical Production & Juridical Articles
  if (currentView === 'technical-production') {
    return (
      <TechnicalProductionPage
        contactInfo={contactInfo}
        articlesList={articlesList}
        onBackToHome={handleBackToInstitutional}
        onConsultTopic={handleConsultFromArticle}
        onOpenAdmin={handleOpenAdmin}
      />
    );
  }

  // View: Corporate & Business Law Dedicated Page
  if (currentView === 'corporate') {
    return (
      <CorporatePage
        contactInfo={contactInfo}
        onBackToHome={handleBackToInstitutional}
        onConsultCorporate={(topic) => handleConsultFromArticle(topic)}
      />
    );
  }

  // View: Main Institutional Website
  return (
    <div className="min-h-screen bg-[#17130F] text-[#FAF8F4] flex flex-col font-sans selection:bg-[#B89554]/30 selection:text-[#FAF8F4]">
      {/* 1. Header / Navigation with Centered Logo (4 left links, centered logo, 4 right links) */}
      <Header
        contactInfo={contactInfo}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenTechnicalPage={handleOpenTechnicalProduction}
        onOpenCorporatePage={handleOpenCorporatePage}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Institutional Website with sticky Hero and rising curtain effect */}
      <main className="flex-1 relative">
        {/* 1. Hero with background image, Playfair Display typography, typewriter animation on 'a sua jornada.' and sticky lock */}
        <Hero
          heroSettings={heroSettings}
          onExploreClick={() => scrollToSection('destaques')}
          onContactClick={() => scrollToSection('contato')}
        />

        {/* 2. Destaques & Notícias (Second session as requested) */}
        <HighlightsSection />

        {/* 3. Sobre o Escritório (Third session: rich brown background, Balança image, watermark) */}
        <About />

        {/* 4. Nossa Equipe (Fourth session: white background, full-bleed team image without gradient) */}
        <Team
          contactInfo={contactInfo}
          onContactClick={() => scrollToSection('contato')}
        />

        {/* 5. Comunicados & Notas Oficiais (Fifth session: rich textured background) */}
        <AnnouncementsSection />

        {/* 6. Áreas de Atuação (Criminal, Civil, Família) */}
        <PracticeAreas onSelectAreaForContact={handleSelectAreaForContact} />

        {/* 7. Chamada para Contato (CTA Banner matching reference image with full-bleed pen photo & blur/gradient) */}
        <CtaSection contactInfo={contactInfo} />

        {/* 8. Contato e Localização */}
        <ContactSection
          contactInfo={contactInfo}
          onUpdateContactInfo={handleUpdateContactInfo}
          preselectedArea={preselectedArea}
          preselectedLawyer={preselectedLawyer}
        />
      </main>

      {/* 10. Footer matching template with admin button in sub-footer */}
      <Footer
        contactInfo={contactInfo}
        onNavigate={scrollToSection}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenContact={() => scrollToSection('contato')}
        onOpenTechnicalPage={handleOpenTechnicalProduction}
        onOpenCorporatePage={handleOpenCorporatePage}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating WhatsApp CTA */}
      <FloatingWhatsApp contactInfo={contactInfo} />

      {/* Privacy and Institutional Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
