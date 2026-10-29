import React from 'react';

/**
 * Official Coat of Arms of the Republic of Guinea-Bissau (Brasão de Armas da República da Guiné-Bissau)
 * Featured in the official maritime port invoices and state documents.
 */
export function GuineBissauCoatOfArms({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Brasão de Armas da República da Guiné-Bissau"
    >
      {/* Background circle / glow */}
      <circle cx="60" cy="60" r="54" fill="#ffffff" fillOpacity="0.01" />

      {/* Black Star of Africa (Estrela Negra de África) */}
      <path
        d="M60 14L63.8 25.8H76.2L66.2 33.1L70 44.9L60 37.6L50 44.9L53.8 33.1L43.8 25.8H56.2L60 14Z"
        fill="#000000"
      />

      {/* Scallop Shell (Concha de Vieira Dourada) at the center base */}
      <g transform="translate(60, 68)">
        <path
          d="M0 -18 C16 -18 24 -6 24 10 C24 14 18 18 0 18 C-18 18 -24 14 -24 10 C-24 -6 -16 -18 0 -18 Z"
          fill="#FCD116"
          stroke="#B45309"
          strokeWidth="1.5"
        />
        {/* Shell ribs */}
        <path d="M0 16 L0 -16" stroke="#B45309" strokeWidth="1.2" />
        <path d="M-5 16 C-8 6 -10 -4 -12 -12" stroke="#B45309" strokeWidth="1.2" fill="none" />
        <path d="M5 16 C8 6 10 -4 12 -12" stroke="#B45309" strokeWidth="1.2" fill="none" />
        <path d="M-10 14 C-14 6 -17 0 -19 -6" stroke="#B45309" strokeWidth="1" fill="none" />
        <path d="M10 14 C14 6 17 0 19 -6" stroke="#B45309" strokeWidth="1" fill="none" />
        <path d="M-3 17 L-3 15 M3 17 L3 15" stroke="#B45309" strokeWidth="1.5" />
      </g>

      {/* Green Olive / Palm Wreath (Ramos de Oliveira / Palma) on Left */}
      <g stroke="#009E49" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#009E49">
        <path d="M38 82 C24 68 22 46 36 32" fill="none" strokeWidth="2.5" />
        {/* Left leaves */}
        <ellipse cx="26" cy="42" rx="4" ry="2" transform="rotate(-30 26 42)" fill="#009E49" />
        <ellipse cx="23" cy="52" rx="4" ry="2" transform="rotate(-15 23 52)" fill="#009E49" />
        <ellipse cx="24" cy="62" rx="4" ry="2" transform="rotate(10 24 62)" fill="#009E49" />
        <ellipse cx="28" cy="72" rx="4" ry="2" transform="rotate(35 28 72)" fill="#009E49" />
        <ellipse cx="33" cy="36" rx="3.5" ry="1.8" transform="rotate(-45 33 36)" fill="#009E49" />
      </g>

      {/* Green Olive / Palm Wreath on Right */}
      <g stroke="#009E49" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#009E49">
        <path d="M82 82 C96 68 98 46 84 32" fill="none" strokeWidth="2.5" />
        {/* Right leaves */}
        <ellipse cx="94" cy="42" rx="4" ry="2" transform="rotate(30 94 42)" fill="#009E49" />
        <ellipse cx="97" cy="52" rx="4" ry="2" transform="rotate(15 97 52)" fill="#009E49" />
        <ellipse cx="96" cy="62" rx="4" ry="2" transform="rotate(-10 96 62)" fill="#009E49" />
        <ellipse cx="92" cy="72" rx="4" ry="2" transform="rotate(-35 92 72)" fill="#009E49" />
        <ellipse cx="87" cy="36" rx="3.5" ry="1.8" transform="rotate(45 87 36)" fill="#009E49" />
      </g>

      {/* Red Ribbon with National Motto: UNIDADE LUTA PROGRESSO */}
      <g id="ribbon">
        <path
          d="M18 92 C32 87 50 86 60 86 C70 86 88 87 102 92 C96 97 90 101 60 101 C30 101 24 97 18 92 Z"
          fill="#CE1126"
          stroke="#991B1B"
          strokeWidth="1.2"
        />
        {/* Ribbon folds at ends */}
        <path d="M18 92 L14 97 L22 98 Z" fill="#991B1B" />
        <path d="M102 92 L106 97 L98 98 Z" fill="#991B1B" />
        {/* Text */}
        <text
          x="60"
          y="95.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="5.2"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.8"
        >
          UNIDADE LUTA PROGRESSO
        </text>
      </g>
    </svg>
  );
}

/**
 * Official Gold Nautical Helm Emblem of IMP (Instituto Marítimo Portuário da Guiné-Bissau)
 * Centered at the top of official port invoices.
 */
export function IMPOfficialHelmEmblem({ className = 'w-16 h-16' }: { className?: string }) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {!imageError ? (
        <img
          src="/assets/aistudio/images__2__12a47efd.jpg"
          alt="IMP - Instituto Marítimo Portuário"
          className="w-full h-full object-contain filter drop-shadow-md rounded-full"
          onError={() => setImageError(true)}
        />
      ) : (
        /* High-fidelity Vector Helm Fallback */
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle cx="50" cy="50" r="48" fill="#082B59" stroke="#D4AF37" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="43" fill="#0A1D3A" stroke="#C5A059" strokeWidth="1.5" />

          {/* 8 Helm Spokes / Handles */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <g key={idx} transform={`rotate(${angle} 50 50)`}>
              <rect x="47.5" y="4" width="5" height="18" rx="2.5" fill="#D4AF37" stroke="#9A7B2C" strokeWidth="0.8" />
              <line x1="50" y1="20" x2="50" y2="50" stroke="#F3E5AB" strokeWidth="3" />
            </g>
          ))}

          {/* Helm Wheel Ring */}
          <circle cx="50" cy="50" r="28" stroke="#D4AF37" strokeWidth="4.5" fill="none" />
          <circle cx="50" cy="50" r="22" stroke="#B8860B" strokeWidth="1.5" fill="none" />

          {/* Center Hub */}
          <circle cx="50" cy="50" r="14" fill="#D4AF37" stroke="#9A7B2C" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="11" fill="#082B59" />

          {/* Text inside */}
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fill="#F3E5AB"
            fontSize="9"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            IMP
          </text>
        </svg>
      )}
    </div>
  );
}
