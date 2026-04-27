import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { supabase, supabaseReady } from '../lib/supabase'
import { ALL_SCENARIOS } from '../data'
import { WordMark } from '../components/ui/PhishLensLogo'
import { EmailView } from '../components/simulator/EmailView'
import { SmsView } from '../components/simulator/SmsView'
import { FileView } from '../components/simulator/FileView'
import { ChevronRight, ChevronLeft, Eye, EyeOff, Users, Copy, Check, Trophy, Play } from 'lucide-react'

const VIEWS = { email: EmailView, sms: SmsView, file: FileView }

const LEVEL_OPTIONS = [
  { id: 'all',          label: 'Todos',          levels: ['easy','medium','hard'] },
  { id: 'easy',         label: 'Fácil',          levels: ['easy'] },
  { id: 'medium',       label: 'Medio',          levels: ['medium'] },
  { id: 'hard',         label: 'Difícil',        levels: ['hard'] },
  { id: 'easy-medium',  label: 'Fácil + Medio',  levels: ['easy','medium'] },
  { id: 'medium-hard',  label: 'Medio + Difícil',levels: ['medium','hard'] },
]

const TIMER_OPTIONS = [
  { value: null, label: 'Sin límite' },
  { value: 15,   label: '15 s' },
  { value: 20,   label: '20 s' },
  { value: 30,   label: '30 s' },
  { value: 45,   label: '45 s' },
  { value: 60,   label: '1 min' },
]

const QUESTION_COUNT_OPTIONS = [null, 5, 10, 15, 20]

const LEVEL_STYLE = {
  easy:   { text: 'text-emerald-600', label: 'Fácil'   },
  medium: { text: 'text-amber-600',   label: 'Medio'   },
  hard:   { text: 'text-rose-600',    label: 'Difícil' },
}

// ─── Timer circle ─────────────────────────────────────────────────────────────

function TimerCircle({ timeLeft, total }) {
  if (timeLeft === null) return null
  const r = 18
  const circ = 2 * Math.PI * r
  const pct  = total > 0 ? timeLeft / total : 0
  const color = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <svg width={48} height={48}>
        <circle cx={24} cy={24} r={r} fill="none" stroke="#e2e8f0" strokeWidth={3.5} />
        <circle
          cx={24} cy={24} r={r}
          fill="none" stroke={color} strokeWidth={3.5}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
        />
      </svg>
      <span className="absolute text-xs font-black tabular-nums" style={{ color }}>
        {timeLeft === 0 ? '✕' : timeLeft}
      </span>
    </div>
  )
}

// ─── Vote bars ────────────────────────────────────────────────────────────────

function VoteBar({ label, count, total, color, bg }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100)
  return (
    <div className="flex items-center gap-2">
      <span className={`w-20 text-right text-xs font-bold ${color} flex-shrink-0`}>{label}</span>
      <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${bg}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-14 text-xs font-bold text-slate-600 tabular-nums flex-shrink-0">
        {count} <span className="text-slate-400 font-normal">({pct}%)</span>
      </span>
    </div>
  )
}

// ─── Scoreboard ───────────────────────────────────────────────────────────────

const MEDAL = ['🥇','🥈','🥉']

