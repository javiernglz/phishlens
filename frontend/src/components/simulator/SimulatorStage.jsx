import { useRef } from 'react'
import { EmailView } from './EmailView'
import { SmsView } from './SmsView'
import { FileView } from './FileView'
import { XRayOverlay } from '../xray/XRayOverlay'

const VIEWS = {
  email: EmailView,
  sms: SmsView,
  file: FileView,
}

const LEVEL_STYLES = {
  easy:   { label: 'Fácil',  className: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
  medium: { label: 'Medio',  className: 'bg-amber-950 text-amber-400 border-amber-800' },
  hard:   { label: 'Difícil', className: 'bg-rose-950 text-rose-400 border-rose-800' },
}

const DOT_STYLES = {
  unanswered: 'bg-slate-700',
  correct:    'bg-emerald-500',
  incorrect:  'bg-rose-500',
}

function StageHeader({ scenario, moduleProgress }) {
  const level = LEVEL_STYLES[scenario.level] ?? LEVEL_STYLES.easy
  const activeIndex = moduleProgress.findIndex((p) => p.isActive)
  const total = moduleProgress.length

  return (
    <div className="flex-shrink-0 h-10 bg-[#0d1117] border-b border-slate-800 flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex-shrink-0 ${level.className}`}>
          {level.label}
        </span>
        <span className="text-slate-400 text-xs truncate">{scenario.title}</span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1">
          {moduleProgress.map((p) => (
            <span
              key={p.id}
              className={`block rounded-full transition-all duration-200 ${
                p.isActive
                  ? 'w-3.5 h-2 bg-cyan-400'
                  : `w-2 h-2 ${DOT_STYLES[p.status]}`
              }`}
            />
          ))}
        </div>
        <span className="text-slate-500 text-xs font-medium tabular-nums">
          {activeIndex + 1}/{total}
        </span>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center bg-slate-900">
      <div className="text-center select-none">
        <div className="text-5xl mb-4">🎣</div>
        <p className="text-slate-500 text-sm">Selecciona un escenario para comenzar</p>
      </div>
    </div>
  )
}

function VotingBar({ scenario, answer, onVote, onNext, hasNext, isModuleComplete, onShowResults }) {
  const isAnswered = answer !== undefined
  const scenarioIsPhishing = scenario.isPhishing !== false
  const isCorrect = isAnswered && (answer === 'phishing') === scenarioIsPhishing

  if (isAnswered) {
    const msg = isCorrect && scenarioIsPhishing
      ? '¡Correcto! Lo detectaste — era phishing.'
      : isCorrect && !scenarioIsPhishing
      ? '¡Correcto! Lo detectaste — era un mensaje legítimo.'
      : !isCorrect && scenarioIsPhishing
      ? '¡Caíste en la trampa! Era phishing — usa X-Ray para analizarlo.'
      : '¡Falso positivo! Era legítimo — usa X-Ray para ver qué te confundió.'

    return (
      <div
        className={`flex-shrink-0 min-h-14 border-t flex items-center justify-between gap-3 px-6 py-2 transition-colors ${
          isCorrect
            ? 'bg-emerald-950/90 border-emerald-800'
            : 'bg-rose-950/90 border-rose-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl select-none">{isCorrect ? '✓' : '✗'}</span>
          <span className={`text-sm font-semibold ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
            {msg}
          </span>
        </div>
        {isModuleComplete ? (
          <button
            onClick={onShowResults}
            className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs font-bold hover:bg-cyan-900 transition-all"
          >
            Ver resultados →
          </button>
        ) : hasNext ? (
          <button
            onClick={onNext}
            className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-xs font-bold hover:bg-slate-700 hover:border-slate-400 transition-all"
          >
            Siguiente →
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex-shrink-0 h-14 bg-[#0d1117] border-t border-slate-800 flex items-center justify-center gap-3 px-6">
      <button
        onClick={() => onVote('legit')}
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-900/50 border border-emerald-700 text-emerald-300 text-sm font-bold hover:bg-emerald-800/70 hover:border-emerald-500 transition-all"
      >
        ✓ Legítimo
      </button>
      <button
        onClick={() => onVote('phishing')}
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-rose-900/50 border border-rose-700 text-rose-300 text-sm font-bold hover:bg-rose-800/70 hover:border-rose-500 transition-all"
      >
        ⚠ Phishing
      </button>
    </div>
  )
}

export function SimulatorStage({ scenario, xrayActive, activeHotspotId, onHotspotClick, answer, onVote, onNext, hasNext, isModuleComplete, onShowResults, moduleProgress }) {
  const stageRef = useRef(null)
  const View = scenario ? VIEWS[scenario.module] : null

  return (
    <div className="flex flex-col h-full">
      {scenario && moduleProgress?.length > 0 && (
        <StageHeader scenario={scenario} moduleProgress={moduleProgress} />
      )}

      {/* Simulator view — stageRef here so X-Ray only covers this area */}
      <div ref={stageRef} className="flex-1 relative overflow-hidden">
        {View ? <View scenario={scenario} /> : <EmptyState />}

        {xrayActive && scenario && (
          <XRayOverlay
            key={scenario.id}
            stageRef={stageRef}
            scenario={scenario}
            activeHotspotId={activeHotspotId}
            onHotspotClick={onHotspotClick}
          />
        )}
      </div>

      {/* Voting bar — outside stageRef, never covered by X-Ray */}
      {scenario && (
        <VotingBar
          scenario={scenario} answer={answer} onVote={onVote}
          onNext={onNext} hasNext={hasNext}
          isModuleComplete={isModuleComplete} onShowResults={onShowResults}
        />
      )}
    </div>
  )
}
