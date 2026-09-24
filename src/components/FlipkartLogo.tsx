import React from 'react';

interface FlipkartLogoProps {
  className?: string;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export function FlipkartLogo({ className = '', isCollapsed = false, onClick }: FlipkartLogoProps) {
  // Official Flipkart Yellow Circle with Blue 'f' and speed lines
  const YellowCircleIcon = (
    <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Yellow Circle */}
        <circle cx="50" cy="50" r="49" fill="#FFDC00" />
        
        {/* Blue 'f' with speed lines */}
        <path
          d="M80.5 28C81.5 23.5 76.5 19 66 21C55 23 46 31 43.5 45.5H23L24.8 49H29L26 53.5H19L17.5 57H39.8L37 77.5H54.5L57.5 57H70.5C73.5 57 74.8 54 74.2 50.5C73.6 47 70.5 46.5 61 46.5C61.5 41 65 31 74 31C78 31 80 32 80.5 28Z"
          fill="#1C4ED8"
        />
        {/* Upper speed line */}
        <path
          d="M13.5 45.5H20.5L19 49H12L13.5 45.5Z"
          fill="#1C4ED8"
        />
        {/* Lower speed line */}
        <path
          d="M7 57H14.5L13.5 60.5H6L7 57Z"
          fill="#1C4ED8"
        />
      </svg>
    </div>
  );

  if (isCollapsed) {
    return (
      <div 
        onClick={onClick}
        className={`flex items-center justify-center ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
        title="Go to Team Workspace"
      >
        {YellowCircleIcon}
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      title="Go to Team Workspace"
    >
      {YellowCircleIcon}

      {/* Typography: Flipkart in blue, FIRST MILE in orange */}
      <div className="flex flex-col leading-none">
        <span className="text-[20px] font-black italic tracking-tight text-[#2874F0] font-sans">
          Flipkart
        </span>
        <span className="text-[9.5px] font-black tracking-widest text-[#FF6E00] uppercase mt-0.5">
          FIRST MILE
        </span>
      </div>
    </div>
  );
}
