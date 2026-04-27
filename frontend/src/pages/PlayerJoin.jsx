import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WordMark } from '../components/ui/PhishLensLogo'

export function PlayerJoin() {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  function handleJoin(e) {
    e.preventDefault()
    const clean = code.trim().toUpperCase().replace(/\s/g, '')
    if (!clean) return
    const displayName = name.trim() || 'Anónimo'
    sessionStorage.setItem('phishlens_display_name', displayName)
    navigate(`/join/${clean}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <div className="mb-10">
        <WordMark size={22} dark={false} />
      </div>

      <form onSubmit={handleJoin} className="w-full max-w-sm flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Tu nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Carlos"
            maxLength={20}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Código de sala
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="EAGLE-4821"
            autoFocus
            required
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-indigo-600 placeholder-slate-400 text-xl font-mono tracking-widest text-center focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors uppercase"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm tracking-wide transition-colors"
        >
          Unirme a la sala →
        </button>
      </form>

      <p className="mt-8 text-xs text-slate-400 text-center">
        El presentador compartirá el código contigo
      </p>
    </div>
  )
}
