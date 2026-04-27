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

const LEVEL_LABELS = {
  easy:   'Fácil',
  medium: 'Medio',
  hard:   'Difícil',
}

const LEVEL_DARK = {
  easy:   'bg-emerald-950 text-emerald-400 border-emerald-800',
  medium: 'bg-amber-950 text-amber-400 border-amber-800',
  hard:   'bg-rose-950 text-rose-400 border-rose-800',
}

const LEVEL_LIGHT = {
  easy:   'bg-emerald-50 text-emerald-700 border-emerald-300',
  medium: 'bg-amber-50 text-amber-700 border-amber-300',
  hard:   'bg-rose-50 text-rose-700 border-rose-300',
}

const DOT_STYLES = {
  unanswered: 'bg-slate-300',
  correct:    'bg-emerald-500',
  incorrect:  'bg-rose-500',
}

const DOT_STYLES_DARK = {
  unanswered: 'bg-slate-700',
  correct:    'bg-emerald-500',
  incorrect:  'bg-rose-500',
}

function StageHeader({ scenario, moduleProgress, dark }) {
  const key = LEVEL_LABELS[scenario.level] ? scenario.level : 'easy'
  const levelLabel = LEVEL_LABELS[key]
  const levelClass = dark ? LEVEL_DARK[key] : LEVEL_LIGHT[key]
  const activeIndex = moduleProgress.findIndex((p) => p.isActive)
  const total = moduleProgress.length
  const dots = dark ? DOT_STYLES_DARK : DOT_STYLES

  return (
    <div className={`flex-shrink-0 h-10 border-b flex items-center justify-between px-4 gap-4 ${
      dark ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex-shrink-0 ${levelClass}`}>
          {levelLabel}
        </span>
        <span className={`text-xs truncate ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {scenario.title}
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1">
          {moduleProgress.map((p) => (
            <span
              key={p.id}
              className={`block rounded-full transition-all duration-200 ${
                p.isActive
                  ? 'w-3.5 h-2 bg-indigo-500'
                  : `w-2 h-2 ${dots[p.status]}`
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-medium tabular-nums ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          {activeIndex + 1}/{total}
        </span>
      </div>
    </div>
  )
}

function EmptyState({ dark }) {
  return (
    <div className={`h-full flex items-center justify-center ${dark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="text-center select-none">
        <div className="text-5xl mb-4">🎣</div>
        <p className={`text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          Selecciona un escenario para comenzar
        </p>
      </div>
    </div>
  )
}

function VotingBar({ scenario, answer, onVote, onNext, hasNext, isModuleComplete, onShowResults, dark }) {
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
            ? dark ? 'bg-emerald-950/90 border-emerald-800' : 'bg-emerald-50 border-emerald-200'
            : dark ? 'bg-rose-950/90 border-rose-900'       : 'bg-rose-50 border-rose-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl select-none">{isCorrect ? '✓' : '✗'}</span>
          <span className={`text-sm font-semibold ${
            isCorrect
              ? dark ? 'text-emerald-300' : 'text-emerald-700'
              : dark ? 'text-rose-300'    : 'text-rose-700'
          }`}>
            {msg}
          </span>
        </div>
        {isModuleComplete ? (
          <button
            onClick={onShowResults}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              dark
                ? 'bg-indigo-950 border-indigo-700 text-indigo-300 hover:bg-indigo-900'
                : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Ver resultados →
          </button>
        ) : hasNext ? (
          <button
            onClick={onNext}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              dark
                ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-400'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            Siguiente →
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div className={`flex-shrink-0 h-14 border-t flex items-center justify-center gap-3 px-6 ${
      dark ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <button
        onClick={() => onVote('legit')}
        className={`flex items-center gap-2 px-5 py-2 rounded-lg border text-sm font-bold transition-all ${
          dark
            ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300 hover:bg-emerald-800/70 hover:border-emerald-500'
            : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400'
        }`}
      >
        ✓ Legítimo
      </button>
      <button
        onClick={() => onVote('phishing')}
        className={`flex items-center gap-2 px-5 py-2 rounded-lg border text-sm font-bold transition-all ${
          dark
            ? 'bg-rose-900/50 border-rose-700 text-rose-300 hover:bg-rose-800/70 hover:border-rose-500'
            : 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 hover:border-rose-400'
        }`}
      >
        ⚠ Phishing
      </button>
    </div>
  )
}

export function SimulatorStage({ dark = true, scenario, xrayActive, activeHotspotId, onHotspotClick, answer, onVote, onNext, hasNext, isModuleComplete, onShowResults, moduleProgress }) {
  const stageRef = useRef(null)
  const View = scenario ? VIEWS[scenario.module] : null

  return (
    <div className="flex flex-col h-full">
      {scenario && moduleProgress?.length > 0 && (
        <StageHeader scenario={scenario} moduleProgress={moduleProgress} dark={dark} />
      )}

      <div ref={stageRef} className="flex-1 relative overflow-hidden">
        {View ? <View scenario={scenario} /> : <EmptyState dark={dark} />}

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

      {scenario && (
        <VotingBar
          dark={dark}
          scenario={scenario} answer={answer} onVote={onVote}
          onNext={onNext} hasNext={hasNext}
          isModuleComplete={isModuleComplete} onShowResults={onShowResults}
        />
      )}
    </div>
  )
}
