import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, RotateCcw } from 'lucide-react'
import { WordMark } from '../components/ui/PhishLensLogo'
import { analyzePhishing } from '../lib/phishingDetector'
import { useDarkMode } from '../hooks/useDarkMode'

// ─── Config ────────────────────────────────────────────────────────────────

const VERDICT = {
  phishing:   { label: 'Phishing detectado',           color: '#dc2626', border: '#fca5a5', dot: '#dc2626' },
  suspicious: { label: 'Contenido sospechoso',          color: '#d97706', border: '#fcd34d', dot: '#d97706' },
  legitimate: { label: 'Sin indicadores de riesgo',     color: '#16a34a', border: '#86efac', dot: '#16a34a' },
}

const SEVERITY = {
  high:   { label: 'ALTO',  color: '#b91c1c', bg: '#fef2f2', text: '#991b1b' },
  medium: { label: 'MEDIO', color: '#b45309', bg: '#fffbeb', text: '#92400e' },
  low:    { label: 'BAJO',  color: '#0369a1', bg: '#f0f9ff', text: '#075985' },
  info:   { label: 'INFO',  color: '#4b5563', bg: '#f9fafb', text: '#374151' },
}

const HAS_KEY = !!import.meta.env.VITE_GROQ_KEY

const HISTORY_KEY = 'phishlens_detector_history'
const MAX_HISTORY = 10

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}

function saveHistory(entries) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries)) } catch {}
}

// ─── Sub-components ────────────────────────────────────────────────────────

function TopBar({ onHome, dark, onToggleDark }) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4">
      <button
        onClick={onHome}
        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm"
      >
        <ArrowLeft size={15} />
        Inicio
      </button>
      <div className="w-px h-4 bg-slate-200" />
      <WordMark size={14} dark={false} />
      <div className="ml-auto">
        <button onClick={onToggleDark} className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors text-sm">
          {dark ? '☀' : '☾'}
        </button>
      </div>
    </div>
  )
}

