import { useState, useEffect } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { SimulatorStage } from './components/simulator/SimulatorStage'
import { useSimulator } from './hooks/useSimulator'
import { LandingPage } from './components/LandingPage'

export default function App() {
  const [started, setStarted] = useState(false)
  const sim = useSimulator()
  const currentAnswer = sim.activeScenario ? sim.answers[sim.activeScenario.id] : undefined

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
        onScenarioSelect={sim.selectScenario}
        onToggleSidebar={sim.toggleSidebar}
        onToggleXray={sim.toggleXray}
        onResetAnswers={sim.resetAnswers}
        onHome={() => setStarted(false)}
      />
      <main className="flex-1 overflow-hidden">
        <SimulatorStage
          scenario={sim.activeScenario}
          xrayActive={sim.xrayActive}
          activeHotspotId={sim.activeHotspotId}
          onHotspotClick={sim.setActiveHotspotId}
          answer={currentAnswer}
          onVote={sim.submitAnswer}
          onNext={sim.goNext}
          hasNext={!!sim.nextScenarioId}
        />
      </main>
    </div>
  )
}
