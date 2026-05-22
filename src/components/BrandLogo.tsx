import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
  variant?: "logo-only" | "full";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  size = 40,
  variant = "logo-only"
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ height: size }}>
      <svg
        id="shaiealam-livestock-logo"
        width={size}
        height={size}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_4px_12px_rgba(13,148,136,0.25)] select-none"
      >
        {/* Subtle background glow & badge circular area */}
        <circle cx="64" cy="64" r="60" fill="#020617" stroke="#1e293b" strokeWidth="2" />
        
        {/* Inner concentric ring with fine dashed dasharray for modern premium feel */}
        <circle 
          cx="64" 
          cy="64" 
          r="54" 
          stroke="#0d9488" 
          strokeWidth="1" 
          strokeDasharray="4 3" 
          className="opacity-70"
        />

        {/* Cleaver Asset - Diagonal crossing from bottom-left to top-right */}
        <g id="cleaver-group" className="opacity-90">
          {/* Cleaver Handle */}
          <path
            d="M26 102 L38 90 L46 98 L34 110 Z"
            fill="url(#handleGradient)"
            stroke="#475569"
            strokeWidth="1.5"
          />
          {/* Handle rivets */}
          <circle cx="31" cy="103" r="1.5" fill="#94a3b8" />
          <circle cx="39" cy="95" r="1.5" fill="#94a3b8" />
          
          {/* Cleaver Safety Guard / Brass Bolster */}
          <path
            d="M44 92 L49 87 L45 83 L40 88 Z"
            fill="#0d9488"
          />

          {/* Cleaver Blade */}
          {/* Big heavy steel sheet rotated diagonally */}
          <path
            d="M47 85 L84 48 L104 68 L67 105 Z"
            fill="url(#bladeGradient)"
            stroke="#475569"
            strokeWidth="1.5"
          />
          {/* Cleaver Cutting Edge Highlight (Parallel line along the bottom slash) */}
          <path
            d="M49 87 L67 105"
            stroke="#0d9488"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          
          {/* Classic Cleaver Hanging Circle Hole */}
          <circle cx="94" cy="58" r="3.5" fill="#020617" stroke="#475569" strokeWidth="1" />
        </g>

        {/* Cow Silhouette, centered and floating in front of the cleaver */}
        <g id="cow-silhouette-group">
          {/* Cow Head Outer Glow / Shadow layer */}
          <path
            d="M36 44 C28 44 26 48 24 50 C22 52 23 55 26 55 C28 55 35 50 35 50 L38 58 L40 78 C41 85 45 92 52 94 L64 97 L76 94 C83 92 87 85 88 78 L90 58 L93 50 C93 50 100 55 102 55 C105 55 106 52 104 50 C102 48 100 44 92 44 C95 35 91 26 91 26 C91 26 82 32 78 35 C73 31 69 30 64 30 C59 30 55 31 50 35 C46 32 37 26 37 26 C37 26 33 35 36 44 Z"
            fill="#020617"
            className="opacity-60"
          />

          {/* Cow Head Body (Teal to Slate Teal gradient) */}
          <path
            d="M36 44 C28 44 26 48 24 50 C22 52 23 55 26 55 C28 55 35 50 35 50 L38 58 L40 78 C41 85 45 92 52 94 L64 97 L76 94 C83 92 87 85 88 78 L90 58 L93 50 C93 50 100 55 102 55 C105 55 106 52 104 50 C102 48 100 44 92 44 C95 35 91 26 91 26 C91 26 82 32 78 35 C73 31 69 30 64 30 C59 30 55 31 50 35 C46 32 37 26 37 26 C37 26 33 35 36 44 Z"
            fill="url(#cowGradient)"
            stroke="#0d9488"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Symmetrical Horns Highlight (Slate/silver geometric overlay) */}
          <path
            d="M37 26 C37 26 34 32 36 40 C38 34 40 32 46 31 Z"
            fill="#94a3b8"
          />
          <path
            d="M91 26 C91 26 94 32 92 40 C90 34 88 32 82 31 Z"
            fill="#94a3b8"
          />

          {/* Stylized Cow Nose/Muzzle - High Contrast Teal/Slate Shield */}
          <path
            d="M48 76 C48 71 52 69 64 69 C76 69 80 71 80 76 C80 82 74 88 64 88 C54 88 48 82 48 76 Z"
            fill="#0f172a"
            stroke="#0d9488"
            strokeWidth="1.5"
          />

          {/* Nostrils */}
          <circle cx="56" cy="78" r="2" fill="#0d9488" />
          <circle cx="72" cy="78" r="2" fill="#0d9488" />

          {/* Minimalist modern eye slits (Geometric tech vibe) */}
          <path
            d="M45 56 L52 58"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M83 56 L76 58"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          
          {/* forehead geometric decal (Teal star/diamond) */}
          <path
            d="M64 42 L67 48 L64 54 L61 48 Z"
            fill="#0d9488"
          />
        </g>

        {/* SVG Defs for gradients & filters */}
        <defs>
          {/* Cow Head Color Gradient: Dark Teal to Dark Slate */}
          <linearGradient id="cowGradient" x1="64" y1="26" x2="64" y2="97" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#115e59" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Cleaver Handle Wood/Composite: Charcoal and Slate */}
          <linearGradient id="handleGradient" x1="26" y1="102" x2="46" y2="98" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Cleaver Blade Metallic Gradient: Shimmering Silver to Steel slate */}
          <linearGradient id="bladeGradient" x1="47" y1="85" x2="104" y2="68" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="45%" stopColor="#475569" />
            <stop offset="55%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
      </svg>

      {variant === "full" && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-wider text-white">
              SHAIEALAM
            </span>
            <span className="text-teal-400 font-extrabold text-lg tracking-wide">
              LIVESTOCK
            </span>
            <span className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono tracking-widest px-1.5 py-0.5 rounded uppercase">
              ERP
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-slate-400 uppercase leading-none">
            Corporate Chain Management
          </span>
        </div>
      )}
    </div>
  );
};
