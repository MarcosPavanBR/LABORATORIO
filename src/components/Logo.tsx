import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'colored';
  showText?: boolean;
}

const sizes = {
  sm: { icon: 24, text: 'text-lg' },
  md: { icon: 36, text: 'text-2xl' },
  lg: { icon: 48, text: 'text-3xl' },
  xl: { icon: 64, text: 'text-5xl' },
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'colored', showText = true }) => {
  const s = sizes[size];
  
  const colors = {
    light: { primary: '#FFFFFF', secondary: '#FFD4C0', text: '#FFFFFF' },
    dark: { primary: '#1A1A2E', secondary: '#FF6B35', text: '#1A1A2E' },
    colored: { primary: '#FF6B35', secondary: '#FF8C5A', text: '#1A1A2E' },
  };

  const c = colors[variant];

  return (
    <div className="flex items-center gap-2">
      <svg width={s.icon} height={s.icon} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Raio/Flash */}
        <path
          d="M38 4L16 36H30L26 60L48 28H34L38 4Z"
          fill={c.primary}
          stroke={c.secondary}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Garfo estilizado */}
        <path
          d="M44 44V56M44 44C44 44 48 44 48 48C48 52 44 52 44 52"
          stroke={c.primary}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Círculo decorativo */}
        <circle cx="32" cy="32" r="30" stroke={c.primary} strokeWidth="2" opacity="0.2" />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-brand font-extrabold ${s.text} leading-none`} style={{ color: c.text }}>
            Flash<span style={{ color: c.primary }}>Food</span>
          </span>
          {size !== 'sm' && (
            <span className="text-xs font-medium opacity-60" style={{ color: c.text }}>
              Delivery Rápido
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
