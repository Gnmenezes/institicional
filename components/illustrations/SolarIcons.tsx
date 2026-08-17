export function SunPanelIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="33" cy="13" r="6" fill="#ff6a1a" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="33"
          y1="13"
          x2="33"
          y2="4"
          stroke="#ff6a1a"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${angle} 33 13)`}
        />
      ))}
      <g transform="rotate(-10 18 30)">
        <rect x="5" y="20" width="26" height="20" rx="2" fill="#353693" />
        <line x1="5" y1="27" x2="31" y2="27" stroke="#eef0fb" strokeWidth="1.5" />
        <line x1="5" y1="33" x2="31" y2="33" stroke="#eef0fb" strokeWidth="1.5" />
        <line x1="14.3" y1="20" x2="14.3" y2="40" stroke="#eef0fb" strokeWidth="1.5" />
        <line x1="23.6" y1="20" x2="23.6" y2="40" stroke="#eef0fb" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function BatteryIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="14" width="32" height="20" rx="4" stroke="#353693" strokeWidth="3" />
      <rect x="39" y="20" width="4" height="8" rx="1.5" fill="#353693" />
      <path d="M25 18 16 25.5h5.5L20 30l9-8h-5.5L25 18Z" fill="#ff6a1a" />
    </svg>
  );
}

export function HomeUsageIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M8 22 22 10l14 12" stroke="#353693" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 20v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V20" stroke="#353693" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="35" cy="33" r="10" fill="#fff1e8" />
      <path d="M36.5 27 30 34.5h4L32 41l7.5-8h-4l1-6Z" fill="#ff6a1a" />
    </svg>
  );
}
