
import React from 'react';

const AmigoMascot: React.FC<{ size?: number; className?: string }> = ({ size = 200, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background Light Blue Circle */}
        <circle cx="100" cy="100" r="75" fill="none" stroke="#BFDBFE" strokeWidth="2" opacity="0.8" />
        
        {/* Arms/Hands */}
        {/* Waving Hand (Right) */}
        <path d="M140,105 Q155,95 165,100 Q175,105 160,115" fill="#FFD700" stroke="#EAB308" strokeWidth="1" />
        
        {/* Guitar Hand (Left) */}
        <path d="M60,110 Q45,120 55,135" fill="#FFD700" stroke="#EAB308" strokeWidth="1" />

        {/* Yellow Face with Gradient */}
        <defs>
          <radialGradient id="faceGradient" cx="50%" cy="40%" r="50%" fx="50%" fy="30%">
            <stop offset="0%" stopColor="#FFEA00" />
            <stop offset="100%" stopColor="#FFB700" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="110" r="48" fill="url(#faceGradient)" stroke="#EAB308" strokeWidth="1" />
        
        {/* Rosy Cheeks */}
        <circle cx="72" cy="115" r="10" fill="#FF4D4D" opacity="0.4" filter="blur(2px)" />
        <circle cx="128" cy="115" r="10" fill="#FF4D4D" opacity="0.4" filter="blur(2px)" />

        {/* Eyes & Brows */}
        <circle cx="82" cy="102" r="5" fill="#5D2E0C" />
        <circle cx="118" cy="102" r="5" fill="#5D2E0C" />
        <path d="M72,92 Q82,88 92,92" fill="none" stroke="#5D2E0C" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M108,92 Q118,88 128,92" fill="none" stroke="#5D2E0C" strokeWidth="2.5" strokeLinecap="round" />

        {/* Smile */}
        <path d="M82,125 Q100,138 118,125" fill="none" stroke="#5D2E0C" strokeWidth="3" strokeLinecap="round" />

        {/* SOMBRERO */}
        {/* Crown */}
        <path d="M75,75 Q100,20 125,75" fill="#1A1A1A" stroke="black" strokeWidth="1" />
        {/* Brim */}
        <ellipse cx="100" cy="85" rx="90" ry="32" fill="#1A1A1A" stroke="black" strokeWidth="1" />
        {/* White Pattern on Brim */}
        <g stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9">
          <path d="M30,85 Q35,75 40,85" />
          <path d="M45,88 Q50,78 55,88" />
          <path d="M60,91 Q65,81 70,91" />
          <path d="M75,93 Q80,83 85,93" />
          <path d="M90,94 Q95,84 100,94" />
          <path d="M105,94 Q110,84 115,94" />
          <path d="M120,93 Q125,83 130,93" />
          <path d="M135,91 Q140,81 145,91" />
          <path d="M150,88 Q155,78 160,88" />
          <path d="M165,85 Q170,75 175,85" />
        </g>

        {/* BOWTIE with Polka Dots */}
        <g transform="translate(100, 148)">
          <path d="M-22,-10 L-22,10 L0,0 Z" fill="#D32F2F" />
          <path d="M22,-10 L22,10 L0,0 Z" fill="#D32F2F" />
          <circle cx="0" cy="0" r="6" fill="#D32F2F" />
          {/* Polka Dots */}
          <circle cx="-12" cy="-4" r="2" fill="white" />
          <circle cx="-16" cy="3" r="2" fill="white" />
          <circle cx="12" cy="4" r="2" fill="white" />
          <circle cx="16" cy="-3" r="2" fill="white" />
          <circle cx="0" cy="0" r="1.5" fill="white" />
        </g>

        {/* GUITAR */}
        <g transform="translate(45, 125) rotate(-25)">
          <path d="M0,0 Q-10,10 -5,25 Q0,40 15,40 Q30,40 35,25 Q40,10 30,0 Z" fill="#A0522D" stroke="#5D2E0C" strokeWidth="1" />
          <rect x="13" y="-25" width="4" height="30" fill="#5D2E0C" />
          <rect x="11" y="-28" width="8" height="6" rx="1" fill="#A0522D" />
          <circle cx="15" cy="15" r="6" fill="#5D2E0C" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};

export default AmigoMascot;
