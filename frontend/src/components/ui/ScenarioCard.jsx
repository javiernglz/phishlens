import { LevelBadge } from './LevelBadge'

export function ScenarioCard({ scenario, isActive, onClick, answerStatus, dark = true }) {
  return (
    <button
      onClick={() => onClick(scenario.id)}
      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-150 ${
        isActive
          ? dark
            ? 'bg-cyan-950/60 border-cyan-500/60 shadow-[0_0_12px_rgba(34,211,238,0.12)]'
            : 'bg-cyan-50 border-cyan-300 shadow-[0_0_8px_rgba(8,145,178,0.10)]'
          : dark
          ? 'bg-transparent border-transparent hover:bg-white/5 hover:border-slate-700/60'
          : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {answerStatus === 'correct' && (
            <span className="text-emerald-500 text-xs font-bold flex-shrink-0">✓</span>
          )}
          {answerStatus === 'incorrect' && (
            <span className="text-rose-500 text-xs font-bold flex-shrink-0">✗</span>
          )}
          <span className={`text-xs font-semibold leading-tight truncate ${
            isActive
              ? dark ? 'text-cyan-100' : 'text-cyan-800'
              : dark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            {scenario.title}
          </span>
        </div>
        <LevelBadge level={scenario.level} />
      </div>
      <p className={`text-[10px] mt-0.5 leading-snug ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
        {scenario.description}
      </p>
    </button>
  )
}
