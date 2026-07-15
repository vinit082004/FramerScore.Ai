export function FramingGuide() {
  return (
    <svg
      viewBox="0 0 120 120"
      width={72}
      height={72}
      fill="none"
      className="text-muted-foreground/50"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="112" height="112" rx="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M60 4v10M60 106v10M4 60h10M106 60h10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="60" cy="48" r="20" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M30 100c0-18 13-28 30-28s30 10 30 28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
