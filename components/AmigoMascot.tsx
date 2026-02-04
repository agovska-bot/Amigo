
import React from 'react';

interface AmigoMascotProps {
  size?: number;
  className?: string;
}

const AmigoMascot: React.FC<AmigoMascotProps> = ({ size = 200, className = "" }) => {
  return (
    <div 
      className={`relative flex items-center justify-center overflow-visible ${className}`} 
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full animate-float select-none relative">
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        
        <svg 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full drop-shadow-[0_10px_30px_rgba(20,184,166,0.4)]"
        >
          <defs>
            <linearGradient id="prismGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="lensGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>
          </defs>

          {/* Main Body - Geometric Prism */}
          <path 
            d="M100 30 L160 70 L160 130 L100 170 L40 130 L40 70 Z" 
            fill="url(#prismGradient)" 
            stroke="#2DD4BF" 
            strokeWidth="3"
            strokeLinejoin="round"
          />
          
          {/* Inner Core Glass Effect */}
          <path 
            d="M100 50 L140 75 L140 125 L100 150 L60 125 L60 75 Z" 
            fill="rgba(45, 212, 191, 0.1)" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1"
          />

          {/* Digital Eyes / Vizor */}
          <rect x="75" y="85" width="50" height="15" rx="7.5" fill="#0F172A" stroke="#2DD4BF" strokeWidth="1" />
          <g className="animate-scan">
             <rect x="80" y="90" width="10" height="5" rx="2.5" fill="#2DD4BF" />
             <rect x="110" y="90" width="10" height="5" rx="2.5" fill="#2DD4BF" />
          </g>

          {/* Translation Beam (Bottom) */}
          <path 
            d="M80 170 L100 190 L120 170" 
            stroke="#2DD4BF" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.6"
          />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes scan {
          0%, 100% { opacity: 1; transform: scaleX(1); }
          50% { opacity: 0.5; transform: scaleX(0.8); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-scan { animation: scan 2s ease-in-out infinite; transform-origin: center; }
      `}</style>
    </div>
  );
};

export default AmigoMascot;
