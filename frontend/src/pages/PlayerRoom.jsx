import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getOrCreatePlayerId } from '../lib/roomUtils'
import { WordMark } from '../components/ui/PhishLensLogo'

const LEVEL_STYLES = {
  easy:   { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-300', label: 'Fácil'   },
  medium: { bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-300',   label: 'Medio'   },
  hard:   { bg: 'bg-rose-50',     text: 'text-rose-700',    border: 'border-rose-300',    label: 'Difícil' },
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
  const prevGameState  = useRef(null)
  const myVoteRef      = useRef(null)

  useEffect(() => { myVoteRef.current = myVote }, [myVote])

  useEffect(() => {
    const channel = supabase.channel(`room:${code}`, {
      config: { presence: { key: playerId } },
    })

    channel
      .on('broadcast', { event: 'game_state' }, ({ payload }) => {
        const isNewQuestion = payload.scenarioId !== prevScenarioId.current

        if (isNewQuestion) {
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 px-6">
        <WordMark size={20} dark={false} />
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-1">Sala</p>
          <p className="text-2xl font-mono font-bold text-indigo-600">{code}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Esperando al presentador…
        </div>
        <p className="text-xs text-slate-400">
          Conectado como <span className="text-slate-600 font-medium">{playerName}</span>
        </p>
      </div>
    )
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
  const levelKey = gameState?.level ?? 'medium'
  const lvl = LEVEL_STYLES[levelKey] ?? LEVEL_STYLES.medium

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col px-5 pt-10 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <WordMark size={16} dark={false} />
        <div className="flex items-center gap-2">
          {score.total > 0 && (
            <span className="text-xs text-slate-400 font-mono bg-white border border-slate-200 px-2 py-0.5 rounded-full">
              {score.correct}/{score.total}
            </span>
          )}
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${lvl.bg} ${lvl.text} ${lvl.border}`}>
            {lvl.label}
          </span>
        </div>
      </div>

      {/* Module + title */}
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
        ) : (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => sendVote('phishing')}
              className="w-full py-5 rounded-2xl bg-white border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 active:scale-95 transition-all text-rose-600 font-bold text-lg shadow-sm"
            >
              🎣 Phishing
            </button>
            <button
              onClick={() => sendVote('legit')}
              className="w-full py-5 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 active:scale-95 transition-all text-emerald-600 font-bold text-lg shadow-sm"
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
