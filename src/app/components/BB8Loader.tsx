'use client';

import React from 'react';

interface BB8LoaderProps {
  message?: string;
}

export default function BB8Loader({ message = 'Accediendo a los archivos de la Holonet...' }: BB8LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative w-28 h-32 select-none">
        <svg width="100%" height="100%" viewBox="0 0 100 120" className="overflow-visible">
          {/* Antennas */}
          <line x1="47" y1="25" x2="47" y2="4" stroke="#4b5563" strokeWidth="1.5" />
          <line x1="53" y1="25" x2="53" y2="10" stroke="#9ca3af" strokeWidth="1" />
          
          {/* Head - Bobbing up and down */}
          <g className="animate-[bounce_2s_infinite]">
            {/* Head Dome */}
            <path 
              d="M32 38 C32 23, 68 23, 68 38 Z" 
              fill="#F9FAFB" 
              stroke="#1F2937" 
              strokeWidth="2" 
            />
            {/* Orange Stripe on Dome */}
            <path 
              d="M36 34 C42 28, 58 28, 64 34" 
              fill="none" 
              stroke="#F97316" 
              strokeWidth="2.5" 
            />
            {/* Bottom Panel lines on Head */}
            <rect x="32" y="35" width="36" height="3" fill="#D1D5DB" stroke="#1F2937" strokeWidth="1" />
            {/* Main Photoreceptor Lens (Large Eye) */}
            <circle cx="50" cy="29" r="4.5" fill="#111827" stroke="#1F2937" strokeWidth="1" />
            <circle cx="48.5" cy="27.5" r="1.2" fill="#FFFFFF" />
            {/* Secondary Lens (Small Eye) */}
            <circle cx="59" cy="33" r="2.2" fill="#3B82F6" stroke="#1F2937" strokeWidth="0.8" />
          </g>

          {/* Body - Rotating Sphere */}
          <g className="animate-[spin_4s_linear_infinite] origin-[50px_76px]">
            {/* Main sphere body */}
            <circle cx="50" cy="76" r="28" fill="#F9FAFB" stroke="#1F2937" strokeWidth="2.5" />
            
            {/* Orange circular plates */}
            <circle cx="50" cy="76" r="18" fill="none" stroke="#F97316" strokeWidth="3.5" strokeDasharray="14 8" />
            <circle cx="50" cy="76" r="11" fill="none" stroke="#9CA3AF" strokeWidth="1.5" />
            
            {/* Structural Panel lines */}
            <line x1="50" y1="56" x2="50" y2="96" stroke="#1F2937" strokeWidth="1" />
            <line x1="30" y1="76" x2="70" y2="76" stroke="#1F2937" strokeWidth="1" />
            
            {/* Center Orange Hub */}
            <circle cx="50" cy="76" r="4" fill="#F97316" stroke="#1F2937" strokeWidth="1" />
          </g>
          
          {/* Floor Shadow - Pulsing in size */}
          <ellipse 
            cx="50" 
            cy="110" 
            rx="24" 
            ry="4.5" 
            fill="#E5E7EB" 
            className="animate-[pulse_1.5s_infinite]" 
          />
        </svg>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-700 font-sans tracking-wide animate-pulse">
          {message}
        </p>
        <p className="text-[10px] text-slate-400 font-mono">
          SECTOR SECTOR-4 // PROTOCOLO ASTROMECÁNICO
        </p>
      </div>
    </div>
  );
}
