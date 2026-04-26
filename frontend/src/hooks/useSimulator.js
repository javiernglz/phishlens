import { useState, useCallback } from 'react'
import { ALL_SCENARIOS } from '../data'

const INITIAL_MODULE = 'email'
const initialScenario = ALL_SCENARIOS.find((s) => s.module === INITIAL_MODULE)

export function useSimulator() {
  const [activeModule, setActiveModule] = useState(INITIAL_MODULE)
  const [activeScenarioId, setActiveScenarioId] = useState(initialScenario?.id ?? null)
  const [xrayActive, setXrayActive] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeHotspotId, setActiveHotspotId] = useState(null)
  const [answers, setAnswers] = useState({})

  const activeScenario = ALL_SCENARIOS.find((s) => s.id === activeScenarioId) ?? null

  const moduleScenarios = ALL_SCENARIOS.filter((s) => s.module === activeModule)
  const currentIndex = moduleScenarios.findIndex((s) => s.id === activeScenarioId)
  const nextScenarioId = currentIndex >= 0 && currentIndex < moduleScenarios.length - 1
    ? moduleScenarios[currentIndex + 1].id
    : null
  const prevScenarioId = currentIndex > 0 ? moduleScenarios[currentIndex - 1].id : null
  const isModuleComplete = moduleScenarios.length > 0 && moduleScenarios.every((s) => answers[s.id] !== undefined)

  const selectScenario = useCallback((id) => {
    setActiveScenarioId(id)
    setXrayActive(false)
    setActiveHotspotId(null)
  }, [])

  const selectModule = useCallback((moduleId) => {
    setActiveModule(moduleId)
    setXrayActive(false)
    setActiveHotspotId(null)
    const first = ALL_SCENARIOS.find((s) => s.module === moduleId)
    if (first) setActiveScenarioId(first.id)
  }, [])

  const goNext = useCallback(() => {
    if (nextScenarioId) selectScenario(nextScenarioId)
  }, [nextScenarioId, selectScenario])

  const goPrev = useCallback(() => {
    if (prevScenarioId) selectScenario(prevScenarioId)
  }, [prevScenarioId, selectScenario])

  const toggleXray = useCallback(() => {
    setXrayActive((prev) => !prev)
    setActiveHotspotId(null)
  }, [])

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), [])

  const submitAnswer = useCallback((answer) => {
    if (answers[activeScenarioId] !== undefined) return
    setAnswers((prev) => ({ ...prev, [activeScenarioId]: answer }))
    setXrayActive(true)
    setActiveHotspotId(null)
  }, [activeScenarioId, answers])

  const resetAnswers = useCallback(() => {
    setAnswers({})
    setXrayActive(false)
    setActiveHotspotId(null)
  }, [])

  const resetModule = useCallback(() => {
    setAnswers((prev) => {
      const next = { ...prev }
      moduleScenarios.forEach((s) => delete next[s.id])
      return next
    })
    setXrayActive(false)
    setActiveHotspotId(null)
    const first = moduleScenarios[0]
    if (first) setActiveScenarioId(first.id)
  }, [moduleScenarios])

  const getModuleScore = useCallback((moduleId) => {
    const scenarios = ALL_SCENARIOS.filter((s) => s.module === moduleId)
    let correct = 0
    let answered = 0
    for (const s of scenarios) {
      const ans = answers[s.id]
      if (ans === undefined) continue
      answered++
      const scenarioIsPhishing = s.isPhishing !== false
      if ((ans === 'phishing') === scenarioIsPhishing) correct++
    }
    return { correct, answered, total: scenarios.length }
  }, [answers])

  return {
    activeModule,
    activeScenario,
    activeScenarioId,
    xrayActive,
    sidebarOpen,
    activeHotspotId,
    answers,
    nextScenarioId,
    prevScenarioId,
    selectScenario,
    selectModule,
    toggleXray,
    toggleSidebar,
    setActiveHotspotId,
    submitAnswer,
    resetAnswers,
    getModuleScore,
    goNext,
    goPrev,
    isModuleComplete,
    moduleScenarios,
    resetModule,
  }
}
