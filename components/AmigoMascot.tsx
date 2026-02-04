
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
          
          {/* Guitar Wood Gradient */}
          <linearGradient id="guitarBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A1887F" />
            <stop offset="100%" stopColor="#5D4037" />
          </linearGradient>

          {/* Sombrero Shine */}
          <linearGradient id="hatShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#424242" />
            <stop offset="100%" stopColor="#121212" />
          </linearGradient>
        </defs>

        {/* Aura / Glow */}
        <circle cx="100" cy="110" r="85" fill="#F0F9FF" opacity="0.4" />
        
        {/* Arm - Right (Waving) */}
        <path d="M145,110 Q165,100 170,115 Q175,135 155,145" fill="#FFC107" stroke="#FF8F00" strokeWidth="2" />

        {/* Arm - Left (Holding Guitar) */}
        <path d="M55,115 Q35,130 45,155" fill="#FFC107" stroke="#FF8F00" strokeWidth="2" />

        {/* Main Head */}
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

        {/* GUITAR */}
        <g transform="translate(35, 125) rotate(-15)">
            {/* Guitar Body */}
            <path d="M15,10 Q25,0 35,10 Q45,20 40,35 Q30,45 20,45 Q5,40 10,25 Q12,15 15,10" fill="url(#guitarBody)" stroke="#3E2723" strokeWidth="1" />
            {/* Sound Hole */}
            <circle cx="27" cy="25" r="4" fill="#3E2723" />
            {/* Neck */}
            <rect x="24" y="-5" width="6" height="15" fill="#8D6E63" stroke="#3E2723" strokeWidth="0.5" />
            {/* Headstock */}
            <rect x="22" y="-12" width="10" height="8" rx="2" fill="#5D4037" stroke="#3E2723" strokeWidth="0.5" />
            {/* Strings */}
            <g stroke="#D7CCC8" strokeWidth="0.3" opacity="0.6">
                <line x1="25.5" y1="-5" x2="25.5" y2="40" />
                <line x1="27" y1="-5" x2="27" y2="40" />
                <line x1="28.5" y1="-5" x2="28.5" y2="40" />
            </g>
        </g>

        {/* SOMBRERO - Wide and Decorative */}
        <g transform="translate(0, 15)">
            {/* Crown */}
            <path d="M75,60 Q100,10 125,60" fill="url(#hatShine)" stroke="black" strokeWidth="1" />
            {/* Wide Brim */}
            <path d="M10,75 Q100,50 190,75 Q100,105 10,75 Z" fill="#212121" stroke="black" strokeWidth="1.5" />
            {/* Decorative Ornaments (White Dots/Patterns) */}
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
            {/* Inner Brim Detail */}
            <path d="M30,76 Q100,58 170,76" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 2" />
        </g>

        {/* BOWTIE - Red with white dots */}
        <g transform="translate(100, 160)">
            <path d="M-22,-10 L0,0 L-22,10 Z" fill="#D32F2F" />
            <path d="M22,-10 L0,0 L22,10 Z" fill="#D32F2F" />
            <circle cx="0" cy="0" r="6" fill="#B71C1C" />
            {/* Polka Dots */}
            <g fill="white" opacity="0.8">
                <circle cx="-14" cy="-3" r="1.5" />
                <circle cx="-14" cy="3" r="1.5" />
                <circle cx="14" cy="-3" r="1.5" />
                <circle cx="14" cy="3" r="1.5" />
                <circle cx="0" cy="0" r="1" />
            </g>
        </g>
      </svg>
    </div>
  );
};

export default AmigoMascot;
