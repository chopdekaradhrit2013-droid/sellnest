import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function Logo({ className = "", size = "md", showWordmark = true }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 font-sans ${className}`}>
      {/* Custom crafted SVG logo: Nest + Storefront + Growth mark */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white shadow-sm ring-1 ring-purple-500/20`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          {/* Stylized nest curves supporting a pearl / brand dot */}
          <path
            d="M4 14.5C4 18.0899 7.58172 21 12 21C16.4183 21 20 18.0899 20 14.5C20 12.5 18.5 10 16 9"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M7 11.5C7.8 8.8 9.6 7 12 7C14.4 7 16.2 8.8 17 11.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="11.5" r="2.5" fill="currentColor" />
          <path
            d="M12 3V5"
            stroke="#FDE047"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white animate-pulse" />
      </div>

      {showWordmark && (
        <div className="flex items-baseline tracking-tight">
          <span className={`${textSizes[size]} font-bold text-charcoal-900 tracking-tight`}>
            Sell
          </span>
          <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 bg-clip-text text-transparent`}>
            Nest
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 ml-0.5 self-end mb-1" />
        </div>
      )}
    </div>
  );
}

