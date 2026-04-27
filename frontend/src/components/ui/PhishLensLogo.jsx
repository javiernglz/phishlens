// Hook icon — standalone use (sidebar, player pages, etc.)
export function HookIcon({ size = 24, color = '#6366f1', strokeWidth = 2 }) {
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

// The hook shaped as the letter "i" — dot on top, hook curve at bottom
function HookI({ size, color }) {
  const w = size * 0.52
  const h = size
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 11 24"
      fill="none"
      style={{ display: 'inline-block', verticalAlign: 'text-bottom' }}
    >
      <circle cx="5" cy="2.4" r="2.1" fill={color} />
      <path
        d="M5 6 L5 15.5 C5 21.5 11.5 21.5 11.5 15.5 L10 14"
        stroke={color}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

// Wordmark: Ph[hook-i]shLens — the hook replaces the "i"
export function WordMark({ size = 18, dark = true, className = '' }) {
  const main   = dark ? '#f1f5f9' : '#0f172a'
  const indigo = '#6366f1'
  const style = {
    display: 'inline-flex',
    alignItems: 'flex-end',
    fontSize: size,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    userSelect: 'none',
  }
  return (
    <span className={className} style={style}>
      <span style={{ color: main }}>Ph</span>
      <HookI size={size} color={indigo} />
      <span style={{ color: main }}>sh</span>
      <span style={{ color: indigo, fontWeight: 300 }}>Lens</span>
    </span>
  )
}