function Scoreboard({ scores, total, onClose }) {
  const ranked = Object.values(scores).sort((a,b) => b.correct - a.correct || a.name.localeCompare(b.name))
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Trophy size={24} className="text-amber-500" />
          <h2 className="text-2xl font-black text-slate-900">Marcador final</h2>
          <span className="ml-auto text-xs text-slate-400">{total} preguntas</span>
        </div>
        {ranked.length === 0
          ? <p className="text-slate-400 text-sm text-center py-8">Sin jugadores registrados</p>
          : <div className="flex flex-col gap-3 mb-8">
              {ranked.map((p,i) => {
                const pct = total === 0 ? 0 : Math.round((p.correct/total)*100)
                return (
                  <div key={p.playerId} className={`flex items-center gap-4 rounded-2xl px-5 py-3.5 border ${
                    i===0 ? 'bg-amber-50 border-amber-200' : i===1 ? 'bg-slate-100 border-slate-200' : i===2 ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className="text-xl w-7 text-center">{i<3 ? MEDAL[i] : <span className="text-slate-400 text-sm font-bold">{i+1}</span>}</span>
                    <span className="flex-1 font-semibold text-slate-800 truncate">{p.name}</span>
                    <div className="text-right">
                      <span className={`text-lg font-black ${pct>=80?'text-emerald-600':pct>=50?'text-amber-600':'text-rose-600'}`}>
                        {p.correct}<span className="text-slate-300 font-normal text-sm">/{total}</span>
                      </span>
                      <div className="text-[10px] text-slate-400">{pct}% acierto</div>
                    </div>
                  </div>
                )
              })}
            </div>
        }
        <button onClick={onClose} className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors">
          Cerrar
        </button>
      </div>
    </div>
  )
}

// ─── Lobby ────────────────────────────────────────────────────────────────────

function PillBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
        active
          ? 'bg-indigo-600 border-indigo-600 text-white'
          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
      }`}
    >
      {children}
    </button>
  )
}

function LobbyScreen({ code, joinUrl, players, onStart, copied, onCopy, levelOptionId, onLevelOption, timerDuration, onTimer, questionCount, onQuestionCount }) {
  const playerList    = Object.values(players)
  const count         = playerList.length
  const levels        = LEVEL_OPTIONS.find(o => o.id === levelOptionId)?.levels ?? ['easy','medium','hard']
  const availableCount = ALL_SCENARIOS.filter(s => levels.includes(s.level)).length
  const finalCount    = questionCount ? Math.min(questionCount, availableCount) : availableCount

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100">
        <WordMark size={16} dark={false} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Código:</span>
          <button onClick={onCopy} className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-3 py-1.5 text-indigo-600 font-mono font-bold text-sm transition-colors">
            {code}
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-indigo-400" />}
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <Users size={14} />
          <span>{count} jugador{count!==1?'es':''}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left: settings + players */}
        <div className="flex-1 flex flex-col justify-center px-12 py-8 gap-8">

          {/* Difficulty */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dificultad</p>
            <div className="flex flex-wrap gap-2">
              {LEVEL_OPTIONS.map(opt => (
                <PillBtn key={opt.id} active={levelOptionId===opt.id} onClick={() => onLevelOption(opt.id)}>
                  {opt.label}
                </PillBtn>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">{availableCount} escenarios disponibles</p>
          </div>

          {/* Question count */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Número de preguntas</p>
            <div className="flex flex-wrap gap-2">
              {QUESTION_COUNT_OPTIONS.map(opt => {
                const label = opt === null ? 'Todas' : opt > availableCount ? null : String(opt)
                if (label === null) return null
                return (
                  <PillBtn key={String(opt)} active={questionCount===opt} onClick={() => onQuestionCount(opt)}>
                    {label}
                  </PillBtn>
                )
              })}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {questionCount && questionCount < availableCount
                ? `${questionCount} al azar de ${availableCount}`
                : `${availableCount} en orden aleatorio`}
            </p>
          </div>

          {/* Timer */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Cronómetro por pregunta</p>
            <div className="flex flex-wrap gap-2">
              {TIMER_OPTIONS.map(opt => (
                <PillBtn key={String(opt.value)} active={timerDuration===opt.value} onClick={() => onTimer(opt.value)}>
                  {opt.label}
                </PillBtn>
              ))}
            </div>
          </div>

          {/* Room code */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Código de sala</p>
            <div className="bg-slate-900 rounded-2xl px-8 py-5 inline-block">
              <p className="text-white font-mono font-black text-4xl tracking-wider">{code}</p>
            </div>
          </div>

          {/* Players */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {count===0 ? 'Esperando jugadores…' : `${count} jugador${count!==1?'es':''} conectado${count!==1?'s':''}`}
            </p>
            {count===0
              ? <div className="flex items-center gap-2 text-slate-300 text-sm"><span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"/><span>Nadie se ha unido todavía</span></div>
              : <div className="flex flex-wrap gap-2">
                  {playerList.map((p,i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"/>
                      {p.name}
                    </span>
                  ))}
                </div>
            }
          </div>
        </div>

        {/* Right: QR */}
        <div className="flex flex-col items-center justify-center px-12 py-8 border-l border-slate-100 gap-4 flex-shrink-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Únete desde el móvil</p>
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-lg">
            <QRCodeSVG value={joinUrl} size={200} level="M" />
          </div>
          <p className="text-[11px] text-slate-400 font-mono text-center max-w-[220px] break-all">{joinUrl}</p>
        </div>
      </div>

      {/* Start button */}
      <div className="border-t border-slate-100 px-8 py-5 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {count===0 ? 'Esperando jugadores…' : `${count} jugador${count!==1?'es':''} · ${finalCount} preguntas · ${timerDuration ? timerDuration+'s por pregunta' : 'sin límite de tiempo'}`}
        </p>
        <button
          onClick={onStart}
          disabled={finalCount===0}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-base transition-all ${
            scenarioCount>0
              ? 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-lg shadow-indigo-200'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Play size={18} />
          Empezar partida
        </button>
      </div>
    </div>
  )
}

// ─── Build payload ────────────────────────────────────────────────────────────

function buildPayload(sc, ph, timerDuration) {
  if (ph === 'lobby' || !sc) return { phase: 'lobby', scenarioId: null }
  return {
    scenarioId: sc.id,
    title: sc.content?.subject ?? sc.content?.senderName ?? sc.content?.filename ?? '',
    level: sc.level,
    module: sc.module,
    phase: ph,
    correctAnswer: sc.isPhishing !== false ? 'phishing' : 'legit',
    timerDuration: ph === 'question' ? timerDuration : null,
    timerStartedAt: ph === 'question' && timerDuration ? Date.now() : null,
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HostRoom() {
  const { code } = useParams()
  const navigate = useNavigate()

  // Lobby settings
  const [levelOptionId, setLevelOptionId] = useState('all')
  const [timerDuration, setTimerDuration] = useState(null)
  const [questionCount, setQuestionCount] = useState(null)

  // Game state
  const [scenarios, setScenarios]           = useState([])
  const [scenarioIndex, setScenarioIndex]   = useState(0)
  const [phase, setPhase]                   = useState('lobby')
  const [players, setPlayers]               = useState({})
  const [votes, setVotes]                   = useState({})
  const [scores, setScores]                 = useState({})
  const [copied, setCopied]                 = useState(false)
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [timeLeft, setTimeLeft]             = useState(null)

  const channelRef      = useRef(null)
  const scenariosRef    = useRef([])
  const scenarioRef     = useRef(null)
  const phaseRef        = useRef('lobby')
  const votesRef        = useRef({})
  const timerRef        = useRef(null)
  const timerDurationRef = useRef(null)

  const scenario = scenarios[scenarioIndex] ?? null
  useEffect(() => { scenarioRef.current = scenario }, [scenario])
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { votesRef.current = votes }, [votes])
  useEffect(() => { timerDurationRef.current = timerDuration }, [timerDuration])

  const joinUrl = `${window.location.origin}/join?code=${code}`

  // ── Timer helpers ──────────────────────────────────────────────────────────

  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(null)
  }

  function startTimer(duration) {
    stopTimer()
    if (!duration) return
    setTimeLeft(duration)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => () => stopTimer(), [])

  // ── Broadcast ──────────────────────────────────────────────────────────────

  function broadcastState(sc, ph, timer) {
    if (!channelRef.current) return
    channelRef.current.send({
      type: 'broadcast',
      event: 'game_state',
      payload: buildPayload(sc, ph, timer ?? timerDurationRef.current),
    })
  }

  // ── Supabase channel ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!supabase) return
    const channel = supabase.channel(`room:${code}`, {
      config: { presence: { key: 'host' } },
    })
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setPlayers(prev => {
          const next = {}
          Object.values(state).flat().forEach(p => {
            if (p.role === 'player')
              next[p.playerId] = { name: p.name, voted: prev[p.playerId]?.voted ?? false }
          })
          return next
        })
      })
      .on('broadcast', { event: 'vote' }, ({ payload }) => {
        const { playerId, name, vote } = payload
        setVotes(prev => ({ ...prev, [playerId]: vote }))
        setPlayers(prev => ({ ...prev, [playerId]: { name: name ?? prev[playerId]?.name ?? playerId, voted: true } }))
      })
      .on('broadcast', { event: 'request_state' }, () => {
        broadcastState(scenarioRef.current, phaseRef.current)
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ role: 'host' })
          broadcastState(null, 'lobby')
        }
      })
    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [code])

  // ── Game controls ──────────────────────────────────────────────────────────

  function accumulateScores(currentVotes, currentScenario) {
    if (!currentScenario) return
    const correct = currentScenario.isPhishing !== false ? 'phishing' : 'legit'
    setScores(prev => {
      const next = { ...prev }
      Object.entries(currentVotes).forEach(([pid, vote]) => {
        const name = players[pid]?.name ?? pid
        if (!next[pid]) next[pid] = { playerId: pid, name, correct: 0, answered: 0 }
        next[pid] = { ...next[pid], name, answered: next[pid].answered+1, correct: next[pid].correct+(vote===correct?1:0) }
      })
      return next
    })
  }

  function startGame() {
    const lvls     = LEVEL_OPTIONS.find(o => o.id === levelOptionId)?.levels ?? ['easy','medium','hard']
    const filtered = ALL_SCENARIOS.filter(s => lvls.includes(s.level))
    if (filtered.length === 0) return
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    const final    = questionCount ? shuffled.slice(0, questionCount) : shuffled
    setScenarios(final)
    scenariosRef.current = final
    setScenarioIndex(0)
    setVotes({})
    setPhase('question')
    phaseRef.current = 'question'
    startTimer(timerDuration)
    broadcastState(filtered[0], 'question', timerDuration)
  }

  function goNext() {
    const sc  = scenariosRef.current
    const next = scenarioIndex + 1
    if (next >= sc.length) return
    accumulateScores(votesRef.current, scenario)
    setScenarioIndex(next)
    setVotes({})
    setPhase('question')
    phaseRef.current = 'question'
    setPlayers(prev => {
      const reset = {}
      Object.keys(prev).forEach(id => { reset[id] = { ...prev[id], voted: false } })
      return reset
    })
    startTimer(timerDurationRef.current)
    broadcastState(sc[next], 'question', timerDurationRef.current)
  }

  function goPrev() {
    if (scenarioIndex === 0) return
    const sc   = scenariosRef.current
    const prev = scenarioIndex - 1
    setScenarioIndex(prev)
    setVotes({})
    setPhase('question')
    phaseRef.current = 'question'
    setPlayers(p => {
      const reset = {}
      Object.keys(p).forEach(id => { reset[id] = { ...p[id], voted: false } })
      return reset
    })
    startTimer(timerDurationRef.current)
    broadcastState(sc[prev], 'question', timerDurationRef.current)
  }

  function toggleReveal() {
    const next = phase === 'question' ? 'reveal' : 'question'
    if (next === 'reveal') stopTimer()
    else startTimer(timerDurationRef.current)
    setPhase(next)
    phaseRef.current = next
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

  // ── Guards ─────────────────────────────────────────────────────────────────

  if (!supabaseReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-2xl mb-3">⚙️</p>
          <p className="text-slate-700 font-semibold mb-1">Multijugador no configurado</p>
          <p className="text-slate-400 text-sm">Falta la clave de Supabase en el entorno.</p>
        </div>
      </div>
    )
  }

  if (phase === 'lobby') {
    return (
      <LobbyScreen
        code={code} joinUrl={joinUrl}
        players={players} onStart={startGame}
        copied={copied} onCopy={copyCode}
        levelOptionId={levelOptionId} onLevelOption={setLevelOptionId}
        timerDuration={timerDuration} onTimer={setTimerDuration}
        questionCount={questionCount} onQuestionCount={setQuestionCount}
      />
    )
  }

  if (!scenario) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-400">No hay más escenarios</p></div>
  }

  // ── Game view ──────────────────────────────────────────────────────────────

  const View        = VIEWS[scenario.module]
  const playerList  = Object.values(players)
  const totalVoters = playerList.length
  const phishingCnt = Object.values(votes).filter(v => v === 'phishing').length
  const legitCnt    = Object.values(votes).filter(v => v === 'legit').length
  const votedCnt    = phishingCnt + legitCnt
  const isPhishing  = scenario.isPhishing !== false
  const isLast      = scenarioIndex >= scenarios.length - 1
  const lvlStyle    = LEVEL_STYLE[scenario.level] ?? LEVEL_STYLE.medium

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {showScoreboard && (
        <Scoreboard scores={scores} total={scenarioIndex+1} onClose={() => setShowScoreboard(false)} />
      )}

      {/* Top bar */}
      <div className="flex-shrink-0 h-11 bg-white border-b border-slate-200 flex items-center px-4 gap-3">
        <button onClick={() => navigate('/')} className="hover:opacity-70 transition-opacity flex-shrink-0">
          <WordMark size={14} dark={false} />
        </button>
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest">
          <span className="text-slate-400">{scenario.module === 'email' ? 'Email' : scenario.module === 'sms' ? 'SMS / WA' : 'Archivo'}</span>
          <span className="text-slate-300">·</span>
          <span className={lvlStyle.text}>{lvlStyle.label}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">{scenarioIndex+1}/{scenarios.length}</span>
        </div>
        <div className="flex-1" />
        <TimerCircle timeLeft={timeLeft} total={timerDuration} />
        <button onClick={openScoreboard} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-400 hover:text-amber-600 text-xs font-semibold transition-colors">
          <Trophy size={12} /> Marcador
        </button>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <Users size={13} /><span>{totalVoters}</span>
        </div>
        <button onClick={copyCode} className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-2.5 py-1.5 text-indigo-600 font-mono font-bold text-xs transition-colors">
          {code}{copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} className="text-indigo-400" />}
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">

        {/* Scenario view — main area */}
        <div className="flex-1 overflow-hidden relative">
          {View && <View scenario={scenario} />}
        </div>

        {/* Right sidebar */}
        <div className="w-72 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-y-auto">

          {/* Mini QR + players */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm flex-shrink-0">
                <QRCodeSVG value={joinUrl} size={64} level="M" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Jugadores ({totalVoters})</p>
                {playerList.length === 0
                  ? <p className="text-xs text-slate-300">Nadie conectado</p>
                  : <div className="flex flex-wrap gap-1">
                      {playerList.map((p,i) => (
                        <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          p.voted ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.voted ? 'bg-indigo-400' : 'bg-slate-300'}`} />
                          {p.name}
                        </span>
                      ))}
                    </div>
                }
              </div>
            </div>
          </div>

          {/* Vote bars */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Votos</p>
              <span className="text-[10px] text-slate-400">{votedCnt}/{totalVoters}</span>
            </div>
            <div className="flex flex-col gap-2">
              <VoteBar label="🎣 Phishing" count={phishingCnt} total={Math.max(totalVoters,1)} color="text-rose-600"    bg="bg-rose-400" />
              <VoteBar label="✓ Legítimo"  count={legitCnt}    total={Math.max(totalVoters,1)} color="text-emerald-600" bg="bg-emerald-400" />
            </div>
          </div>

          {/* Reveal answer */}
          {phase === 'reveal' && (
            <div className={`mx-4 my-3 rounded-xl border p-3 flex items-center gap-3 ${isPhishing ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <span className="text-2xl">{isPhishing ? '🎣' : '✅'}</span>
              <div>
                <p className={`text-sm font-bold ${isPhishing ? 'text-rose-700' : 'text-emerald-700'}`}>
                  Era {isPhishing ? 'Phishing' : 'Legítimo'}
                </p>
                <p className={`text-[10px] mt-0.5 ${isPhishing ? 'text-rose-500' : 'text-emerald-600'}`}>
                  {isPhishing
                    ? `${phishingCnt} detectaron · ${legitCnt} cayeron`
                    : `${legitCnt} correctos · ${phishingCnt} falso positivo`}
                </p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="p-4 flex items-center gap-2 mt-auto border-t border-slate-100">
            <button onClick={goPrev} disabled={scenarioIndex===0}
              className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-white flex-shrink-0">
              <ChevronLeft size={16} />
            </button>
            <button onClick={toggleReveal}
              className={`flex items-center gap-1.5 flex-1 justify-center px-3 py-2 rounded-xl border font-semibold text-xs transition-all ${
                phase==='reveal'
                  ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
              }`}>
              {phase==='reveal' ? <EyeOff size={13}/> : <Eye size={13}/>}
              {phase==='reveal' ? 'Ocultar' : 'Revelar'}
            </button>
            {isLast
              ? <button onClick={openScoreboard}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-xs transition-colors flex-shrink-0">
                  <Trophy size={13}/> Final
                </button>
              : <button onClick={goNext}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors flex-shrink-0">
                  Sig. <ChevronRight size={13}/>
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
