import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HookIcon } from '../components/ui/PhishLensLogo'

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
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-6">
      <div className="flex items-center gap-2.5 mb-10">
        <HookIcon size={32} color="#22d3ee" strokeWidth={2.2} />
        <span className="text-2xl font-bold text-slate-100 tracking-tight">PhishLens</span>
      </div>

      <form
        onSubmit={handleJoin}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Tu nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Carlos"
            maxLength={20}
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Código de sala
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="EAGLE-4821"
            autoFocus
            required
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3.5 text-cyan-300 placeholder-slate-600 text-xl font-mono tracking-widest text-center focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-colors uppercase"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-colors"
        >
          Unirme a la sala
        </button>
      </form>

      <p className="mt-8 text-xs text-slate-600 text-center">
        El presentador compartirá el código contigo
      </p>
    </div>
  )
}
