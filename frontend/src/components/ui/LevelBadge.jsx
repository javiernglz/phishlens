const CONFIG = {
  easy:   { label: 'Fácil',   classes: 'bg-emerald-50 border-emerald-300 text-emerald-700' },
  medium: { label: 'Medio',   classes: 'bg-amber-50   border-amber-300   text-amber-700'   },
  hard:   { label: 'Difícil', classes: 'bg-rose-50    border-rose-300    text-rose-700'    },
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
