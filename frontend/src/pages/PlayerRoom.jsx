import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, supabaseReady } from '../lib/supabase'
import { getOrCreatePlayerId } from '../lib/roomUtils'
import { WordMark } from '../components/ui/PhishLensLogo'

// ─── Timer ring ───────────────────────────────────────────────────────────────

function TimerRing({ timeLeft, total }) {
  if (!total || timeLeft === null) return null
  const r    = 20
  const circ = 2 * Math.PI * r
  const pct  = total > 0 ? Math.max(0, timeLeft / total) : 0
  const color = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={52} height={52}>
        <circle cx={26} cy={26} r={r} fill="none" stroke="#e2e8f0" strokeWidth={3.5} />
        <circle
          cx={26} cy={26} r={r}
          fill="none" stroke={color} strokeWidth={3.5}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
        />
      </svg>
      <span className="absolute text-xs font-black tabular-nums" style={{ color }}>
        {timeLeft === 0 ? '✕' : timeLeft}
      </span>
    </div>
  )
}

const LEVEL_STYLES = {
  easy:   { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-300', label: 'Fácil'   },
  medium: { bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-300',   label: 'Medio'   },
  hard:   { bg: 'bg-rose-50',     text: 'text-rose-700',    border: 'border-rose-300',    label: 'Difícil' },
}

// ─── Lobby waiting screen ─────────────────────────────────────────────────────

function LobbyWaiting({ playerName, code, connected }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-10">
        <WordMark size={18} dark={true} />
      </div>

      {/* Animated hook */}
      <div className="text-6xl mb-8 animate-bounce select-none">🎣</div>

      {/* Name badge */}
      <div className="bg-indigo-600 rounded-2xl px-8 py-4 mb-8 shadow-lg shadow-indigo-900/40">
        <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-1">Conectado como</p>
        <p className="text-white text-2xl font-bold">{playerName}</p>
      </div>

      {/* Room code */}
      <div className="mb-8">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-2">Sala</p>
        <p className="text-indigo-400 font-mono font-black text-3xl tracking-widest">{code}</p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2.5 text-slate-400 text-sm">
        <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600 animate-pulse'}`} />
        {connected
          ? 'Esperando a que el presentador inicie…'
          : 'Conectando…'}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PlayerRoom() {
  const { code }   = useParams()
  const playerId   = getOrCreatePlayerId()
  const playerName = sessionStorage.getItem('phishlens_display_name') || 'Anónimo'

  const [gameState, setGameState]   = useState(null)
  const [voted, setVoted]           = useState(false)
  const [myVote, setMyVote]         = useState(null)
  const [phase, setPhase]           = useState('connecting')
  const [score, setScore]           = useState({ correct: 0, total: 0 })
  const [timeLeft, setTimeLeft]     = useState(null)

  const channelRef     = useRef(null)
  const prevScenarioId = useRef(null)
  const prevGameState  = useRef(null)
  const myVoteRef      = useRef(null)
  const timerRef       = useRef(null)

  useEffect(() => { myVoteRef.current = myVote }, [myVote])

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    setTimeLeft(null)
  }, [])

  function startSyncedTimer(duration, startedAt) {
    stopTimer()
    if (!duration) return
    const elapsed  = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0
    const initial  = Math.max(0, duration - elapsed)
    setTimeLeft(initial)
    if (initial === 0) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) { clearInterval(timerRef.current); timerRef.current = null; return 0 }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => () => stopTimer(), [stopTimer])

  useEffect(() => {
    if (!supabase) return
    const channel = supabase.channel(`room:${code}`, {
      config: { presence: { key: playerId } },
    })

    channel
      .on('broadcast', { event: 'game_state' }, ({ payload }) => {
        const isNewQuestion = payload.scenarioId !== prevScenarioId.current

        if (isNewQuestion) {
          // Only count score when transitioning between real questions (not from lobby)
          if (prevScenarioId.current !== null && prevGameState.current?.phase !== 'lobby') {
            const correct = prevGameState.current?.correctAnswer
            const vote    = myVoteRef.current
            setScore((s) => ({
              correct: s.correct + (vote && vote === correct ? 1 : 0),
              total: s.total + 1,
            }))
          }
          prevScenarioId.current = payload.scenarioId
          setVoted(false)
          setMyVote(null)
          myVoteRef.current = null
        }

        prevGameState.current = payload
        setGameState(payload)
        const newPhase = payload.phase ?? 'question'
        setPhase(newPhase)

        if (newPhase === 'question' && payload.timerDuration) {
          startSyncedTimer(payload.timerDuration, payload.timerStartedAt)
        } else {
          stopTimer()
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ role: 'player', name: playerName, playerId })
          channel.send({ type: 'broadcast', event: 'request_state', payload: {} })
          // If no state arrives within 1s, show lobby anyway
          setTimeout(() => setPhase((p) => p === 'connecting' ? 'lobby' : p), 1000)
        }
      })

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [code])

  async function sendVote(vote) {
    if (voted) return
    setVoted(true)
    setMyVote(vote)
    myVoteRef.current = vote
    await channelRef.current.send({
      type: 'broadcast',
      event: 'vote',
      payload: { playerId, name: playerName, vote },
    })
  }

  // ── No Supabase ─────────────────────────────────────────────────────────────
  if (!supabaseReady) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-2xl mb-3">⚙️</p>
          <p className="text-white font-semibold mb-1">Sala no disponible</p>
          <p className="text-slate-400 text-sm">El multijugador no está configurado en este entorno.</p>
        </div>
      </div>
    )
  }

  // ── Connecting / Lobby ──────────────────────────────────────────────────────
  if (phase === 'connecting' || phase === 'lobby') {
    return <LobbyWaiting playerName={playerName} code={code} connected={phase === 'lobby'} />
  }

  // ── Reveal screen ───────────────────────────────────────────────────────────
  if (phase === 'reveal') {
    const correct  = gameState?.correctAnswer
    const wasRight = myVote && correct && myVote === correct
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 px-6 text-center">
        {myVote ? (
          <>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl border-2 ${
              wasRight ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
            }`}>
              {wasRight ? '✅' : '❌'}
            </div>
            <p className={`text-2xl font-bold ${wasRight ? 'text-emerald-700' : 'text-rose-700'}`}>
              {wasRight ? '¡Correcto!' : 'Incorrecto'}
            </p>
            <p className="text-sm text-slate-500">
              Votaste:{' '}
              <span className={`font-semibold ${myVote === 'phishing' ? 'text-rose-600' : 'text-emerald-600'}`}>
                {myVote === 'phishing' ? 'Phishing' : 'Legítimo'}
              </span>
            </p>
          </>
        ) : (
          <p className="text-slate-400 text-sm">No votaste a tiempo</p>
        )}

        {score.total > 0 && (
          <div className="mt-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm text-slate-500 shadow-sm">
            Llevas <span className="text-slate-800 font-bold">{score.correct}/{score.total}</span> correctas
          </div>
        )}

        <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Esperando la siguiente pregunta…
        </div>
      </div>
    )
  }

  // ── Question screen ─────────────────────────────────────────────────────────
  const levelKey   = gameState?.level ?? 'medium'
  const lvl        = LEVEL_STYLES[levelKey] ?? LEVEL_STYLES.medium
  const timerTotal = gameState?.timerDuration ?? null
  const timesUp    = timerTotal !== null && timeLeft === 0
  const canVote    = !voted && !timesUp

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col px-5 pt-10 pb-8">
      <div className="flex items-center justify-between mb-8">
        <WordMark size={16} dark={false} />
        <div className="flex items-center gap-2">
          {score.total > 0 && (
            <span className="text-xs text-slate-400 font-mono bg-white border border-slate-200 px-2 py-0.5 rounded-full">
              {score.correct}/{score.total}
            </span>
          )}
          <TimerRing timeLeft={timeLeft} total={timerTotal} />
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${lvl.bg} ${lvl.text} ${lvl.border}`}>
            {lvl.label}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">
          {gameState?.module === 'email' ? 'Correo electrónico'
            : gameState?.module === 'sms' ? 'SMS / Mensaje'
            : 'Archivo adjunto'}
        </p>
        <h1 className="text-2xl font-bold text-slate-900 leading-snug mb-10">
          {gameState?.title ?? '…'}
        </h1>

        {voted ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 ${
              myVote === 'phishing' ? 'border-rose-300 bg-rose-50' : 'border-emerald-300 bg-emerald-50'
            }`}>
              {myVote === 'phishing' ? '🎣' : '✓'}
            </div>
            <p className="text-slate-600 text-sm font-medium">
              Votaste:{' '}
              <span className={myVote === 'phishing' ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                {myVote === 'phishing' ? 'Phishing' : 'Legítimo'}
              </span>
            </p>
            <p className="text-slate-400 text-xs">Esperando al resto de jugadores…</p>
          </div>
        ) : timesUp ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 border-slate-200 bg-slate-100">
              ⏱️
            </div>
            <p className="text-slate-500 text-sm font-medium">Tiempo agotado</p>
            <p className="text-slate-400 text-xs">Esperando la respuesta…</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => sendVote('phishing')}
              disabled={!canVote}
              className="w-full py-5 rounded-2xl bg-white border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 active:scale-95 transition-all text-rose-600 font-bold text-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🎣 Phishing
            </button>
            <button
              onClick={() => sendVote('legit')}
              disabled={!canVote}
              className="w-full py-5 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 active:scale-95 transition-all text-emerald-600 font-bold text-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✓ Legítimo
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-300 mt-8">{playerName} · {code}</p>
    </div>
  )
}
