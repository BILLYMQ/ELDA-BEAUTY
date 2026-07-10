export default function PerfumeIllustration() {
  return (
    <svg
      viewBox="0 0 320 420"
      className="h-auto w-64 drop-shadow-2xl sm:w-80 lg:w-96"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bottle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E4C878" />
          <stop offset="55%" stopColor="#C9A24B" />
          <stop offset="100%" stopColor="#6B2E94" />
        </linearGradient>
        <linearGradient id="cap" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2E0F42" />
          <stop offset="100%" stopColor="#4B1D6B" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FBF8F3" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FBF8F3" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="160" cy="380" rx="110" ry="18" fill="#2E0F42" opacity="0.12" />

      <rect x="128" y="40" width="64" height="46" rx="10" fill="url(#cap)" />
      <rect x="146" y="18" width="28" height="30" rx="6" fill="url(#cap)" />

      <path
        d="M100 96 C100 86 108 78 118 78 H202 C212 78 220 86 220 96 V150 C246 176 258 214 258 260 V330 C258 352 240 368 218 368 H102 C80 368 62 352 62 330 V260 C62 214 74 176 100 150 Z"
        fill="url(#bottle)"
      />
      <path
        d="M100 96 C100 86 108 78 118 78 H202 C212 78 220 86 220 96 V150 C246 176 258 214 258 260 V330 C258 352 240 368 218 368 H102 C80 368 62 352 62 330 V260 C62 214 74 176 100 150 Z"
        fill="url(#glow)"
      />

      <rect x="86" y="210" width="148" height="86" rx="14" fill="#FBF8F3" opacity="0.92" />
      <text
        x="160"
        y="245"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="20"
        fontWeight="bold"
        fill="#4B1D6B"
      >
        ELDA
      </text>
      <text
        x="160"
        y="266"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="12"
        letterSpacing="3"
        fill="#C9A24B"
      >
        BEAUTY
      </text>
      <line x1="106" y1="278" x2="214" y2="278" stroke="#C9A24B" strokeWidth="1" />

      <circle cx="140" cy="130" r="3" fill="#FBF8F3" opacity="0.8" />
      <circle cx="180" cy="145" r="2" fill="#FBF8F3" opacity="0.7" />
    </svg>
  );
}
