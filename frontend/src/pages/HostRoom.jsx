import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../lib/supabase'
import { ALL_SCENARIOS } from '../data'
import { WordMark } from '../components/ui/PhishLensLogo'
import { ChevronRight, ChevronLeft, Eye, EyeOff, Users, Copy, Check, Trophy } from 'lucide-react'

const MODULE_LABEL = { email: 'Email', sms: 'SMS / WA', file: 'Archivo' }

const LEVEL_STYLES = {
  easy:   { text: 'text-emerald-600', label: 'Fácil'   },
  medium: { text: 'text-amber-600',   label: 'Medio'   },
  hard:   { text: 'text-rose-600',    label: 'Difícil' },
}

function VoteBar({ label, count, total, color }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <span className={`w-24 text-right text-xs font-bold ${color}`}>{label}</span>
      <div className="flex-1 h-7 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            color === 'text-rose-600' ? 'bg-rose-400' : 'bg-emerald-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 text-sm font-bold text-slate-700">
        {count} <span className="text-slate-400 font-normal text-xs">({pct}%)</span>
      </span>
    </div>
  )
}

function PlayerPill({ name, voted }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
      voted
        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
        : 'bg-slate-100 border-slate-200 text-slate-400'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${voted ? 'bg-indigo-500' : 'bg-slate-300'}`} />
      {name}
    </span>
  )
}

function buildStatePayload(sc, ph) {
  return {
    scenarioId: sc.id,
    title: sc.content?.subject ?? sc.content?.from ?? sc.content?.filename ?? '',
    level: sc.level,
    module: sc.module,
    phase: ph,
    correctAnswer: sc.isPhishing !== false ? 'phishing' : 'legit',
  }
}

const MEDAL = ['🥇', '🥈', '🥉']

function Scoreboard({ scores, total, onClose }) {
  const ranked = Object.values(scores)
    .sort((a, b) => b.correct - a.correct || a.name.localeCompare(b.name))

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Trophy size={24} className="text-amber-500" />
          <h2 className="text-2xl font-black text-slate-900">Marcador final</h2>
          <span className="ml-auto text-xs text-slate-400">{total} preguntas</span>
        </div>

        {ranked.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">Sin jugadores registrados</p>
        ) : (
          <div className="flex flex-col gap-3 mb-8">
            {ranked.map((p, i) => {
              const pct = total === 0 ? 0 : Math.round((p.correct / total) * 100)
              const isTop = i < 3
              return (
                <div
                  key={p.playerId}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-3.5 border ${
                    i === 0 ? 'bg-amber-50 border-amber-200'
                    : i === 1 ? 'bg-slate-100 border-slate-200'
                    : i === 2 ? 'bg-orange-50 border-orange-200'
                    : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <span className="text-xl w-7 text-center flex-shrink-0">
                    {isTop ? MEDAL[i] : <span className="text-slate-400 text-sm font-bold">{i + 1}</span>}
                  </span>
                  <span className="flex-1 font-semibold text-slate-800 truncate">{p.name}</span>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-lg font-black ${
                      pct >= 80 ? 'text-emerald-600'
                      : pct >= 50 ? 'text-amber-600'
                      : 'text-rose-600'
                    }`}>{p.correct}<span className="text-slate-300 font-normal text-sm">/{total}</span></span>
                    <div className="text-[10px] text-slate-400">{pct}% acierto</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

