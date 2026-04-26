import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../lib/supabase'
import { ALL_SCENARIOS } from '../data'
import { HookIcon } from '../components/ui/PhishLensLogo'
import { ChevronRight, ChevronLeft, Eye, EyeOff, Users, Copy, Check, Trophy } from 'lucide-react'

const MODULE_LABEL = { email: 'Email', sms: 'SMS / WA', file: 'Archivo' }

function VoteBar({ label, count, total, color }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <span className={`w-24 text-right text-xs font-bold ${color}`}>{label}</span>
      <div className="flex-1 h-8 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            color === 'text-red-400' ? 'bg-red-700' : 'bg-emerald-700'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 text-sm font-bold text-slate-200">
        {count} <span className="text-slate-500 font-normal text-xs">({pct}%)</span>
      </span>
    </div>
  )
}

function PlayerPill({ name, voted }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
      voted
        ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
        : 'bg-slate-800 border-slate-700 text-slate-500'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${voted ? 'bg-cyan-400' : 'bg-slate-600'}`} />
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
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-[#0d1117] border border-slate-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Trophy size={24} className="text-amber-400" />
          <h2 className="text-2xl font-black text-slate-100">Marcador final</h2>
          <span className="ml-auto text-xs text-slate-500">{total} preguntas</span>
        </div>

        {ranked.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">Sin jugadores registrados</p>
        ) : (
          <div className="flex flex-col gap-3 mb-8">
            {ranked.map((p, i) => {
              const pct = total === 0 ? 0 : Math.round((p.correct / total) * 100)
              const isTop = i < 3
              return (
                <div
                  key={p.playerId}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-3.5 border ${
                    i === 0 ? 'bg-amber-950/40 border-amber-800/60'
                    : i === 1 ? 'bg-slate-800/60 border-slate-700'
                    : i === 2 ? 'bg-orange-950/30 border-orange-900/50'
                    : 'bg-slate-900/40 border-slate-800'
                  }`}
                >
                  <span className="text-xl w-7 text-center flex-shrink-0">
                    {isTop ? MEDAL[i] : <span className="text-slate-600 text-sm font-bold">{i + 1}</span>}
                  </span>
                  <span className="flex-1 font-semibold text-slate-200 truncate">{p.name}</span>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-lg font-black ${
                      pct >= 80 ? 'text-emerald-400'
                      : pct >= 50 ? 'text-amber-400'
                      : 'text-red-400'
                    }`}>{p.correct}<span className="text-slate-600 font-normal text-sm">/{total}</span></span>
                    <div className="text-[10px] text-slate-500">{pct}% acierto</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
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

  const [players, setPlayers]             = useState({})
  const [votes, setVotes]                 = useState({})
  const [phase, setPhase]                 = useState('question')
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [copied, setCopied]               = useState(false)
  const [showScoreboard, setShowScoreboard] = useState(false)
  // scores: { [playerId]: { name, correct, answered } }
  const [scores, setScores]               = useState({})

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

  // Accumulate scores from current votes before moving on
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
    // Include current question's votes in the scoreboard
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
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <p className="text-slate-500">No hay más escenarios</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      {showScoreboard && (
        <Scoreboard
          scores={scores}
          total={scenarioIndex + 1}
          onClose={() => setShowScoreboard(false)}
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <HookIcon size={20} color="#22d3ee" strokeWidth={2.2} />
          <span className="text-sm font-bold text-slate-200">PhishLens</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Código de sala:</span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5 text-cyan-300 font-mono font-bold text-sm transition-colors"
          >
            {code}
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-slate-500" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openScoreboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-700 text-slate-400 hover:text-amber-400 text-xs font-semibold transition-colors"
          >
            <Trophy size={13} />
            Marcador
          </button>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {MODULE_LABEL[scenario.module]}
              </span>
              <span className="text-slate-700">·</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                scenario.level === 'Fácil' ? 'text-emerald-500'
                : scenario.level === 'Medio' ? 'text-amber-500'
                : 'text-red-500'
              }`}>{scenario.level}</span>
              <span className="text-slate-700">·</span>
              <span className="text-[10px] text-slate-600">{scenarioIndex + 1} / {SCENARIOS.length}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-100 leading-snug">
              {scenario.content?.subject
                ?? scenario.content?.from
                ?? scenario.content?.filename
                ?? `Escenario ${scenarioIndex + 1}`}
            </h1>
          </div>

          {/* Vote bars */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Votos en tiempo real</span>
              <span className="text-xs text-slate-500">{votedCnt}/{totalVoters} han votado</span>
            </div>
            <VoteBar label="🎣 Phishing" count={phishingCnt} total={Math.max(totalVoters, 1)} color="text-red-400" />
            <VoteBar label="✓ Legítimo"  count={legitCnt}    total={Math.max(totalVoters, 1)} color="text-emerald-400" />
          </div>

          {/* Answer reveal */}
          {phase === 'reveal' && (
            <div className={`rounded-2xl border p-5 flex items-center gap-4 ${
              isPhishing ? 'bg-red-950/40 border-red-800' : 'bg-emerald-950/40 border-emerald-800'
            }`}>
              <span className="text-4xl">{isPhishing ? '🎣' : '✅'}</span>
              <div>
                <p className={`text-lg font-bold ${isPhishing ? 'text-red-300' : 'text-emerald-300'}`}>
                  Era {isPhishing ? 'Phishing' : 'Legítimo'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
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
              className="p-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={toggleReveal}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                phase === 'reveal'
                  ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'bg-cyan-500 border-cyan-400 text-slate-950 hover:bg-cyan-400'
              }`}
            >
              {phase === 'reveal' ? <EyeOff size={15} /> : <Eye size={15} />}
              {phase === 'reveal' ? 'Ocultar solución' : 'Revelar solución'}
            </button>
            {isLast ? (
              <button
                onClick={openScoreboard}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-amber-700 hover:border-amber-500 bg-amber-950/40 hover:bg-amber-950/70 text-amber-300 font-semibold text-sm transition-colors"
              >
                <Trophy size={15} />
                Ver marcador
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 font-semibold text-sm transition-colors"
              >
                Siguiente <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-64 border-l border-slate-800 flex flex-col overflow-y-auto">
          {/* QR section */}
          <div className="p-5 border-b border-slate-800/60">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Únete desde el móvil</p>
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-2xl">
                <QRCodeSVG value={joinUrl} size={148} level="M" />
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-600 mt-3 font-mono">{joinUrl}</p>
          </div>

          {/* Players section */}
          <div className="p-5 flex flex-col gap-3 flex-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Jugadores</p>
            {playerList.length === 0 ? (
              <p className="text-xs text-slate-700 leading-relaxed">
                Escanea el QR o entra con el código <span className="text-cyan-600 font-mono">{code}</span>
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
