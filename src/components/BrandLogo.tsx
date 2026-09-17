import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-sm',
    md: 'w-10 h-10 rounded-xl text-base',
    lg: 'w-12 h-12 rounded-2xl text-lg',
  };

  const svgSizes = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5.5 h-5.5',
    lg: 'w-6.5 h-6.5',
  };

  return (
    <div
      className={`relative bg-gradient-to-br from-slate-950 via-slate-900 to-rose-700 flex items-center justify-center text-white font-extrabold shadow-md transition-transform duration-200 group-hover:scale-105 overflow-hidden border border-white/10 ${sizeClasses[size]} ${className}`}
    >
      {/* Luxury metallic edge illumination */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(225,29,72,0.4),transparent_65%)]" />
      
      {/* Architectural BREDVEX Monogram */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${svgSizes[size]} relative z-10 text-white drop-shadow-sm`}
      >
        <path
          d="M6 4H14.5C17.54 4 20 6.46 20 9.5C20 11.4 19.04 13.08 17.56 14.07C19.53 15.02 20.9 17.1 20.9 19.5C20.9 22.54 18.44 25 15.4 25H6V4Z"
          fill="currentColor"
          fillOpacity="0.08"
        />
        <path
          d="M6 4.5H13.5C15.9853 4.5 18 6.51472 18 9C18 11.4853 15.9853 13.5 13.5 13.5H6V4.5Z"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 13.5H14.5C17.2614 13.5 19.5 15.7386 19.5 18.5C19.5 21.2614 17.2614 23.5 14.5 23.5H6V13.5Z"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 3.5V24.5"
          stroke="#F43F5E"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
