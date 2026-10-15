import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'colored' | 'white';
  showText?: boolean;
  className?: string;
}

const sizes = {
  xs: { icon: 20, text: 'text-sm', sub: 'text-[8px]' },
  sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
  md: { icon: 38, text: 'text-2xl', sub: 'text-[10px]' },
  lg: { icon: 48, text: 'text-3xl', sub: 'text-xs' },
  xl: { icon: 64, text: 'text-5xl', sub: 'text-sm' },
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'colored', showText = true, className = '' }) => {
  const s = sizes[size];
  
  const colors = {
    light: { primary: '#FFFFFF', secondary: 'rgba(255,255,255,0.6)', text: '#FFFFFF', sub: 'rgba(255,255,255,0.7)' },
    dark: { primary: '#0F0F1A', secondary: '#FF6B35', text: '#0F0F1A', sub: '#5A5A7A' },
    colored: { primary: '#FF6B35', secondary: '#FF8C5A', text: '#0F0F1A', sub: '#7B7B9D' },
    white: { primary: '#FFFFFF', secondary: 'rgba(255,255,255,0.5)', text: '#FFFFFF', sub: 'rgba(255,255,255,0.6)' },
  };

  const c = colors[variant];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex-shrink-0">
        <svg width={s.icon} height={s.icon} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background circle */}
          <circle cx="32" cy="32" r="30" fill={c.primary} opacity="0.08" />
          <circle cx="32" cy="32" r="30" stroke={c.primary} strokeWidth="1.5" opacity="0.2" />
          
          {/* Main lightning bolt */}
          <path
            d="M36 8L18 34H28L24 56L46 30H36L40 8H36Z"
            fill={c.primary}
          />
          
          {/* Lightning highlight */}
          <path
            d="M36 8L28 22H34L30 38L42 24H36L40 8H36Z"
            fill="white"
            opacity="0.3"
          />
          
          {/* Small decorative dots */}
          <circle cx="50" cy="14" r="2" fill={c.secondary} />
          <circle cx="12" cy="48" r="1.5" fill={c.secondary} />
          <circle cx="52" cy="46" r="1" fill={c.secondary} />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-extrabold ${s.text} tracking-tight`} style={{ color: c.text }}>
            Flash<span style={{ color: c.primary }}>Food</span>
          </span>
          {(size === 'md' || size === 'lg' || size === 'xl') && (
            <span className={`${s.sub} font-medium tracking-wider uppercase mt-0.5`} style={{ color: c.sub }}>
              Delivery Express
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
