import React, { useState } from 'react';
import { articles, Article } from '../data/officeData';
import { Calendar, Clock, ChevronRight, X, BookOpen, Share2 } from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  const categories = [
    { id: 'all', label: 'Todos os Artigos' },
    { id: 'Direito Criminal', label: 'Direito Criminal' },
    { id: 'Direito Civil', label: 'Direito Civil' },
    { id: 'Direito de Família', label: 'Direito de Família' },
  ];

  const filteredArticles =
    activeCategory === 'all'
      ? articles
      : articles.filter((art) => art.category === activeCategory);

  return (
    <section id="conteudo" className="py-24 lg:py-32 bg-[#FAF8F4] text-[#17130F] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#B89554]" />
            <span
              className="text-xs uppercase tracking-[0.3em] text-[#8C6F36] font-semibold"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              PRODUÇÃO TÉCNICA
            </span>
            <span className="w-8 h-[1px] bg-[#B89554]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.2] mb-6 text-[#17130F]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              textWrap: 'balance',
            }}
          >
            Informação e conhecimento jurídico.
          </h2>

          <p className="text-base sm:text-lg text-[#282019]/80 font-light leading-relaxed max-w-2xl mx-auto">
            Artigos informativos e esclarecimentos técnicos sobre os direitos que impactam a sua vida e
            o seu patrimônio.
          </p>
        </div>

        {/* Category Filters (Clean Segmented / Button Style) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 border cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89554] ${
                activeCategory === cat.id
                  ? 'bg-[#17130F] text-[#FAF8F4] border-[#17130F] shadow-sm'
                  : 'bg-white text-[#282019]/80 border-[#B89554]/30 hover:border-[#B89554] hover:text-[#17130F]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-[#B89554]/30 hover:border-[#B89554] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#282019]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.03]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Category kicker */}
                <div className="absolute top-4 left-4">
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#FAF8F4] bg-[#17130F]/90 backdrop-blur-sm px-3 py-1 border border-[#B89554]/50"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                <div>
                  {/* Metadata (Clean Unboxed Text with Separator) */}
                  <div className="flex items-center gap-2 text-xs text-[#8C6F36] mb-3">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-medium text-[#17130F] group-hover:text-[#8C6F36] transition-colors mb-3 leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {article.title}
                  </h3>

                  <p className="text-sm text-[#282019]/75 font-light leading-relaxed line-clamp-3 mb-6">
                    {article.description}
                  </p>
                </div>

                {/* Read More Button */}
                <div className="pt-4 border-t border-[#B89554]/20 flex items-center justify-between">
                  <button
                    onClick={() => setReadingArticle(article)}
                    className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6F36] hover:text-[#17130F] flex items-center gap-1.5 transition-colors cursor-pointer group-hover:underline"
                  >
                    <span>Leia mais</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[11px] text-[#282019]/50 font-light">
                    Por {article.author}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {readingArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-reader-title"
        >
          <div className="relative w-full max-w-3xl bg-[#FAF8F4] border border-[#B89554] p-6 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setReadingArticle(null)}
              className="absolute top-4 right-4 p-2 text-[#17130F]/70 hover:text-[#17130F] hover:bg-[#B89554]/10 transition-colors focus:outline-none"
              aria-label="Fechar artigo"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span
                className="text-xs uppercase tracking-[0.25em] text-[#8C6F36] font-semibold"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {readingArticle.category}
              </span>

              <h3
                id="article-reader-title"
                className="text-2xl sm:text-3xl lg:text-4xl text-[#17130F] font-normal mt-2 mb-4 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {readingArticle.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-[#282019]/70 border-b border-[#B89554]/25 pb-4">
                <span>Publicado em {readingArticle.date}</span>
                <span>·</span>
                <span>{readingArticle.readTime}</span>
                <span>·</span>
                <span>Autoria: {readingArticle.author}</span>
              </div>
            </div>

            {/* Article Image Banner */}
            <div className="aspect-[21/9] overflow-hidden bg-[#282019] mb-8 border border-[#B89554]/30">
              <img
                src={readingArticle.image}
                alt={readingArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Article Content */}
            <div className="space-y-4 text-base sm:text-lg text-[#282019]/85 font-light leading-relaxed mb-8">
              {readingArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Institutional Disclaimer and Sharing */}
            <div className="pt-6 border-t border-[#B89554]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#282019]/60 italic">
                * Conteúdo meramente informativo em conformidade com o Provimento nº 205/2021 da OAB.
              </p>

              <button
                onClick={() => setReadingArticle(null)}
                className="px-6 py-2.5 bg-[#17130F] text-[#FAF8F4] text-xs uppercase tracking-widest font-medium hover:bg-[#B89554] hover:text-[#17130F] transition-colors cursor-pointer"
              >
                Fechar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
