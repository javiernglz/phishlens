import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { WordMark } from '../components/ui/PhishLensLogo'

export function PlayerJoin() {
  const [searchParams] = useSearchParams()
  const preCode = searchParams.get('code') ?? ''

  const [code, setCode] = useState(preCode)
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="mb-10">
        <WordMark size={22} dark={true} />
      </div>

      <form onSubmit={handleJoin} className="w-full max-w-sm flex flex-col gap-4">
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
            autoFocus
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
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
            required
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3.5 text-indigo-400 placeholder-slate-500 text-xl font-mono tracking-widest text-center focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors uppercase"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-sm tracking-wide transition-all"
        >
          Unirme a la sala →
        </button>
      </form>

      <p className="mt-8 text-xs text-slate-600 text-center">
        El presentador compartirá el código contigo
      </p>
    </div>
  )
}
