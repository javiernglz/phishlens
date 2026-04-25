import { emailScenarios } from './emailScenarios'
import { smsScenarios } from './smsScenarios'
import { fileScenarios } from './fileScenarios'

export const ALL_SCENARIOS = [...emailScenarios, ...smsScenarios, ...fileScenarios]

export const MODULES = [
  { id: 'email', label: 'Email', shortLabel: 'Email' },
  { id: 'sms', label: 'SMS / WA', shortLabel: 'SMS' },
  { id: 'file', label: 'Archivo', shortLabel: 'Arch.' },
]

export function getScenariosByModule(moduleId) {
  return ALL_SCENARIOS.filter((s) => s.module === moduleId)
}
