import React from 'react';
import { cn } from '@/lib/utils';

export default function Logo({ className, showText = true, size = "md", vertical = false }) {
  const sizes = {
    sm: "h-6 w-12",
    md: "h-8 w-16",
    lg: "h-10 w-20",
    xl: "h-16 w-32"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl"
  };

  return (
    <div className={cn(
      "flex items-center gap-3", 
      vertical ? "flex-col text-center" : "flex-row",
      className
    )}>
      <div className={cn("relative flex items-center justify-center", sizes[size] || size)}>
        <svg
          viewBox="0 0 100 50"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" /> {/* Indigo-400 */}
              <stop offset="50%" stopColor="#c084fc" /> {/* Purple-400 */}
              <stop offset="100%" stopColor="#22d3ee" /> {/* Cyan-400 */}
            </linearGradient>
          </defs>
          
          {/* Infinity Loop - More accurate shape */}
          <path
            d="M30 10C18.9543 10 10 18.9543 10 30C10 41.0457 18.9543 50 30 50C36.03 50 41.44 47.33 45.14 43.14L54.86 31.86C58.56 27.67 63.97 25 70 25C81.0457 25 90 33.9543 90 45C90 56.0457 81.0457 65 70 65C63.97 65 58.56 62.33 54.86 58.14L45.14 46.86C41.44 42.67 36.03 40 30 40C18.9543 40 10 48.9543 10 60C10 71.0457 18.9543 80 30 80C41.0457 80 50 71.0457 50 60"
            stroke="url(#logo-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            transform="scale(0.6) translate(15, 0)"
          />
          
          {/* Re-drawing Infinity for better viewbox fit */}
          <path
            d="M30 25C30 16.7157 23.2843 10 15 10C6.71573 10 0 16.7157 0 25C0 33.2843 6.71573 40 15 40C20 40 24.5 37.5 27.5 33.5L37.5 21.5C40.5 17.5 45 15 50 15C58.2843 15 65 21.7157 65 30C65 38.2843 58.2843 45 50 45C45 45 40.5 42.5 37.5 38.5L27.5 26.5C24.5 22.5 20 20 15 20"
            stroke="url(#logo-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            transform="translate(17.5, 0)"
          />

          {/* Play Button Icon */}
          <path
            d="M28,25 L34,29 L28,33 Z"
            fill="white"
            transform="translate(5, 0)"
          />

          {/* Audio Wave Icon */}
          <g transform="translate(62, 23) scale(0.8)">
            <rect x="0" y="5" width="2" height="6" rx="1" fill="white" />
            <rect x="4" y="0" width="2" height="16" rx="1" fill="white" />
            <rect x="8" y="4" width="2" height="8" rx="1" fill="white" />
            <rect x="12" y="6" width="2" height="4" rx="1" fill="white" />
          </g>
        </svg>
      </div>
      
      {showText && (
        <span className={cn(
          "font-extrabold tracking-tighter text-slate-900 dark:text-white",
          textSizes[size] || size
        )}>
          vibe<span className="text-indigo-500 dark:text-indigo-400">loop</span>
        </span>
      )}
    </div>
  );
}