function TabBar({ tab, setTab }) {
  return (
    <div className="flex border-b border-slate-100">
      {[
        { id: 'text',  label: 'Texto' },
        { id: 'image', label: 'Captura de pantalla' },
      ].map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setTab(id)}
          className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
            tab === id
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function DropZone({ imagePreview, onFile, onClear }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) onFile(file)
  }, [onFile])

  if (imagePreview) {
    return (
      <div className="relative group">
        <img src={imagePreview} alt="Captura" className="w-full max-h-80 object-contain bg-slate-50" />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <RotateCcw size={14} className="text-slate-500" />
        </button>
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 py-14 cursor-pointer transition-colors ${
        dragging ? 'bg-indigo-50' : 'bg-white hover:bg-slate-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files[0]; if (f) onFile(f) }}
      />
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
        dragging ? 'bg-indigo-100' : 'bg-slate-100'
      }`}>
        <Upload size={22} className={dragging ? 'text-indigo-500' : 'text-slate-400'} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">Arrastra una captura o haz clic para seleccionar</p>
        <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP — máx. 10 MB</p>
      </div>
    </div>
  )
}

function Spinner({ retryIn }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        {retryIn ? (
          <>
            <p className="text-sm font-medium text-slate-700">Límite alcanzado — reintentando…</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Próximo intento en <span className="font-semibold text-indigo-500">{retryIn}s</span>
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-700">Analizando contenido…</p>
            <p className="text-xs text-slate-400 mt-0.5">Procesando con IA</p>
          </>
        )}
      </div>
    </div>
  )
}

function ConfidenceArc({ value, verdict }) {
  const risk = verdict === 'legitimate' ? 100 - value : value
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - risk / 100)
  const color = VERDICT[verdict]?.color ?? '#d97706'

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-slate-700">{risk}%</span>
      </div>
    </div>
  )
}

function ResultCard({ result, onReset }) {
  const v = VERDICT[result.verdict] ?? VERDICT.suspicious
  const highCount = result.indicators.filter((i) => i.severity === 'high').length

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Verdict header */}
      <div className="flex items-center gap-5 px-6 py-5" style={{ borderLeft: `4px solid ${v.border}` }}>
        <ConfidenceArc value={result.confidence} verdict={result.verdict} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: v.dot }} />
            <span className="font-semibold text-slate-900">{v.label}</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {/* Indicators header */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-t border-b border-slate-100">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Indicadores
        </span>
        <div className="flex items-center gap-3">
          {highCount > 0 && (
            <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              {highCount} alto{highCount !== 1 ? 's' : ''}
            </span>
          )}
          <span className="text-[11px] text-slate-400">{result.indicators.length} total</span>
        </div>
      </div>

      {/* Indicator rows */}
      <div className="divide-y divide-slate-100">
        {result.indicators.map((ind, i) => {
          const s = SEVERITY[ind.severity] ?? SEVERITY.info
          return (
            <div key={i} className="px-6 py-4">
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide"
                  style={{ color: s.text, background: s.bg }}
                >
                  {s.label}
                </span>
                <span className="text-sm font-medium text-slate-800">{ind.category}</span>
                {ind.finding && (
                  <code className="ml-auto text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded max-w-xs truncate">
                    {ind.finding}
                  </code>
                )}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-4">{ind.explanation}</p>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Resultado orientativo — no sustituye a un análisis profesional
        </p>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RotateCcw size={12} />
          Nuevo análisis
        </button>
      </div>
    </div>
  )
}

// ─── History ──────────────────────────────────────────────────────────────

const VERDICT_MINI = {
  phishing:   { label: 'Phishing',   dot: '#dc2626', bg: '#fef2f2', text: '#b91c1c' },
  suspicious: { label: 'Sospechoso', dot: '#d97706', bg: '#fffbeb', text: '#92400e' },
  legitimate: { label: 'Legítimo',   dot: '#16a34a', bg: '#f0fdf4', text: '#15803d' },
}

function HistorySection({ history, onRestore, onClear }) {
  if (history.length === 0) return null
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Análisis recientes</span>
        <button onClick={onClear} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
          Borrar historial
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {history.map((entry) => {
          const v = VERDICT_MINI[entry.verdict] ?? VERDICT_MINI.suspicious
          return (
            <button
              key={entry.id}
              onClick={() => onRestore(entry)}
              className="w-full text-left bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: v.dot }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 truncate">{entry.preview}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: v.bg, color: v.text }}>
                  {v.label}
                </span>
                <span className="text-[10px] text-slate-400">{entry.date}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────

export function DetectorPage() {
  const navigate = useNavigate()
  const { dark, toggle: toggleDark } = useDarkMode()
  const [tab, setTab] = useState('text')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [status, setStatus] = useState('idle')  // idle | loading | done | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [retryIn, setRetryIn] = useState(null)
  const [history, setHistory] = useState(loadHistory)
  const countdownRef = useRef(null)

  function handleFile(file) {
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  function clearImage() {
    setImageFile(null)
    setImagePreview(null)
  }

  function reset() {
    setStatus('idle')
    setResult(null)
    setError(null)
    setRetryIn(null)
    clearInterval(countdownRef.current)
    setText('')
    clearImage()
  }

  function startCountdown(seconds) {
    setRetryIn(seconds)
    clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setRetryIn((s) => {
        if (s <= 1) { clearInterval(countdownRef.current); return null }
        return s - 1
      })
    }, 1000)
  }

  async function analyze() {
    if (status === 'loading') return
    setStatus('loading')
    setError(null)
    setResult(null)

    try {
      let imageB64 = null
      if (imageFile) {
        imageB64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result.split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(imageFile)
        })
      }
      const data = await analyzePhishing({ text: text.trim() || null, image: imageB64, onRetry: startCountdown })
      setResult(data)
      setStatus('done')
      const entry = {
        id: Date.now(),
        verdict: data.verdict,
        preview: text.trim()
          ? text.trim().slice(0, 80)
          : '📷 Captura de pantalla',
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        result: data,
      }
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, MAX_HISTORY)
        saveHistory(next)
        return next
      })
    } catch (e) {
      setError(e.message || 'Error al analizar el contenido')
      setStatus('error')
    }
  }

  const canAnalyze = (tab === 'text' && text.trim().length > 10) || (tab === 'image' && imageFile)

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <TopBar onHome={() => navigate('/')} dark={dark} onToggleDark={toggleDark} />

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Detector de Phishing con IA</h1>
          <p className="text-slate-500 text-sm">
            Pega el texto de un mensaje sospechoso o sube una captura de pantalla.
            La IA detecta los indicadores de ataque y te explica cada uno.
          </p>
        </div>

        {/* Demo mode notice */}
        {!HAS_KEY && (
          <div className="mb-5 flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-amber-500 text-base flex-shrink-0">◎</span>
            <p className="text-xs text-amber-700">
              <strong>Modo demo</strong> — Añade{' '}
              <code className="font-mono bg-amber-100 px-1 rounded">VITE_GROQ_KEY</code>{' '}
              en tu <code className="font-mono bg-amber-100 px-1 rounded">.env</code> para análisis real con IA.
            </p>
          </div>
        )}

        {/* Input card */}
        {status !== 'done' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <TabBar tab={tab} setTab={(t) => { setTab(t); clearImage(); setText('') }} />

            {status === 'loading' ? (
              <Spinner retryIn={retryIn} />
            ) : tab === 'text' ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Pega aquí el contenido del SMS, correo electrónico o mensaje…"
                rows={7}
                className="w-full px-5 py-4 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none"
              />
            ) : (
              <DropZone imagePreview={imagePreview} onFile={handleFile} onClear={clearImage} />
            )}

            {status !== 'loading' && (
              <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                  El contenido se procesa por Groq y no se almacena en nuestros servidores.
                </p>
                <button
                  onClick={analyze}
                  disabled={!canAnalyze}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    canAnalyze
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Analizar →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between mb-6">
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={reset} className="text-xs text-red-500 hover:text-red-700 font-medium ml-4">
              Reintentar
            </button>
          </div>
        )}

        {/* Results */}
        {status === 'done' && result && (
          <ResultCard result={result} onReset={reset} />
        )}

        <HistorySection
          history={history}
          onRestore={(entry) => {
            setResult(entry.result)
            setStatus('done')
          }}
          onClear={() => {
            setHistory([])
            saveHistory([])
          }}
        />
      </div>
    </div>
  )
}
