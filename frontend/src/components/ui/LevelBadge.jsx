const CONFIG = {
  easy:   { label: 'Fácil',   classes: 'bg-emerald-950 border-emerald-700 text-emerald-400' },
  medium: { label: 'Medio',   classes: 'bg-orange-950  border-orange-700  text-orange-400'  },
  hard:   { label: 'Difícil', classes: 'bg-rose-950    border-rose-700    text-rose-400'    },
}

export function LevelBadge({ level }) {
  const cfg = CONFIG[level]
  if (!cfg) return null
  return (
    <span className={`inline-flex items-center border rounded text-[9px] font-bold tracking-wide px-1.5 py-0.5 flex-shrink-0 ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}
