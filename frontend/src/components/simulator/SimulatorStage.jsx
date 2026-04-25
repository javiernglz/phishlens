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

function VotingBar({ scenario, answer, onVote }) {
  const isAnswered = answer !== undefined
  const scenarioIsPhishing = scenario.isPhishing !== false
  const isCorrect = isAnswered && (answer === 'phishing') === scenarioIsPhishing

  if (isAnswered) {
    const msg = isCorrect && scenarioIsPhishing
      ? '¡Correcto! El público identificó el ataque.'
      : isCorrect && !scenarioIsPhishing
      ? '¡Correcto! El mensaje era legítimo.'
      : !isCorrect && scenarioIsPhishing
      ? '¡La audiencia cayó! Era phishing — usa X-Ray para analizarlo.'
      : '¡Falso positivo! Era un mensaje legítimo — usa X-Ray para ver por qué.'

    return (
      <div
        className={`flex-shrink-0 h-14 border-t flex items-center justify-center gap-3 px-6 transition-colors ${
          isCorrect
            ? 'bg-emerald-950/90 border-emerald-800'
            : 'bg-rose-950/90 border-rose-900'
        }`}
      >
        <span className="text-xl select-none">{isCorrect ? '✓' : '✗'}</span>
        <span className={`text-sm font-semibold ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
          {msg}
        </span>
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

export function SimulatorStage({ scenario, xrayActive, activeHotspotId, onHotspotClick, answer, onVote }) {
  const stageRef = useRef(null)
  const View = scenario ? VIEWS[scenario.module] : null

  return (
    <div className="flex flex-col h-full">
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
      {scenario && <VotingBar scenario={scenario} answer={answer} onVote={onVote} />}
    </div>
  )
}
