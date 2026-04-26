import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getOrCreatePlayerId } from '../lib/roomUtils'
import { HookIcon } from '../components/ui/PhishLensLogo'

const LEVEL_COLORS = {
  Fácil:   { bg: 'bg-emerald-950', text: 'text-emerald-400', border: 'border-emerald-800' },
  Medio:   { bg: 'bg-amber-950',   text: 'text-amber-400',   border: 'border-amber-800'   },
  Difícil: { bg: 'bg-red-950',     text: 'text-red-400',     border: 'border-red-800'     },
}

export function PlayerRoom() {
  const { code }   = useParams()
  const playerId   = getOrCreatePlayerId()
  const playerName = sessionStorage.getItem('phishlens_display_name') || 'Anónimo'

  const [gameState, setGameState]   = useState(null)
  const [voted, setVoted]           = useState(false)
  const [myVote, setMyVote]         = useState(null)
  const [phase, setPhase]           = useState('waiting')
  const [score, setScore]           = useState({ correct: 0, total: 0 })

  const channelRef     = useRef(null)
  const prevScenarioId = useRef(null)
  const prevGameState  = useRef(null) // holds correctAnswer of last question
  const myVoteRef      = useRef(null) // mirrors myVote for use inside callbacks

  useEffect(() => { myVoteRef.current = myVote }, [myVote])

  useEffect(() => {
    const channel = supabase.channel(`room:${code}`, {
      config: { presence: { key: playerId } },
    })

    channel
      .on('broadcast', { event: 'game_state' }, ({ payload }) => {
        const isNewQuestion = payload.scenarioId !== prevScenarioId.current

        if (isNewQuestion) {
          // Score the previous question using the stored correctAnswer
          if (prevScenarioId.current !== null) {
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
        setPhase(payload.phase ?? 'question')
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ role: 'player', name: playerName, playerId })
          channel.send({ type: 'broadcast', event: 'request_state', payload: {} })
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

  // ── Waiting screen ──────────────────────────────────────────────────────────
  if (phase === 'waiting') {
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center gap-6 px-6">
        <HookIcon size={36} color="#22d3ee" strokeWidth={2.2} />
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-1">Sala</p>
          <p className="text-2xl font-mono font-bold text-cyan-300">{code}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          Esperando al presentador…
        </div>
        <p className="text-xs text-slate-600">
          Conectado como <span className="text-slate-400">{playerName}</span>
        </p>
      </div>
    )
  }

  // ── Reveal screen ───────────────────────────────────────────────────────────
  if (phase === 'reveal') {
    const correct  = gameState?.correctAnswer
    const wasRight = myVote && correct && myVote === correct
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center gap-6 px-6 text-center">
        {myVote ? (
          <>
            <div className="text-6xl">{wasRight ? '✅' : '❌'}</div>
            <p className="text-xl font-bold text-slate-100">
              {wasRight ? '¡Correcto!' : 'Incorrecto'}
            </p>
            <p className="text-sm text-slate-400">
              Votaste:{' '}
              <span className={`font-semibold ${myVote === 'phishing' ? 'text-red-400' : 'text-emerald-400'}`}>
                {myVote === 'phishing' ? 'Phishing' : 'Legítimo'}
              </span>
            </p>
          </>
        ) : (
          <p className="text-slate-400 text-sm">No votaste a tiempo</p>
        )}

        {/* Running score */}
        {score.total > 0 && (
          <div className="mt-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">
            Llevas <span className="text-slate-200 font-bold">{score.correct}/{score.total}</span> correctas
          </div>
        )}

        <div className="flex items-center gap-2 text-slate-600 text-xs mt-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          Esperando la siguiente pregunta…
        </div>
      </div>
    )
  }

  // ── Question screen ─────────────────────────────────────────────────────────
  const level = gameState?.level ?? 'Medio'
  const lvl   = LEVEL_COLORS[level] ?? LEVEL_COLORS['Medio']

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col px-5 pt-10 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <HookIcon size={22} color="#22d3ee" strokeWidth={2.2} />
        <div className="flex items-center gap-2">
          {score.total > 0 && (
            <span className="text-xs text-slate-500 font-mono">
              {score.correct}/{score.total}
            </span>
          )}
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${lvl.bg} ${lvl.text} ${lvl.border}`}>
            {level}
          </span>
        </div>
      </div>

      {/* Module + title */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">
          {gameState?.module === 'email' ? 'Correo electrónico'
            : gameState?.module === 'sms' ? 'SMS / Mensaje'
            : 'Archivo adjunto'}
        </p>
        <h1 className="text-2xl font-bold text-slate-100 leading-snug mb-10">
          {gameState?.title ?? '…'}
        </h1>

        {voted ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 ${
              myVote === 'phishing' ? 'border-red-500 bg-red-950' : 'border-emerald-500 bg-emerald-950'
            }`}>
              {myVote === 'phishing' ? '🎣' : '✓'}
            </div>
            <p className="text-slate-300 text-sm font-medium">
              Votaste:{' '}
              <span className={myVote === 'phishing' ? 'text-red-400' : 'text-emerald-400'}>
                {myVote === 'phishing' ? 'Phishing' : 'Legítimo'}
              </span>
            </p>
            <p className="text-slate-600 text-xs">Esperando al resto de jugadores…</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => sendVote('phishing')}
              className="w-full py-5 rounded-2xl bg-red-950 border-2 border-red-700 hover:border-red-500 hover:bg-red-900 active:scale-95 transition-all text-red-300 font-bold text-lg tracking-wide"
            >
              🎣 Phishing
            </button>
            <button
              onClick={() => sendVote('legit')}
              className="w-full py-5 rounded-2xl bg-emerald-950 border-2 border-emerald-700 hover:border-emerald-500 hover:bg-emerald-900 active:scale-95 transition-all text-emerald-300 font-bold text-lg tracking-wide"
            >
              ✓ Legítimo
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-700 mt-8">{playerName} · {code}</p>
    </div>
  )
}
