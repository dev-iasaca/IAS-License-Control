export default function LoginIllustration() {
  return (
    <svg viewBox="0 0 500 400" className="w-full max-w-md" aria-hidden="true">
      <defs>
        <linearGradient id="ill-arrow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>

      <rect x="40" y="40" width="420" height="280" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeDasharray="5 5" />

      <g fill="#e5e7eb">
        <rect x="80" y="230" width="28" height="70" rx="2" />
        <rect x="120" y="200" width="28" height="100" rx="2" />
        <rect x="160" y="170" width="28" height="130" rx="2" />
        <rect x="200" y="220" width="28" height="80" rx="2" />
        <rect x="240" y="160" width="28" height="140" rx="2" />
        <rect x="280" y="120" width="28" height="180" rx="2" />
        <rect x="320" y="90" width="28" height="210" rx="2" />
      </g>

      <path d="M 90 285 Q 230 240 400 85" stroke="url(#ill-arrow)" strokeWidth="9" fill="none" strokeLinecap="round" />
      <polygon points="388,65 420,82 395,105" fill="#0d9488" />

      <g>
        <circle cx="260" cy="140" r="28" fill="none" stroke="#cbd5e1" strokeWidth="3" />
        <circle cx="260" cy="140" r="16" fill="none" stroke="#cbd5e1" strokeWidth="3" />
        <circle cx="260" cy="140" r="5" fill="#ef4444" />
      </g>

      <g fill="#f3f4f6">
        <ellipse cx="370" cy="120" rx="22" ry="10" />
        <ellipse cx="388" cy="114" rx="14" ry="9" />
      </g>

      <g transform="translate(85 298)">
        <circle cx="20" cy="8" r="10" fill="#1f3a5c" />
        <rect x="6" y="20" width="28" height="44" rx="5" fill="#1f3a5c" />
        <rect x="6" y="62" width="12" height="30" rx="3" fill="#d9a77a" />
        <rect x="22" y="62" width="12" height="30" rx="3" fill="#d9a77a" />
      </g>

      <g transform="translate(210 308)">
        <circle cx="18" cy="8" r="10" fill="#2f6f9f" />
        <rect x="3" y="20" width="30" height="46" rx="5" fill="#2f6f9f" />
        <rect x="4" y="64" width="12" height="26" rx="3" fill="#fbcfe8" />
        <rect x="20" y="64" width="12" height="26" rx="3" fill="#fbcfe8" />
      </g>

      <g transform="translate(320 298)">
        <circle cx="18" cy="8" r="10" fill="#1f3a5c" />
        <rect x="4" y="20" width="28" height="42" rx="5" fill="#1f3a5c" />
        <rect x="4" y="60" width="12" height="30" rx="3" fill="#d9a77a" />
        <rect x="20" y="60" width="12" height="30" rx="3" fill="#d9a77a" />
      </g>
    </svg>
  );
}
