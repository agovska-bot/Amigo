
import React from 'react';

const AmigoMascot: React.FC<{ size?: number; className?: string }> = ({ size = 200, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        {/* Shadow/Glow */}
        <circle cx="100" cy="115" r="50" fill="black" opacity="0.1" />
        
        {/* Yellow Face */}
        <circle cx="100" cy="110" r="45" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
        
        {/* Rosy Cheeks */}
        <circle cx="70" cy="120" r="8" fill="#FF6347" opacity="0.3" />
        <circle cx="130" cy="120" r="8" fill="#FF6347" opacity="0.3" />

        {/* Eyes */}
        <circle cx="85" cy="105" r="4" fill="#4B2C20" />
        <circle cx="115" cy="105" r="4" fill="#4B2C20" />
        
        {/* Brows */}
        <path d="M75 95 Q85 90 95 95" fill="none" stroke="#4B2C20" strokeWidth="3" strokeLinecap="round" />
        <path d="M105 95 Q115 90 125 95" fill="none" stroke="#4B2C20" strokeWidth="3" strokeLinecap="round" />

        {/* Smile */}
        <path d="M85 130 Q100 140 115 130" fill="none" stroke="#4B2C20" strokeWidth="3" strokeLinecap="round" />

        {/* MUSTACHE */}
        <path d="M85 118 Q100 115 115 118 Q125 125 130 118" fill="none" stroke="#331a00" strokeWidth="4" strokeLinecap="round" />
        <path d="M85 118 Q75 125 70 118" fill="none" stroke="#331a00" strokeWidth="4" strokeLinecap="round" />

        {/* BOWTIE */}
        <path d="M85 155 L115 155 L100 145 Z" fill="#CC0000" />
        <circle cx="100" cy="150" r="5" fill="#CC0000" stroke="white" strokeWidth="1" />
        <path d="M85 145 L85 155 L100 150 Z" fill="#CC0000" />
        <path d="M115 145 L115 155 L100 150 Z" fill="#CC0000" />

        {/* SOMBRERO */}
        <ellipse cx="100" cy="75" rx="85" ry="35" fill="#222" />
        <path d="M100 75 L100 40 Q100 30 110 30 L90 30 Q100 30 100 40 Z" fill="#222" />
        <path d="M25 75 Q100 95 175 75" fill="none" stroke="white" strokeWidth="4" strokeDasharray="8,4" />
        
        {/* GUITAR (Small in hand) */}
        <g transform="translate(40, 130) rotate(-30)">
            <path d="M0 0 Q10 15 20 0 L20 40 Q10 55 0 40 Z" fill="#8B4513" />
            <rect x="7" y="-20" width="6" height="30" fill="#5D2E0C" />
            <circle cx="10" cy="10" r="4" fill="#331a00" />
        </g>
        
        {/* Hand waving */}
        <circle cx="160" cy="110" r="12" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default AmigoMascot;
