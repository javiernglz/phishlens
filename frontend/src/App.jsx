import { useState, useEffect } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { SimulatorStage } from './components/simulator/SimulatorStage'
import { ModuleResult } from './components/simulator/ModuleResult'
import { useSimulator } from './hooks/useSimulator'
import { LandingPage } from './components/LandingPage'
import { MODULES } from './data'

export default function App() {
  const [started, setStarted] = useState(false)
  const [showingResults, setShowingResults] = useState(false)
  const sim = useSimulator()
  const currentAnswer = sim.activeScenario ? sim.answers[sim.activeScenario.id] : undefined

  // Reset results screen when switching modules
  useEffect(() => { setShowingResults(false) }, [sim.activeModule])

  useEffect(() => {
    if (!started) return
    function handleKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight') sim.goNext()
      if (e.key === 'ArrowLeft') sim.goPrev()
      if (e.key === 'x' || e.key === 'X') sim.toggleXray()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [started, sim.goNext, sim.goPrev, sim.toggleXray])

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />
  }

  const currentModuleIndex = MODULES.findIndex((m) => m.id === sim.activeModule)
  const nextModule = MODULES[currentModuleIndex + 1] ?? null
  const currentModuleLabel = MODULES[currentModuleIndex]?.label ?? ''

  const moduleProgress = sim.moduleScenarios.map((s) => {
    const ans = sim.answers[s.id]
    const status = ans === undefined ? 'unanswered'
      : (ans === 'phishing') === (s.isPhishing !== false) ? 'correct' : 'incorrect'
    return { id: s.id, isActive: s.id === sim.activeScenarioId, status, level: s.level }
  })

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar
        activeModule={sim.activeModule}
        activeScenarioId={sim.activeScenarioId}
        xrayActive={sim.xrayActive}
        sidebarOpen={sim.sidebarOpen}
        answers={sim.answers}
        getModuleScore={sim.getModuleScore}
        onModuleSelect={sim.selectModule}
        onScenarioSelect={(id) => { setShowingResults(false); sim.selectScenario(id) }}
        onToggleSidebar={sim.toggleSidebar}
        onToggleXray={sim.toggleXray}
        onResetAnswers={sim.resetAnswers}
        onHome={() => setStarted(false)}
      />
      <main className="flex-1 overflow-hidden">
        {showingResults ? (
          <ModuleResult
            moduleLabel={currentModuleLabel}
            moduleScenarios={sim.moduleScenarios}
            answers={sim.answers}
            onRetry={() => { sim.resetModule(); setShowingResults(false) }}
            onNextModule={nextModule ? () => sim.selectModule(nextModule.id) : null}
          />
        ) : (
          <SimulatorStage
            scenario={sim.activeScenario}
            xrayActive={sim.xrayActive}
            activeHotspotId={sim.activeHotspotId}
            onHotspotClick={sim.setActiveHotspotId}
            answer={currentAnswer}
            onVote={sim.submitAnswer}
            onNext={sim.goNext}
            hasNext={!!sim.nextScenarioId}
            isModuleComplete={sim.isModuleComplete}
            onShowResults={() => setShowingResults(true)}
            moduleProgress={moduleProgress}
          />
        )}
      </main>
    </div>
  )
}
