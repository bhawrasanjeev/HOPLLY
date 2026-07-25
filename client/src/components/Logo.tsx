import type { FC } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  return (
    <div className={`logo ${className}`}>
      {/* Brand Icon SVG matching user image (House roof + H structure + Green Location Pin + Search Glass) */}
      <div className={`logo-icon logo-icon--${size}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {/* House Roof Top */}
          <path d="M15 35 L50 12 L85 35 Z" fill="#84CC16" />
          {/* Letter H grey columns */}
          <rect x="25" y="38" width="12" height="48" rx="2" fill="#A3A3A3" />
          <rect x="63" y="38" width="12" height="48" rx="2" fill="#A3A3A3" />
          <rect x="37" y="58" width="26" height="8" fill="#A3A3A3" />
          {/* Green Pin */}
          <path d="M52 28 C41 28 32 37 32 48 C32 62 52 82 52 82 C52 82 72 62 72 48 C72 37 63 28 52 28 Z" fill="#16A34A" />
          <circle cx="52" cy="46" r="8" fill="#FFFFFF" />
          {/* Magnifying Glass */}
          <circle cx="68" cy="65" r="11" stroke="#84CC16" strokeWidth="4" fill="none" />
          <line x1="76" y1="73" x2="88" y2="85" stroke="#84CC16" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <span className={`logo-text logo-text--${size}`}>
          Hoplly
        </span>
      )}
    </div>
  );
};