export function HostRoom() {
  const { code }   = useParams()
  const navigate   = useNavigate()

  const [players, setPlayers]               = useState({})
  const [votes, setVotes]                   = useState({})
  const [phase, setPhase]                   = useState('question')
  const [scenarioIndex, setScenarioIndex]   = useState(0)
  const [copied, setCopied]                 = useState(false)
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [scores, setScores]                 = useState({})

  const channelRef  = useRef(null)
  const SCENARIOS   = ALL_SCENARIOS
  const scenario    = SCENARIOS[scenarioIndex] ?? null
  const scenarioRef = useRef(scenario)
  const phaseRef    = useRef('question')
  const votesRef    = useRef({})

  useEffect(() => { scenarioRef.current = scenario }, [scenario])
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { votesRef.current = votes }, [votes])

  const joinUrl = `${window.location.origin}/join/${code}`

  function broadcastState(sc, ph) {
    if (!channelRef.current || !sc) return
    channelRef.current.send({
      type: 'broadcast',
      event: 'game_state',
      payload: buildStatePayload(sc, ph),
    })
  }

  function accumulateScores(currentVotes, currentScenario) {
    const correct = currentScenario?.isPhishing !== false ? 'phishing' : 'legit'
    setScores((prev) => {
      const next = { ...prev }
      Object.entries(currentVotes).forEach(([pid, vote]) => {
        const name = players[pid]?.name ?? pid
        if (!next[pid]) next[pid] = { playerId: pid, name, correct: 0, answered: 0 }
        next[pid] = {
          ...next[pid],
          name,
          answered: next[pid].answered + 1,
          correct: next[pid].correct + (vote === correct ? 1 : 0),
        }
      })
      return next
    })
  }

  useEffect(() => {
    const channel = supabase.channel(`room:${code}`, {
      config: { presence: { key: 'host' } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setPlayers((prev) => {
          const next = {}
          Object.values(state).flat().forEach((p) => {
            if (p.role === 'player') {
              next[p.playerId] = { name: p.name, voted: prev[p.playerId]?.voted ?? false }
            }
          })
          return next
        })
      })
      .on('broadcast', { event: 'vote' }, ({ payload }) => {
        const { playerId, name, vote } = payload
        setVotes((prev) => ({ ...prev, [playerId]: vote }))
        setPlayers((prev) => ({
          ...prev,
          [playerId]: { name: name ?? prev[playerId]?.name ?? playerId, voted: true },
        }))
      })
      .on('broadcast', { event: 'request_state' }, () => {
        broadcastState(scenarioRef.current, phaseRef.current)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ role: 'host' })
          broadcastState(SCENARIOS[0], 'question')
        }
      })

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [code])

  function goNext() {
    const next = scenarioIndex + 1
    if (next >= SCENARIOS.length) return
    accumulateScores(votesRef.current, scenario)
    const nextSc = SCENARIOS[next]
    setScenarioIndex(next)
    setVotes({})
    setPhase('question')
    setPlayers((prev) => {
      const reset = {}
      Object.keys(prev).forEach((id) => { reset[id] = { ...prev[id], voted: false } })
      return reset
    })
    broadcastState(nextSc, 'question')
  }

  function goPrev() {
    if (scenarioIndex === 0) return
    const prev = scenarioIndex - 1
    const prevSc = SCENARIOS[prev]
    setScenarioIndex(prev)
    setVotes({})
    setPhase('question')
    setPlayers((p) => {
      const reset = {}
      Object.keys(p).forEach((id) => { reset[id] = { ...p[id], voted: false } })
      return reset
    })
    broadcastState(prevSc, 'question')
  }

  function toggleReveal() {
    const next = phase === 'question' ? 'reveal' : 'question'
    setPhase(next)
    broadcastState(scenario, next)
  }

  function openScoreboard() {
    accumulateScores(votesRef.current, scenario)
    setShowScoreboard(true)
  }

  function copyCode() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const playerList  = Object.values(players)
  const totalVoters = playerList.length
  const phishingCnt = Object.values(votes).filter((v) => v === 'phishing').length
  const legitCnt    = Object.values(votes).filter((v) => v === 'legit').length
  const votedCnt    = phishingCnt + legitCnt
  const isPhishing  = scenario?.isPhishing !== false
  const isLast      = scenarioIndex >= SCENARIOS.length - 1

  if (!scenario) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">No hay más escenarios</p>
      </div>
    )
  }

  const levelStyle = LEVEL_STYLES[scenario.level] ?? LEVEL_STYLES.medium

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {showScoreboard && (
        <Scoreboard
          scores={scores}
          total={scenarioIndex + 1}
          onClose={() => setShowScoreboard(false)}
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <WordMark size={16} dark={false} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Código de sala:</span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-3 py-1.5 text-indigo-600 font-mono font-bold text-sm transition-colors"
          >
            {code}
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-indigo-400" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openScoreboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-500 hover:text-amber-700 text-xs font-semibold transition-colors"
          >
            <Trophy size={13} />
            Marcador
          </button>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Users size={14} />
            <span>{totalVoters} jugador{totalVoters !== 1 ? 'es' : ''}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main area */}
        <div className="flex-1 flex flex-col p-8 gap-6">
          {/* Scenario info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {MODULE_LABEL[scenario.module]}
              </span>
              <span className="text-slate-300">·</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${levelStyle.text}`}>
                {levelStyle.label}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[10px] text-slate-400">{scenarioIndex + 1} / {SCENARIOS.length}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 leading-snug">
              {scenario.content?.subject
                ?? scenario.content?.from
                ?? scenario.content?.filename
                ?? `Escenario ${scenarioIndex + 1}`}
            </h1>
          </div>

          {/* Vote bars */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Votos en tiempo real</span>
              <span className="text-xs text-slate-400">{votedCnt}/{totalVoters} han votado</span>
            </div>
            <VoteBar label="🎣 Phishing" count={phishingCnt} total={Math.max(totalVoters, 1)} color="text-rose-600" />
            <VoteBar label="✓ Legítimo"  count={legitCnt}    total={Math.max(totalVoters, 1)} color="text-emerald-600" />
          </div>

          {/* Answer reveal */}
          {phase === 'reveal' && (
            <div className={`rounded-2xl border p-5 flex items-center gap-4 ${
              isPhishing ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <span className="text-4xl">{isPhishing ? '🎣' : '✅'}</span>
              <div>
                <p className={`text-lg font-bold ${isPhishing ? 'text-rose-700' : 'text-emerald-700'}`}>
                  Era {isPhishing ? 'Phishing' : 'Legítimo'}
                </p>
                <p className={`text-xs mt-0.5 ${isPhishing ? 'text-rose-500' : 'text-emerald-600'}`}>
                  {isPhishing
                    ? `${phishingCnt} lo detectaron · ${legitCnt} cayeron en la trampa`
                    : `${legitCnt} lo identificaron · ${phishingCnt} votaron erróneamente phishing`}
                </p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3 mt-auto">
            <button
              onClick={goPrev}
              disabled={scenarioIndex === 0}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={toggleReveal}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                phase === 'reveal'
                  ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {phase === 'reveal' ? <EyeOff size={15} /> : <Eye size={15} />}
              {phase === 'reveal' ? 'Ocultar solución' : 'Revelar solución'}
            </button>
            {isLast ? (
              <button
                onClick={openScoreboard}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-sm transition-colors"
              >
                <Trophy size={15} />
                Ver marcador
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors"
              >
                Siguiente <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-64 border-l border-slate-200 bg-white flex flex-col overflow-y-auto">
          {/* QR section */}
          <div className="p-5 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Únete desde el móvil</p>
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <QRCodeSVG value={joinUrl} size={148} level="M" />
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-3 font-mono">{joinUrl}</p>
          </div>

          {/* Players section */}
          <div className="p-5 flex flex-col gap-3 flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jugadores</p>
            {playerList.length === 0 ? (
              <p className="text-xs text-slate-400 leading-relaxed">
                Escanea el QR o entra con el código{' '}
                <span className="text-indigo-600 font-mono font-bold">{code}</span>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {playerList.map((p, i) => (
                  <PlayerPill key={i} name={p.name} voted={p.voted} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
