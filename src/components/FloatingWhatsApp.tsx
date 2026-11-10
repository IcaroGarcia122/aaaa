import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { ContactInfo } from '../data/officeData';

interface FloatingWhatsAppProps {
  contactInfo: ContactInfo;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ contactInfo }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${contactInfo.whatsappNumberDigits}?text=${encodeURIComponent(
    'Olá! Gostaria de falar com um advogado da Advocacia Nicolau.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip / Quick pop */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#17130F] text-[#FAF8F4] px-4 py-2 border border-[#B89554] shadow-2xl animate-fadeIn text-xs">
          <span>Fale diretamente com nossa banca</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#FAF8F4]/60 hover:text-[#FAF8F4] ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        aria-label="Fale conosco no WhatsApp"
        className="relative group flex items-center justify-center w-14 h-14 bg-[#B89554] text-[#17130F] shadow-2xl hover:bg-[#D6B779] hover:scale-105 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B779]"
        style={{
          boxShadow: '0 10px 25px -5px rgba(184, 149, 84, 0.4)',
        }}
      >
        <MessageSquare className="w-6 h-6 fill-current text-[#17130F]" />

        {/* Subtle aura ring */}
        <span className="absolute inset-0 border border-[#B89554] scale-110 opacity-40 group-hover:scale-125 group-hover:opacity-0 transition-all duration-700 pointer-events-none" />
      </a>
    </div>
  );
};
