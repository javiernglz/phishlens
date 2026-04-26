export function HookIcon({ size = 24, color = '#22d3ee', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="6" r="1.5" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M12 8 L12 15 C12 19.5 16.5 19.5 16.5 15 L15.5 13.5"
        stroke={color} strokeWidth={strokeWidth + 0.2}
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}
