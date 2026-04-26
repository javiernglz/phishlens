import { ChevronLeft, ChevronRight, Mail, MessageCircle, FolderOpen, RotateCcw } from 'lucide-react'
import { ScenarioCard } from '../ui/ScenarioCard'
import { ALL_SCENARIOS, MODULES } from '../../data'

const MODULE_ICONS = { email: Mail, sms: MessageCircle, file: FolderOpen }

function ScoreBadge({ correct, answered, total }) {
  if (answered === 0) return null
  const allDone = answered === total
  const perfect = correct === total && allDone
  return (
    <span
      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${
        perfect
          ? 'bg-emerald-900 text-emerald-300'
          : 'bg-slate-800 text-slate-400'
      }`}
    >
      {correct}/{total}
    </span>
  )
}

function getAnswerStatus(scenario, answers) {
  const ans = answers[scenario.id]
  if (ans === undefined) return null
  const scenarioIsPhishing = scenario.isPhishing !== false
  return (ans === 'phishing') === scenarioIsPhishing ? 'correct' : 'incorrect'
}

export function Sidebar({
  activeModule, activeScenarioId, xrayActive, sidebarOpen,
  answers, getModuleScore,
  onModuleSelect, onScenarioSelect, onToggleSidebar, onToggleXray, onResetAnswers, onHome,
}) {
  const moduleScenarios = ALL_SCENARIOS.filter((s) => s.module === activeModule)

  if (!sidebarOpen) {
    return (
      <div className="w-14 flex-shrink-0 bg-[#0d1117] border-r border-slate-800 flex flex-col items-center py-3 gap-2">
        <button
          onClick={onToggleSidebar}
          title="Abrir panel"
          className="p-2 rounded-md hover:bg-slate-800 text-slate-500 hover:text-cyan-400 transition-colors"
        >
          <ChevronRight size={16} />
        </button>

        <div className="w-px h-4 bg-slate-800" />

        {MODULES.map((m) => {
          const Icon = MODULE_ICONS[m.id]
          const score = getModuleScore(m.id)
          return (
            <button
              key={m.id}
              onClick={() => onModuleSelect(m.id)}
              title={`${m.label} — ${score.correct}/${score.total}`}
              className={`p-2 rounded-md transition-colors relative ${
                activeModule === m.id
                  ? 'text-cyan-400 bg-cyan-950/50'
                  : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={16} />
              {score.answered > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-900 text-emerald-300 text-[7px] font-bold flex items-center justify-center">
                  {score.correct}
                </span>
              )}
            </button>
          )
        })}

        <button
          onClick={onToggleXray}
          title="Revelar X-Ray"
          className={`mt-auto w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
            xrayActive
              ? 'bg-red-950 border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.5)]'
              : 'bg-red-950/30 border-red-900 hover:border-red-700'
          }`}
        >
          <span className="text-[8px] font-black text-red-400 tracking-wider">XR</span>
        </button>
      </div>
    )
  }

  return (
    <div className="w-72 flex-shrink-0 bg-[#0d1117] border-r border-slate-800 flex flex-col">
      {/* Logo + collapse */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
        <button
          onClick={onHome}
          title="Volver al inicio"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <div className="w-6 h-6 rounded bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-[9px] font-black text-cyan-400">PL</span>
          </div>
          <span className="text-sm font-bold text-slate-200 tracking-tight">PhishLens</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={onResetAnswers}
            title="Reiniciar puntuaciones"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-600 hover:text-slate-300 transition-colors"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={onToggleSidebar}
            title="Colapsar panel"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-600 hover:text-slate-300 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
        </div>
      </div>

      {/* Module tabs with score badges */}
      <div className="flex border-b border-slate-800/60">
        {MODULES.map((m) => {
          const Icon = MODULE_ICONS[m.id]
          const score = getModuleScore(m.id)
          return (
            <button
              key={m.id}
              onClick={() => onModuleSelect(m.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1.5 text-[10px] font-semibold tracking-wide transition-colors border-b-2 ${
                activeModule === m.id
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-slate-600 border-transparent hover:text-slate-400 hover:border-slate-600'
              }`}
            >
              <Icon size={14} />
              <span>{m.shortLabel}</span>
              <ScoreBadge {...score} />
            </button>
          )
        })}
      </div>

      {/* Scenario list */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {moduleScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            isActive={scenario.id === activeScenarioId}
            onClick={onScenarioSelect}
            answerStatus={getAnswerStatus(scenario, answers)}
          />
        ))}
      </div>

      {/* Reveal button */}
      <div className="p-3 border-t border-slate-800/60">
        <button
          onClick={onToggleXray}
          className={`w-full py-2.5 rounded-lg border text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
            xrayActive
              ? 'bg-red-950 border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
              : 'bg-red-950/20 border-red-900 text-red-600 hover:bg-red-950/50 hover:border-red-700 hover:text-red-400'
          }`}
        >
          {xrayActive ? '✕  Ocultar X-Ray' : '⬡  Revelar X-Ray'}
        </button>
      </div>
    </div>
  )
}
