import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { SimulatorStage } from './components/simulator/SimulatorStage'
import { ModuleResult } from './components/simulator/ModuleResult'
import { useSimulator } from './hooks/useSimulator'
import { LandingPage } from './components/LandingPage'
import { HostRoom } from './pages/HostRoom'
import { PlayerJoin } from './pages/PlayerJoin'
import { PlayerRoom } from './pages/PlayerRoom'
import { DetectorPage } from './pages/DetectorPage'
import { MODULES } from './data'
import { generateRoomCode } from './lib/roomUtils'

function SoloApp() {
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [showingResults, setShowingResults] = useState(false)
  const [dark, setDark] = useState(false)
  const sim = useSimulator()
  const currentAnswer = sim.activeScenario ? sim.answers[sim.activeScenario.id] : undefined

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
    return (
      <LandingPage
        onStart={() => setStarted(true)}
        onHost={() => navigate('/host-setup')}
        onDetect={() => navigate('/detect')}
      />
    )
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
    <div className={`simulator-root flex ${dark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <Sidebar
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
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
            dark={dark}
            moduleLabel={currentModuleLabel}
            moduleScenarios={sim.moduleScenarios}
            answers={sim.answers}
            onRetry={() => { sim.resetModule(); setShowingResults(false) }}
            onNextModule={nextModule ? () => sim.selectModule(nextModule.id) : null}
          />
        ) : (
          <SimulatorStage
            dark={dark}
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SoloApp />} />
        <Route path="/host-setup" element={<HostSetupPage />} />
        <Route path="/host/:code" element={<HostRoom />} />
        <Route path="/join" element={<PlayerJoin />} />
        <Route path="/join/:code" element={<PlayerRoom />} />
        <Route path="/detect" element={<DetectorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

function HostSetupPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(`/host/${generateRoomCode()}`, { replace: true })
  }, [])

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
    </div>
  )
}
