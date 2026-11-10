import React, { useState } from 'react';
import { ShieldCheck, Building2, FileText, Scale, ArrowRight, CheckCircle2, MessageSquare, X } from 'lucide-react';
import { ContactInfo, initialContactInfo } from '../data/officeData';

interface CorporateSectionProps {
  contactInfo?: ContactInfo;
  onContactClick?: (subject?: string) => void;
}

export const CorporateSection: React.FC<CorporateSectionProps> = ({
  contactInfo = initialContactInfo,
  onContactClick,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<{
    title: string;
    description: string;
    details: string[];
  } | null>(null);

  const whatsappUrl = `https://wa.me/${contactInfo.whatsappNumberDigits}?text=${encodeURIComponent(
    'Olá! Gostaria de uma consulta jurídica especializada em Direito Empresarial com a Advocacia Nicolau.'
  )}`;

  const pillars = [
    {
      id: 'societario',
      icon: Building2,
      tag: 'Societário & Governança',
      title: 'Estruturação Societária & Holdings',
      shortDesc: 'Constituição de holdings familiares e patrimoniais, acordos de sócios e proteção de ativos corporativos.',
      details: [
        'Planejamento sucessório empresarial e estruturação de holdings patrimoniais para blindagem lícita de bens.',
        'Elaboração e revisão minuciosa de Acordos de Sócios, Acordos de Acionistas e Estatutos Sociais.',
        'Governança corporativa para empresas familiares em fase de transição de liderança.',
        'Auditoria prévia (due diligence) para fusões, aquisições e entrada de novos investidores.'
      ],
    },
    {
      id: 'contratos',
      icon: FileText,
      tag: 'Contratos Comerciais',
      title: 'Contratos Mercantis Estratégicos',
      shortDesc: 'Elaboração, negociação e auditoria de contratos de alta complexidade para segurança negocial.',
      details: [
        'Formulação de instrumentos bilaterais com cláusulas penais, resolução expressa e garantias reais personalizadas.',
        'Contratos de representação comercial, distribuição, franquias, joint ventures e fornecimento contínuo.',
        'Auditoria contratual para eliminação de ambiguidades e prevenção de litígios onerosos.',
        'Termos de confidencialidade (NDA), não concorrência e proteção de segredos de negócio.'
      ],
    },
    {
      id: 'compliance',
      icon: ShieldCheck,
      tag: 'Prevenção de Riscos',
      title: 'Compliance & Gestão de Passivos',
      shortDesc: 'Mitigação proativa de riscos fiscais, trabalhistas e regulatórios no agronegócio e na indústria.',
      details: [
        'Mapeamento preventivo de passivos trabalhistas estratégicos e readequação de rotinas corporativas.',
        'Adequação jurídica a exigências regulatórias, ambientais e agrárias no setor produtivo paranaense.',
        'Elaboração de códigos de conduta interna e políticas de conformidade jurídica.',
        'Gestão de riscos contratuais para proteção do fluxo financeiro e da imagem corporativa.'
      ],
    },
    {
      id: 'contencioso',
      icon: Scale,
      tag: 'Tribunais & Arbitragem',
      title: 'Contencioso Empresarial Estratégico',
      shortDesc: 'Atuação combativa perante varas especializadas e Tribunais de Justiça e Superiores.',
      details: [
        'Defesa em disputas societárias complexas, dissoluções parciais de sociedade e apuração de haveres.',
        'Recuperação de créditos de alta monta, execuções de títulos extrajudiciais e medidas cautelares.',
        'Representação em câmaras de mediação e arbitragem empresarial.',
        'Recursos especiais e extraordinários perante o Superior Tribunal de Justiça (STJ) e STF.'
      ],
    },
  ];

  return (
    <section id="empresarial" className="relative py-24 lg:py-32 bg-[#14100D] text-[#FAF8F4] overflow-hidden border-t border-[#B89554]/25">
      {/* Background radial gradient accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B89554]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#CBA86B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Kicker with Line */}
            <div className="flex items-center gap-3.5 mb-5">
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#CBA86B] font-semibold"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                ADVOCACIA EMPRESARIAL & SOCIETÁRIA
              </span>
              <span className="w-16 sm:w-24 h-[1.5px] bg-[#CBA86B]/60" />
            </div>

            {/* Headline */}
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.85rem] text-[#FAF8F4] font-normal leading-[1.15]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Segurança jurídica e estratégia<br />
              para a solidez e o crescimento<br />
              <span className="text-[#CBA86B] italic font-normal">do seu negócio.</span>
            </h2>
          </div>

          <div className="max-w-md flex flex-col justify-end">
            <p className="text-sm sm:text-base text-[#FAF8F4]/80 font-light leading-relaxed mb-6">
              Assessoramos grupos econômicos, indústrias, cooperativas e empresas familiares na prevenção de litígios, estruturação societária e defesa dos interesses mercantis com mais de 40 anos de autoridade forense.
            </p>

            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#CBA86B] hover:bg-[#D6B779] text-[#17130F] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#17130F]" />
                <span>Consultar Assessoria Empresarial</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                onClick={() => setSelectedPillar({
                  title: pillar.title,
                  description: pillar.shortDesc,
                  details: pillar.details,
                })}
                className="bg-[#1C1714] border border-[#B89554]/30 hover:border-[#D6B779] rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#B89554]/15 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#251E19] border border-[#B89554]/40 flex items-center justify-center text-[#CBA86B] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[#CBA86B]/80 font-medium bg-[#14100D] px-2.5 py-1 rounded-full border border-[#B89554]/25">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3
                    className="text-lg sm:text-xl font-normal text-[#FAF8F4] group-hover:text-[#D6B779] transition-colors leading-snug mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#FAF8F4]/75 font-light leading-relaxed mb-6">
                    {pillar.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#CBA86B] font-medium group-hover:text-[#FAF8F4] transition-colors">
                  <span>Ver escopo completo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate Trust Bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1E1814] via-[#1A1410] to-[#1E1814] border border-[#B89554]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="text-3xl sm:text-4xl font-serif text-[#CBA86B] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              48+
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-medium text-[#FAF8F4]">
                Anos de Tradição e Excelência Jurídica em Guarapuava e no Paraná
              </h4>
              <p className="text-xs text-[#FAF8F4]/70 font-light mt-0.5">
                Atendimento presencial em sede própria e reuniões estratégicas para diretorias corporativas.
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full border border-[#B89554] text-xs font-semibold uppercase tracking-wider text-[#CBA86B] hover:bg-[#CBA86B] hover:text-[#17130F] transition-all shrink-0 cursor-pointer"
          >
            Agendar Reunião
          </a>
        </div>
      </div>

      {/* Modal: Scope of Corporate Services */}
      {selectedPillar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl bg-[#1C1714] border border-[#B89554] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#FAF8F4] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPillar(null)}
              className="absolute top-4 right-4 p-2 text-[#FAF8F4]/70 hover:text-[#CBA86B] transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] uppercase tracking-[0.2em] text-[#CBA86B] font-semibold block mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
              Assessoria Jurídica Especializada
            </span>

            <h3 className="text-2xl font-serif text-[#FAF8F4] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {selectedPillar.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#CBA86B] italic font-light mb-6 border-l-2 border-[#CBA86B] pl-3">
              {selectedPillar.description}
            </p>

            <div className="space-y-3 mb-8">
              {selectedPillar.details.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#FAF8F4]/85 leading-relaxed font-light">
                  <CheckCircle2 className="w-4 h-4 text-[#CBA86B] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-5 border-t border-[#B89554]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#FAF8F4]/60">
                Atendimento para empresas em todo o Paraná.
              </span>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedPillar(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#CBA86B] text-[#17130F] font-semibold text-xs tracking-wider uppercase hover:bg-[#D6B779] transition-colors text-center"
              >
                Falar com Especialista
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
