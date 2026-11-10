import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold';
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'gold',
  className = '',
  size = 'md',
}) => {
  const heightClasses = {
    sm: 'h-12 sm:h-14',
    md: 'h-16 sm:h-20',
    lg: 'h-20 sm:h-24 lg:h-28',
    xl: 'h-28 sm:h-36',
  }[size];

  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Official golden template logo requested by user */}
      <img
        src="/src/assets/images/Logotipo Dourado Advocacia Nicolau (1).png"
        alt="Advocacia Nicolau - Desde 1978"
        className={`${heightClasses} w-auto object-contain filter drop-shadow-md`}
        onError={(e) => {
          // Fallback to static public logo copy
          const target = e.currentTarget;
          if (target.src.includes('Logotipo%20Dourado') || target.src.includes('Logotipo Dourado')) {
            target.src = '/logo_nicolau_dourado.png';
          }
        }}
      />

      {/* Styled vector typography fallback */}
      <div className="hidden flex-col items-center justify-center text-center">
        <span
          className="text-2xl font-serif text-[#D6B779] tracking-[0.2em] font-bold"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          AN
        </span>
        <span
          className="text-xs uppercase tracking-[0.28em] text-[#FAF8F4] font-medium"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          ADVOCACIA NICOLAU
        </span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#D6B779]">
          DESDE 1978
        </span>
      </div>
    </div>
  );
};
