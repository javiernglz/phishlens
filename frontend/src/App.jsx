import { Sidebar } from './components/layout/Sidebar'
import { SimulatorStage } from './components/simulator/SimulatorStage'
import { useSimulator } from './hooks/useSimulator'

export default function App() {
  const sim = useSimulator()
  const currentAnswer = sim.activeScenario ? sim.answers[sim.activeScenario.id] : undefined

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
      />
      <main className="flex-1 overflow-hidden">
        <SimulatorStage
          scenario={sim.activeScenario}
          xrayActive={sim.xrayActive}
          activeHotspotId={sim.activeHotspotId}
          onHotspotClick={sim.setActiveHotspotId}
          answer={currentAnswer}
          onVote={sim.submitAnswer}
        />
      </main>
    </div>
  )
}
