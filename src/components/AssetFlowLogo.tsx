import React from 'react';

interface AssetFlowLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const AssetFlowLogo: React.FC<AssetFlowLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  // Dimension presets
  const iconSizes = {
    sm: { w: 34, h: 34, font: 'text-lg', sub: 'text-[7.5px]' },
    md: { w: 44, h: 44, font: 'text-2xl', sub: 'text-[9.5px]' },
    lg: { w: 56, h: 56, font: 'text-3xl', sub: 'text-[11.5px]' },
    xl: { w: 68, h: 68, font: 'text-4xl', sub: 'text-[13px]' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      
      {/* 100% Vector Transparent Brand Icon */}
      <div
        className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
        style={{ width: iconSizes.w, height: iconSizes.h }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Blue Rounded Squircle App Icon Background */}
          <rect
            width="100"
            height="100"
            rx="26"
            fill="url(#blue-app-gradient)"
          />

          {/* Curved Flow Lines connecting dots to ring */}
          <path
            d="M26 30 C 50 30, 52 50, 70 50"
            stroke="#93C5FD"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M26 50 L 70 50"
            stroke="#93C5FD"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M26 70 C 50 70, 52 50, 70 50"
            stroke="#93C5FD"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* 3 White Origin Nodes on the left */}
          <circle cx="26" cy="30" r="6.5" fill="#FFFFFF" />
          <circle cx="26" cy="50" r="6.5" fill="#FFFFFF" />
          <circle cx="26" cy="70" r="6.5" fill="#FFFFFF" />

          {/* Mint/Teal Target Ring Node on the right */}
          <circle cx="70" cy="50" r="14" fill="#34D399" />
          <circle cx="70" cy="50" r="6.5" fill="#1D64B7" />

          {/* Gradients */}
          <defs>
            <linearGradient id="blue-app-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E65BD" />
              <stop offset="100%" stopColor="#16519E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography (Transparent - No black background!) */}
      <div className="flex flex-col text-start justify-center">
        <div className={`font-black tracking-tight leading-none ${iconSizes.font} flex items-baseline`}>
          <span className="text-white">Asset</span>
          <span className="text-[#34D399] tracking-tight">Flow</span>
        </div>
        {showSubtitle && (
          <span
            className={`font-semibold text-slate-300/90 uppercase tracking-[0.22em] mt-1.5 leading-none font-sans ${iconSizes.sub}`}
          >
            SMART ASSET &amp; MAINTENANCE PLATFORM
          </span>
        )}
      </div>

    </div>
  );
};
