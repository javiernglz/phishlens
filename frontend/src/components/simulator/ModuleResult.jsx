import { useEffect, useState } from 'react'

const TIERS = [
  { min: 1.0,  label: '¡Sin fisuras!',   sub: 'No te engañaron ni una sola vez.',          color: '#22d3ee' },
  { min: 0.8,  label: '¡Muy bien!',       sub: 'Casi a prueba de phishing.',                color: '#34d399' },
  { min: 0.6,  label: 'Puedes mejorar.',  sub: 'Algunos escenarios te engañaron.',          color: '#fbbf24' },
  { min: 0,    label: 'Cuidado.',         sub: 'Los atacantes habrían ganado esta vez.',    color: '#f87171' },
]

function ScoreRing({ correct, total }) {
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
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={tier.color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-white leading-none">{correct}</span>
        <span className="text-xs text-slate-500 font-medium mt-0.5">/ {total}</span>
      </div>
    </div>
  )
}

export function ModuleResult({ moduleLabel, moduleScenarios, answers, onRetry, onNextModule }) {
  const correct = moduleScenarios.filter((s) => {
    const ans = answers[s.id]
    return ans && (ans === 'phishing') === (s.isPhishing !== false)
  }).length
  const total = moduleScenarios.length
  const ratio = total > 0 ? correct / total : 0
  const tier = TIERS.find((t) => ratio >= t.min) ?? TIERS[TIERS.length - 1]

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-900 p-8 overflow-y-auto">
      <div className="w-full max-w-sm">
        <p className="text-center text-xs text-slate-500 uppercase tracking-widest font-semibold mb-6">
          {moduleLabel} — Resultados
        </p>

        <ScoreRing correct={correct} total={total} />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black mb-1.5" style={{ color: tier.color }}>
            {tier.label}
          </h2>
          <p className="text-slate-400 text-sm">{tier.sub}</p>
        </div>

        {/* Scenario breakdown */}
        <div className="space-y-1.5 mb-8">
          {moduleScenarios.map((s) => {
            const ans = answers[s.id]
            const isCorrect = ans && (ans === 'phishing') === (s.isPhishing !== false)
            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isCorrect ? 'bg-emerald-950/40' : 'bg-rose-950/40'
                }`}
              >
                <span className={`text-sm font-bold flex-shrink-0 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <span className="flex-1 text-slate-300 text-sm truncate">{s.title}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${
                  s.isPhishing !== false ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {s.isPhishing !== false ? 'Phishing' : 'Legít.'}
                </span>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition-all"
          >
            ↺ Repetir
          </button>
          {onNextModule && (
            <button
              onClick={onNextModule}
              className="flex-1 py-2.5 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-300 text-sm font-semibold hover:bg-cyan-900 transition-all"
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
