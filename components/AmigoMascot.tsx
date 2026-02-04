
import React from 'react';

const AmigoMascot: React.FC<{ size?: number; className?: string }> = ({ size = 200, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
        <defs>
          {/* Face 3D Gradient */}
          <radialGradient id="faceGradient" cx="45%" cy="35%" r="55%" fx="45%" fy="35%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#FF8F00" />
          </radialGradient>
          
          {/* Sombrero Shine */}
          <linearGradient id="hatShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#424242" />
            <stop offset="100%" stopColor="#121212" />
          </linearGradient>
        </defs>

        {/* Aura / Glow */}
        <circle cx="100" cy="110" r="85" fill="#F0F9FF" opacity="0.4" />
        
        {/* Main Head Body */}
        <circle cx="100" cy="115" r="55" fill="url(#faceGradient)" />
        
        {/* Rosy Cheeks */}
        <circle cx="68" cy="125" r="12" fill="#FF8A80" opacity="0.4" filter="blur(6px)" />
        <circle cx="132" cy="125" r="12" fill="#FF8A80" opacity="0.4" filter="blur(6px)" />

        {/* Eyes - Joyful */}
        <g>
          <circle cx="82" cy="108" r="7" fill="#3E2723" />
          <circle cx="80" cy="106" r="2.5" fill="white" />
          
          <circle cx="118" cy="108" r="7" fill="#3E2723" />
          <circle cx="116" cy="106" r="2.5" fill="white" />
        </g>

        {/* Brows - Friendly */}
        <path d="M72,98 Q82,92 92,98" fill="none" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
        <path d="M108,98 Q118,92 128,98" fill="none" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />

        {/* Hearty Wide Smile */}
        <path d="M78,135 Q100,155 122,135" fill="none" stroke="#3E2723" strokeWidth="5" strokeLinecap="round" />

        {/* SOMBRERO - Wide and Decorative */}
        <g transform="translate(0, 15)">
            {/* Crown */}
            <path d="M75,60 Q100,10 125,60" fill="url(#hatShine)" stroke="black" strokeWidth="1" />
            {/* Wide Brim */}
            <path d="M10,75 Q100,50 190,75 Q100,105 10,75 Z" fill="#212121" stroke="black" strokeWidth="1.5" />
            {/* Decorative Ornaments */}
            <g fill="white" opacity="0.9">
                <circle cx="30" cy="74" r="2.5" />
                <circle cx="50" cy="72" r="2.5" />
                <circle cx="70" cy="71" r="2.5" />
                <circle cx="90" cy="71" r="2.5" />
                <circle cx="110" cy="71" r="2.5" />
                <circle cx="130" cy="71" r="2.5" />
                <circle cx="150" cy="72" r="2.5" />
                <circle cx="170" cy="74" r="2.5" />
            </g>
        </g>

        {/* BOWTIE - Centered below the smile */}
        <g transform="translate(100, 160) scale(0.8)">
            <path d="M-22,-10 L0,0 L-22,10 Z" fill="#D32F2F" />
            <path d="M22,-10 L0,0 L22,10 Z" fill="#D32F2F" />
            <circle cx="0" cy="0" r="6" fill="#B71C1C" />
        </g>
      </svg>
    </div>
  );
};

export default AmigoMascot;
