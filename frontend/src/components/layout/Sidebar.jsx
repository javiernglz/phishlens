import { ChevronLeft, ChevronRight, Mail, MessageCircle, FolderOpen, RotateCcw, Moon, Sun } from 'lucide-react'
import { ScenarioCard } from '../ui/ScenarioCard'
import { WordMark } from '../ui/PhishLensLogo'
import { ALL_SCENARIOS, MODULES } from '../../data'

const MODULE_ICONS = { email: Mail, sms: MessageCircle, file: FolderOpen }

function ScoreBadge({ correct, answered, total, dark }) {
  if (answered === 0) return null
  const perfect = correct === total && answered === total
  return (
    <span
      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${
        perfect
          ? dark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
          : dark ? 'bg-slate-800 text-slate-400'      : 'bg-slate-100 text-slate-500'
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
  dark = true,
  onToggleDark,
  activeModule, activeScenarioId, xrayActive, sidebarOpen,
  answers, getModuleScore,
  onModuleSelect, onScenarioSelect, onToggleSidebar, onToggleXray, onResetAnswers, onHome,
}) {
  const moduleScenarios = ALL_SCENARIOS.filter((s) => s.module === activeModule)

  const bg     = dark ? 'bg-[#0d1117]' : 'bg-white'
  const border  = dark ? 'border-slate-800' : 'border-slate-200'
  const iconBtn = dark
    ? 'text-slate-600 hover:text-slate-300 hover:bg-slate-800'
    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'

  if (!sidebarOpen) {
    return (
      <div className={`w-14 flex-shrink-0 ${bg} border-r ${border} flex flex-col items-center py-3 gap-2`}>
        <button
          onClick={onToggleSidebar}
          title="Abrir panel"
          className={`p-2 rounded-md transition-colors ${iconBtn}`}
        >
          <ChevronRight size={16} />
        </button>

        <div className={`w-px h-4 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`} />

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
                  ? dark ? 'text-indigo-400 bg-indigo-950/50' : 'text-indigo-600 bg-indigo-50'
                  : dark
                  ? 'text-slate-600 hover:text-slate-400 hover:bg-slate-800/50'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={16} />
              {score.answered > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full text-[7px] font-bold flex items-center justify-center ${
                  dark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                }`}>
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
    <div className={`w-72 flex-shrink-0 ${bg} border-r ${border} flex flex-col`}>
      {/* Logo + collapse */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${border}`}>
        <button
          onClick={onHome}
          title="Volver al inicio"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <WordMark size={15} dark={dark} />
        </button>
        <div className="flex items-center gap-1">
          {onToggleDark && (
            <button
              onClick={onToggleDark}
              title={dark ? 'Modo claro' : 'Modo oscuro'}
              className={`p-1.5 rounded transition-colors ${iconBtn}`}
            >
              {dark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          )}
          <button
            onClick={onResetAnswers}
            title="Reiniciar puntuaciones"
            className={`p-1.5 rounded transition-colors ${iconBtn}`}
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={onToggleSidebar}
            title="Colapsar panel"
            className={`p-1.5 rounded transition-colors ${iconBtn}`}
          >
            <ChevronLeft size={15} />
          </button>
        </div>
      </div>

      {/* Module tabs with score badges */}
      <div className={`flex border-b ${border}`}>
        {MODULES.map((m) => {
          const Icon = MODULE_ICONS[m.id]
          const score = getModuleScore(m.id)
          return (
            <button
              key={m.id}
              onClick={() => onModuleSelect(m.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1.5 text-[10px] font-semibold tracking-wide transition-colors border-b-2 ${
                activeModule === m.id
                  ? 'text-indigo-600 border-indigo-600'
                  : dark
                  ? 'text-slate-600 border-transparent hover:text-slate-400 hover:border-slate-600'
                  : 'text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-300'
              }`}
            >
              <Icon size={14} />
              <span>{m.shortLabel}</span>
              <ScoreBadge {...score} dark={dark} />
            </button>
          )
        })}
      </div>

      {/* Scenario list */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {activeModule === 'sms' ? (() => {
          const sms = moduleScenarios.filter(s => s.content?.platform !== 'whatsapp')
          const wa  = moduleScenarios.filter(s => s.content?.platform === 'whatsapp')
          return (
            <>
              {sms.length > 0 && (
                <div className={`flex items-center gap-2 px-1 pt-1 pb-0.5`}>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${dark ? 'text-slate-600' : 'text-slate-400'}`}>SMS</span>
                  <div className={`flex-1 h-px ${dark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                </div>
              )}
              {sms.map(scenario => (
                <ScenarioCard key={scenario.id} scenario={scenario} isActive={scenario.id === activeScenarioId}
                  onClick={onScenarioSelect} answerStatus={getAnswerStatus(scenario, answers)} dark={dark} />
              ))}
              {wa.length > 0 && (
                <div className={`flex items-center gap-2 px-1 pt-3 pb-0.5`}>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${dark ? 'text-[#25d366]/70' : 'text-[#128c7e]'}`}>WhatsApp</span>
                  <div className={`flex-1 h-px ${dark ? 'bg-[#25d366]/20' : 'bg-[#25d366]/30'}`} />
                </div>
              )}
              {wa.map(scenario => (
                <ScenarioCard key={scenario.id} scenario={scenario} isActive={scenario.id === activeScenarioId}
                  onClick={onScenarioSelect} answerStatus={getAnswerStatus(scenario, answers)} dark={dark} />
              ))}
            </>
          )
        })() : moduleScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            isActive={scenario.id === activeScenarioId}
            onClick={onScenarioSelect}
            answerStatus={getAnswerStatus(scenario, answers)}
            dark={dark}
          />
        ))}
      </div>

      {/* Reveal button */}
      <div className={`p-3 border-t ${border}`}>
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
