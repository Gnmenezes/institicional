export default function HybridSystemIllustration({
  className = "w-full h-auto",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 480 300" fill="none" className={className} aria-hidden="true">
      {/* sun */}
      <circle cx="60" cy="55" r="26" fill="#fff1e8" />
      <circle cx="60" cy="55" r="17" fill="#ff6a1a" />
      <g className="animate-sun-rays" style={{ transformOrigin: "60px 55px" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="60"
            y1="55"
            x2="60"
            y2="21"
            stroke="#ff6a1a"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 60 55)`}
          />
        ))}
      </g>

      {/* ground */}
      <line x1="20" y1="290" x2="460" y2="290" stroke="#353693" strokeOpacity="0.15" strokeWidth="2" />

      {/* house */}
      <polygon points="165,160 270,80 375,160" fill="#353693" />
      <rect x="180" y="160" width="180" height="120" fill="white" stroke="#353693" strokeWidth="4" />
      <rect x="245" y="225" width="40" height="55" rx="2" fill="#353693" />
      <rect x="300" y="185" width="35" height="35" rx="2" fill="#fff1e8" stroke="#353693" strokeWidth="3" />
      <line x1="317.5" y1="185" x2="317.5" y2="220" stroke="#353693" strokeWidth="2" />
      <line x1="300" y1="202.5" x2="335" y2="202.5" stroke="#353693" strokeWidth="2" />

      {/* solar panel array on the roof */}
      <g transform="translate(300 95) rotate(37)">
        <rect x="-40" y="-18" width="90" height="45" rx="2" fill="#1f2059" stroke="#ff6a1a" strokeWidth="1.5" />
        <line x1="-10" y1="-18" x2="-10" y2="27" stroke="#ff6a1a" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="20" y1="-18" x2="20" y2="27" stroke="#ff6a1a" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="-40" y1="4.5" x2="50" y2="4.5" stroke="#ff6a1a" strokeWidth="1" strokeOpacity="0.6" />
        <rect
          className="animate-panel-shine"
          x="-40"
          y="-18"
          width="90"
          height="45"
          rx="2"
          fill="#ffa15c"
        />
      </g>

      {/* battery pack */}
      <rect x="60" y="190" width="50" height="80" rx="8" fill="white" stroke="#353693" strokeWidth="4" />
      <rect x="64" y="196" width="42" height="14" rx="4" fill="#353693" />
      <path
        className="animate-battery-bolt"
        d="M92 205 78 231h9l-5 24 24-30h-9l5-20Z"
        fill="#ff6a1a"
      />
    </svg>
  );
}
