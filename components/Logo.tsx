
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 100 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Antennas */}
        <rect x="65" y="20" width="10" height="30" rx="5" fill="#0D9488" />
        <rect x="125" y="20" width="10" height="30" rx="5" fill="#0D9488" />
        <circle cx="70" cy="20" r="12" fill="#FACC15" />
        <circle cx="130" cy="20" r="12" fill="#FACC15" />
        
        {/* Head Body */}
        <rect x="40" y="45" width="120" height="110" rx="40" fill="#14B8A6" />
        
        {/* Face Display Area */}
        <rect x="55" y="60" width="90" height="80" rx="25" fill="#0F766E" opacity="0.2" />
        
        {/* Eyes */}
        <circle cx="75" cy="85" r="14" fill="#FACC15" />
        <circle cx="125" cy="85" r="14" fill="#FACC15" />
        
        {/* Friendly Smile */}
        <path
          d="M75 115C75 115 85 130 100 130C115 130 125 115 125 115"
          stroke="#FACC15"
          strokeWidth="10"
          strokeLinecap="round"
        />
        
        {/* Subtle Bottom Shade */}
        <path
          d="M40 130C40 143.807 51.1929 155 65 155H135C148.807 155 160 143.807 160 130V135C160 148.807 148.807 160 135 160H65C51.1929 160 40 148.807 40 135V130Z"
          fill="#0D9488"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

export default Logo;
