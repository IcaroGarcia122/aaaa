import React, { useState } from 'react';
import { Calendar, ArrowRight, X, Share2, Check, BellRing } from 'lucide-react';

interface AnnouncementItem {
  id: string;
  tag: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string[];
}

export const AnnouncementsSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AnnouncementItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const announcements: AnnouncementItem[] = [
    {
      id: 'com-1',
      tag: 'Nota Oficial',
      title: 'Posicionamento Institucional e Atuação em Defesas de Repercussão Regional',
      date: '08 de Novembro de 2026',
      image: '/team_juri.jpg',
      excerpt: 'Reafirmação do compromisso histórico da Advocacia Nicolau com as garantias constitucionais e o sigilo processual.',
      content: [
        'A Advocacia Nicolau reafirma seu compromisso histórico de mais de quatro décadas na defesa combativa e ética das prerrogativas da advocacia e das garantias individuais asseguradas pela Constituição Federal.',
        'Nos processos de ampla repercussão pública e perante o Tribunal do Júri, a atuação do escritório permanece estritamente pautada na técnica forense, na ampla defesa e no respeito à legalidade processual penal.',
        'Informações relativas a processos sob sigilo de justiça são resguardadas com absoluto rigor ético e deontológico em respeito aos nossos clientes e ao Poder Judiciário.'
      ],
    },
    {
      id: 'com-2',
      tag: 'Atendimento & Estrutura',
      title: 'Atendimento Presencial em Guarapuava e Plataforma Digital Integrada',
      date: '02 de Novembro de 2026',
      image: '/src/assets/images/hero_justice_themis_1794270159745.jpg',
      excerpt: 'Disponibilização de canal digital criptografado para reuniões virtuais com clientes em todo o território nacional.',
      content: [
        'Comunicamos aos nossos clientes e parceiros que, além do tradicional atendimento em nossa sede própria em Guarapuava/PR, disponibilizamos canal digital criptografado para reuniões virtuais e acompanhamento processual.',
        'Dessa forma, clientes em qualquer comarca ou estado contam com a mesma agilidade e atenção exclusiva que consolidaram nossa história.'
      ],
    },
    {
      id: 'com-3',
      tag: 'Plantão Forense',
      title: 'Informativo Jurídico: Atualização sobre Prazos Processuais e Sessões nos Tribunais',
      date: '25 de Outubro de 2026',
      image: '/src/assets/images/office_facade_nicolau_1794270160258.jpg',
      excerpt: 'Orientações sobre o calendário forense, sessões dos Tribunais Superiores e regime de sobreaviso criminal.',
      content: [
        'Informamos que os prazos processuais e o plantão judiciário nos Tribunais de Justiça e Superiores estão devidamente monitorados por nossa controladoria jurídica.',
        'Audiências de custódia, pedidos de liberdade e medidas urgentes permanecem com atendimento ininterrupto em regime de sobreaviso.'
      ],
    },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section id="comunicados" className="relative py-20 lg:py-28 bg-[#16120E] text-[#FAF8F4] border-t-2 border-[#B89554]/30 overflow-hidden">
      {/* Rich Architectural Textured Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/office_facade_nicolau_1794270160258.jpg"
          alt=""
          className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-125 opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#16120E] via-[#1A1410]/80 to-[#120E0B]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#B89554]/10 via-transparent to-black/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#CBA86B] font-semibold"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                COMUNICADOS & NOTAS OFICIAIS
              </span>
              <span className="w-16 sm:w-24 h-[1.5px] bg-[#CBA86B]/60" />
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FAF8F4] leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Transparência, ética e<br />
              <span className="text-[#CBA86B] italic font-normal">informação oficial.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#FAF8F4]/70 font-light max-w-md">
            Notas públicas, informativos processuais e comunicados oficiais emitidos pela diretoria da Advocacia Nicolau.
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#B89554]/30 shadow-xl cursor-pointer hover:border-[#D6B779] hover:shadow-2xl hover:shadow-[#B89554]/20 transition-all duration-300 flex flex-col justify-end"
            >
              {/* Cover Photo */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = '/team_juri.jpg';
                }}
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

              {/* Card Content Overlay */}
              <div className="relative z-10 p-6 sm:p-7 flex flex-col justify-end">
                {/* Pill Tag Badge */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-[#967444] text-[#FAF8F4] text-[11px] font-medium tracking-wide rounded-full shadow-md">
                    {item.tag}
                  </span>
                </div>

                {/* Bold Headline */}
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-[#D6B779] transition-colors line-clamp-3">
                  {item.title}
                </h3>

                {/* Date and Read Link */}
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-[#FAF8F4]/75">
                  <span className="flex items-center gap-1.5 font-light">
                    <Calendar className="w-3.5 h-3.5 text-[#CBA86B]" />
                    {item.date}
                  </span>

                  <span className="text-[#CBA86B] font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Ler nota</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-[#1C1714] border border-[#B89554] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-[#FAF8F4]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#B89554]/30 bg-[#14100D]">
              <span className="inline-block px-3 py-1 bg-[#967444] text-[#FAF8F4] text-[11px] font-medium rounded-full">
                {selectedItem.tag}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full border border-[#B89554]/40 text-[#CBA86B] hover:bg-[#B89554]/20 transition-colors cursor-pointer"
                  title="Compartilhar"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
              <div>
                <span className="text-xs text-[#CBA86B] font-light flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedItem.date}
                </span>

                <h2
                  className="text-2xl sm:text-3xl font-serif text-[#FAF8F4] leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {selectedItem.title}
                </h2>

                <p className="text-sm text-[#CBA86B] italic font-light mt-2 border-l-2 border-[#CBA86B] pl-3">
                  {selectedItem.excerpt}
                </p>
              </div>

              <div className="h-56 sm:h-64 rounded-xl overflow-hidden border border-[#B89554]/30">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#FAF8F4]/85 font-light leading-relaxed">
                {selectedItem.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-[#B89554]/25 flex items-center justify-between text-xs text-[#FAF8F4]/60">
                <span>Advocacia Nicolau · Desde 1978</span>
                <span className="text-[#CBA86B]">Guarapuava – PR</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
