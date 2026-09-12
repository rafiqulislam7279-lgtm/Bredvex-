import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-rose-600 flex items-center justify-center text-white font-extrabold shadow-md transition-transform duration-200 group-hover:scale-105 overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {/* Subtle geometric grid backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.35),transparent_70%)]" />
      
      {/* Crisp vector emblem */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 relative z-10 text-white drop-shadow-sm"
      >
        <path
          d="M4 4.5C4 3.67 4.67 3 5.5 3H13.5C16.54 3 19 5.46 19 8.5C19 10.38 18.06 12.04 16.62 13.03C18.59 13.98 20 16.08 20 18.5C20 21.54 17.54 24 14.5 24H5.5C4.67 24 4 23.33 4 22.5V4.5Z"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <path
          d="M6 5H13C15.21 5 17 6.79 17 9C17 11.21 15.21 13 13 13H6V5Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 13H14C16.21 13 18 14.79 18 17C18 19.21 16.21 21 14 21H6V13Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="9" r="1.5" fill="#F43F5E" />
        <circle cx="15" cy="17" r="1.5" fill="#F43F5E" />
      </svg>
    </div>
  );
};
