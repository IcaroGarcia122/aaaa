import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { MessageSquare, Menu, X } from 'lucide-react';
import { ContactInfo } from '../data/officeData';

interface HeaderProps {
  contactInfo: ContactInfo;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenTechnicalPage?: () => void;
  onOpenCorporatePage?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  contactInfo,
  activeSection,
  onNavigate,
  onOpenTechnicalPage,
  onOpenCorporatePage,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'empresarial' && onOpenCorporatePage) {
      onOpenCorporatePage();
      return;
    }
    if (id === 'producao-tecnica' && onOpenTechnicalPage) {
      onOpenTechnicalPage();
      return;
    }
    onNavigate(id);
  };

  const whatsappUrl = `https://wa.me/${contactInfo.whatsappNumberDigits}?text=${encodeURIComponent(
    'Olá! Gostaria de falar com a equipe da Advocacia Nicolau.'
  )}`;

  // Exactly 4 sessions on the left of the logo
  const leftNavLinks = [
    { id: 'inicio', label: 'Início' },
    { id: 'destaques', label: 'Destaques' },
    { id: 'sobre', label: 'O Escritório' },
    { id: 'empresarial', label: 'Empresarial' },
  ];

  // Exactly 4 sessions on the right of the logo
  const rightNavLinks = [
    { id: 'equipe', label: 'Nossa Equipe' },
    { id: 'comunicados', label: 'Comunicados' },
    { id: 'areas', label: 'Áreas de Atuação' },
    { id: 'contato', label: 'Contato' },
  ];

  const allNavLinks = [
    ...leftNavLinks,
    ...rightNavLinks,
    { id: 'producao-tecnica', label: 'Produção Técnica' },
  ];

  return (
    <header
      className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#17130F]/95 via-[#17130F]/75 to-transparent py-5 sm:py-7 px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Desktop Layout: Exactly 4 Left links | Center Logo (Never shrinks) | Exactly 4 Right links */}
        <div className="hidden xl:grid grid-cols-[1fr_auto_1fr] items-center gap-4 2xl:gap-8">
          
          {/* Left Session Links (4 links) */}
          <nav className="flex items-center justify-end gap-5 2xl:gap-7 text-xs lg:text-[14px] 2xl:text-[15px] tracking-[0.06em] font-medium">
            {leftNavLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#FAF8F4] font-semibold text-shadow-sm'
                      : 'text-[#FAF8F4]/85 hover:text-[#CBA86B]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CBA86B] rounded-full shadow-[0_0_8px_rgba(203,168,107,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Center: Official Golden Logo (User requested: DO NOT shrink on scroll!) */}
          <div className="flex items-center justify-center px-4 2xl:px-8 shrink-0">
            <button
              onClick={() => handleNavClick('inicio')}
              className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89554] cursor-pointer hover:scale-[1.03] transition-transform duration-200"
              aria-label="Advocacia Nicolau - Voltar ao início"
            >
              <Logo
                variant="gold"
                size="lg"
                className="drop-shadow-xl"
              />
            </button>
          </div>

          {/* Right Session Links (4 links) */}
          <nav className="flex items-center justify-start gap-5 2xl:gap-7 text-xs lg:text-[14px] 2xl:text-[15px] tracking-[0.06em] font-medium">
            {rightNavLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#FAF8F4] font-semibold text-shadow-sm'
                      : 'text-[#FAF8F4]/85 hover:text-[#CBA86B]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CBA86B] rounded-full shadow-[0_0_8px_rgba(203,168,107,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Laptop Fallback (lg to xl) */}
        <div className="hidden lg:flex xl:hidden items-center justify-between gap-4">
          <nav className="flex items-center gap-3.5 text-xs font-medium">
            {leftNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-1 cursor-pointer whitespace-nowrap ${
                  activeSection === link.id ? 'text-[#CBA86B] font-semibold' : 'text-[#FAF8F4]/85 hover:text-[#CBA86B]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button onClick={() => handleNavClick('inicio')} className="cursor-pointer">
            <Logo variant="gold" size="lg" />
          </button>

          <nav className="flex items-center gap-3.5 text-xs font-medium">
            {rightNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-1 cursor-pointer whitespace-nowrap ${
                  activeSection === link.id ? 'text-[#CBA86B] font-semibold' : 'text-[#FAF8F4]/85 hover:text-[#CBA86B]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile & Tablet Header with Centered Large Logo */}
        <div className="flex lg:hidden items-center justify-between">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            className="p-2.5 text-[#CBA86B] border border-[#B89554]/50 rounded-full hover:bg-[#B89554]/20 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </a>

          {/* Centered Large Logo on mobile */}
          <button
            onClick={() => handleNavClick('inicio')}
            className="cursor-pointer"
            aria-label="Advocacia Nicolau"
          >
            <Logo variant="gold" size="md" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-[#FAF8F4] border border-[#B89554]/40 rounded-lg hover:text-[#CBA86B] hover:border-[#CBA86B] transition-colors focus-visible:outline-none"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay with all 8 Sessions */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#17130F]/98 backdrop-blur-xl border-b border-[#B89554]/30 px-6 py-8 animate-fadeIn shadow-2xl">
          <nav className="flex flex-col space-y-2.5">
            {allNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left text-base font-medium tracking-wide text-[#FAF8F4]/90 hover:text-[#D6B779] py-2.5 border-b border-white/5 transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>{link.label}</span>
                {activeSection === link.id && (
                  <span className="w-2 h-2 rounded-full bg-[#CBA86B]" />
                )}
              </button>
            ))}

            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-left text-xs tracking-wider text-[#CBA86B]/80 hover:text-[#CBA86B] py-2 border-b border-white/5 transition-colors cursor-pointer flex items-center justify-between pt-3"
              >
                <span>Painel Administrativo</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#B89554]/10 border border-[#B89554]/30">
                  Gerenciar
                </span>
              </button>
            )}

            <div className="pt-4 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-3 text-xs font-semibold tracking-wider uppercase border border-[#B89554] text-[#D6B779] hover:bg-[#B89554] hover:text-[#17130F] rounded-full transition-colors shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Fale Conosco pelo WhatsApp</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
