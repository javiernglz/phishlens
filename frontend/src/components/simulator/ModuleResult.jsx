import { useEffect, useState } from 'react'

const TIERS = [
  { min: 1.0,  label: '¡Sin fisuras!',   sub: 'No te engañaron ni una sola vez.',          color: '#22d3ee' },
  { min: 0.8,  label: '¡Muy bien!',       sub: 'Casi a prueba de phishing.',                color: '#34d399' },
  { min: 0.6,  label: 'Puedes mejorar.',  sub: 'Algunos escenarios te engañaron.',          color: '#fbbf24' },
  { min: 0,    label: 'Cuidado.',         sub: 'Los atacantes habrían ganado esta vez.',    color: '#f87171' },
]

function ScoreRing({ correct, total, dark }) {
  const ratio = total > 0 ? correct / total : 0
  const tier = TIERS.find((t) => ratio >= t.min) ?? TIERS[TIERS.length - 1]
  const r = 52
  const circ = 2 * Math.PI * r
  const [offset, setOffset] = useState(circ)

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ * (1 - ratio)), 80)
    return () => clearTimeout(t)
  }, [circ, ratio])

  return (
    <div className="relative w-36 h-36 mx-auto mb-7">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke={dark ? '#1e293b' : '#e2e8f0'} strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={tier.color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-black leading-none ${dark ? 'text-white' : 'text-slate-900'}`}>
          {correct}
        </span>
        <span className={`text-xs font-medium mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          / {total}
        </span>
      </div>
    </div>
  )
}

export function ModuleResult({ dark = true, moduleLabel, moduleScenarios, answers, onRetry, onNextModule }) {
  const correct = moduleScenarios.filter((s) => {
    const ans = answers[s.id]
    return ans && (ans === 'phishing') === (s.isPhishing !== false)
  }).length
  const total = moduleScenarios.length
  const ratio = total > 0 ? correct / total : 0
  const tier = TIERS.find((t) => ratio >= t.min) ?? TIERS[TIERS.length - 1]

  return (
    <div className={`h-full flex flex-col items-center justify-center p-8 overflow-y-auto ${
      dark ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      <div className="w-full max-w-sm">
        <p className={`text-center text-xs uppercase tracking-widest font-semibold mb-6 ${
          dark ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {moduleLabel} — Resultados
        </p>

        <ScoreRing correct={correct} total={total} dark={dark} />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black mb-1.5" style={{ color: tier.color }}>
            {tier.label}
          </h2>
          <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{tier.sub}</p>
        </div>

        <div className="space-y-1.5 mb-8">
          {moduleScenarios.map((s) => {
            const ans = answers[s.id]
            const isCorrect = ans && (ans === 'phishing') === (s.isPhishing !== false)
            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isCorrect
                    ? dark ? 'bg-emerald-950/40' : 'bg-emerald-50'
                    : dark ? 'bg-rose-950/40'    : 'bg-rose-50'
                }`}
              >
                <span className={`text-sm font-bold flex-shrink-0 ${isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <span className={`flex-1 text-sm truncate ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {s.title}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${
                  s.isPhishing !== false ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {s.isPhishing !== false ? 'Phishing' : 'Legít.'}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
              dark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            ↺ Repetir
          </button>
          {onNextModule && (
            <button
              onClick={onNextModule}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                dark
                  ? 'bg-cyan-950 border-cyan-700 text-cyan-300 hover:bg-cyan-900'
                  : 'bg-cyan-600 border-cyan-600 text-white hover:bg-cyan-700'
              }`}
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
