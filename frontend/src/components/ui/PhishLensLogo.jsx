export function HookIcon({ size = 24, color = '#22d3ee', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 3 L11 16 C11 21 18 21 18 16 L16.5 14"
        stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}
