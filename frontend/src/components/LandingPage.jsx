import { ArrowRight, Mail, MessageCircle, FolderOpen } from 'lucide-react'

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

// ── Mini preview cards for the hero mosaic ────────────────────────────────

function Badge({ phishing }) {
  return (
    <span
      className="absolute -top-2 -right-2 text-[7px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap"
      style={{ background: phishing ? '#ef4444' : '#22c55e', color: '#fff' }}
    >
      {phishing ? '⚠ Phishing' : '✓ Legítimo'}
    </span>
  )
}

function MiniCard({ children, rotate, left, top, phishing }) {
  return (
    <div
      className="absolute bg-white rounded-xl shadow-md border border-gray-100 p-3 w-40 select-none"
      style={{ transform: `rotate(${rotate}deg)`, left, top }}
    >
      {children}
      <Badge phishing={phishing} />
    </div>
  )
}

function HeroMosaic() {
  return (
    <div
      className="relative rounded-3xl overflow-hidden flex-shrink-0"
      style={{ width: 480, height: 320, background: '#E8F0FE' }}
      aria-hidden="true"
    >
      {/* Decorative floating accents */}
      <div className="absolute w-4 h-4 rounded-full border-2 border-yellow-400 opacity-70" style={{ top: 18, right: 42 }} />
      <div className="absolute w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-60" style={{ bottom: 28, left: 22 }} />
      <div className="absolute text-red-400 font-black opacity-50 text-sm" style={{ top: 10, left: 148 }}>⚠</div>
      <div className="absolute text-blue-300 font-black opacity-30 text-2xl" style={{ top: 6, left: 6 }}>@</div>
      <div className="absolute w-3 h-3 rounded-full border-2 border-blue-300 opacity-40" style={{ bottom: 14, right: 22 }} />
      <div className="absolute text-red-400 opacity-40 text-sm font-bold" style={{ bottom: 55, right: 48 }}>×</div>
      <div className="absolute w-2 h-2 rounded-full bg-blue-300 opacity-40" style={{ top: 68, right: 14 }} />
      <div className="absolute text-yellow-400 opacity-30 font-black text-lg" style={{ bottom: 20, right: 130 }}>$</div>

      {/* Card 1: Email phishing (fake Google) */}
      <MiniCard left={15} top={22} rotate={-6} phishing={true}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-[#4285f4] flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0">G</div>
          <div className="min-w-0">
            <div className="text-[8px] font-semibold text-gray-800 leading-none">Google</div>
            <div className="text-[7px] text-gray-400 font-mono truncate">g00gle-security.com</div>
          </div>
        </div>
        <div className="text-[8px] text-gray-700 font-medium mb-1.5 truncate">Alerta: Acceso sospechoso</div>
        <div className="bg-[#1a73e8] text-white text-[7px] text-center py-1 rounded-md">Verificar cuenta →</div>
      </MiniCard>

      {/* Card 2: SMS legítimo (Amazon) */}
      <MiniCard left={183} top={12} rotate={4} phishing={false}>
        <div className="text-[7px] text-gray-500 font-semibold mb-1.5 tracking-wide uppercase">Amazon</div>
        <div className="bg-gray-100 rounded-xl rounded-tl-none px-2 py-1.5 mb-1.5">
          <div className="text-[7px] text-gray-700 leading-relaxed">Tu pedido #303-784... en camino. Entrega hoy.</div>
        </div>
        <div className="text-[7px] text-blue-500 font-mono truncate underline">amazon.es/orders/...</div>
      </MiniCard>

      {/* Card 3: Archivo phishing (.exe) */}
      <MiniCard left={326} top={62} rotate={-8} phishing={true}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base leading-none flex-shrink-0">📄</span>
          <div className="min-w-0">
            <div className="text-[7px] font-mono text-gray-800 truncate">PREMIO_RECLAMA.exe</div>
            <div className="text-[7px] text-gray-400">Aplicación · 892 KB</div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-1 text-[7px] text-gray-400">25/04/2026</div>
      </MiniCard>

      {/* Card 4: Email legítimo (El País) */}
      <MiniCard left={35} top={188} rotate={3} phishing={false}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0">E</div>
          <div className="min-w-0">
            <div className="text-[8px] font-semibold text-gray-800 leading-none">El País</div>
            <div className="text-[7px] text-gray-400 font-mono truncate">newsletters.elpais.com</div>
          </div>
        </div>
        <div className="text-[8px] text-gray-600 truncate">Tu resumen — 25 de abril</div>
      </MiniCard>

      {/* Card 5: WhatsApp phishing (BBVA) */}
      <MiniCard left={196} top={192} rotate={-5} phishing={true}>
        <div className="text-[7px] text-[#128C7E] font-semibold mb-1.5">BBVA · WhatsApp</div>
        <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none px-2 py-1.5 mb-1.5">
          <div className="text-[7px] text-gray-700">Tarjeta bloqueada. Verifica:</div>
        </div>
        <div className="text-[7px] text-blue-500 font-mono truncate underline">bbva.es-cliente-seguro.com</div>
      </MiniCard>
    </div>
  )
}

// ── Landing page ───────────────────────────────────────────────────────────

export function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e0f2fe', border: '1px solid #bae6fd' }}>
            <span className="text-[10px] font-black text-cyan-600">PL</span>
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight">PhishLens</span>
        </div>
        <a
          href="https://github.com/javiernglz/phishlens"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-sm"
        >
          <GithubIcon size={16} />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 pt-12 pb-20 flex flex-col lg:flex-row items-center gap-14">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-xs font-semibold text-cyan-600 uppercase tracking-widest mb-5">
            Simulador interactivo · Ciberseguridad
          </p>
          <h1 className="text-5xl lg:text-[3.6rem] font-black leading-[1.1] tracking-tight mb-6 text-slate-900">
            ¿Tu audiencia<br />caería en<br />el anzuelo?
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-sm mx-auto lg:mx-0">
            Simula correos, mensajes y archivos maliciosos en pantalla grande. El público vota, tú revelas la verdad.
          </p>
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-slate-700 transition-all duration-200"
          >
            Empezar demo
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mosaic — hidden on mobile */}
        <div className="hidden lg:flex flex-shrink-0 justify-center">
          <HeroMosaic />
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '18', label: 'Escenarios' },
            { n: '3',  label: 'Módulos' },
            { n: '50%', label: 'Son legítimos' },
            { n: '3',  label: 'Niveles de dificultad' },
          ].map(({ n, label }) => (
            <div key={label}>
              <div className="text-3xl font-black text-slate-900 mb-1">{n}</div>
              <div className="text-xs text-slate-400 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Cómo funciona</h2>
          <p className="text-slate-400 text-sm">Tres pasos para una charla que el público no olvida</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: '01',
              title: 'Elige el escenario',
              desc: 'Email, SMS, WhatsApp o archivo. Elige la dificultad según tu audiencia. La interfaz aparece en pantalla, idéntica a la aplicación real.',
              color: '#0891b2',
            },
            {
              n: '02',
              title: 'La audiencia vota',
              desc: 'Legítimo o phishing — sin segunda oportunidad. La mitad de los escenarios son legítimos, así que nadie puede adivinar sistemáticamente.',
              color: '#7c3aed',
            },
            {
              n: '03',
              title: 'X-Ray revela la verdad',
              desc: 'El escáner ilumina cada señal de ataque con bordes de colores. Los hotspots explican la técnica. El aprendizaje se fija porque ellos mismos cayeron.',
              color: '#ea580c',
            },
          ].map(({ n, title, desc, color }) => (
            <div key={n} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-slate-200 transition-colors">
              <div className="text-5xl font-black mb-4" style={{ color, opacity: 0.12 }}>{n}</div>
              <h3 className="text-base font-bold mb-2 text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODULES ────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Tres módulos</h2>
            <p className="text-slate-400 text-sm">Cada uno replica fielmente la interfaz real</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: Mail,
                title: 'Email',
                color: '#4285f4',
                count: 6,
                tag: 'Gmail',
                desc: 'Dominios homógrafos, spoofing y spear phishing. El hover sobre los botones revela la URL real oculta.',
              },
              {
                Icon: MessageCircle,
                title: 'SMS / WhatsApp',
                color: '#22c55e',
                count: 9,
                tag: 'iMessage + WhatsApp',
                desc: 'Smishing bancario, cadenas virales, confianza prestada y link previews con marca corporativa manipulada.',
              },
              {
                Icon: FolderOpen,
                title: 'Archivos',
                color: '#f59e0b',
                count: 5,
                tag: 'Finder macOS',
                desc: '.exe obvios, doble extensión .pdf.exe e iconos de Word sobre archivos .scr ejecutables.',
              },
            ].map(({ Icon, title, color, count, tag, desc }) => (
              <div key={title} className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-slate-200 transition-colors">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${color}12`, color, border: `1px solid ${color}30` }}>
                    {count} escenarios
                  </span>
                </div>
                <h3 className="text-base font-bold mb-1 text-slate-900">{title}</h3>
                <div className="text-[10px] text-slate-400 font-medium mb-3 uppercase tracking-wider">{tag}</div>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">¿Listo para la demo?</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          Sin registro. Sin instalación. Abre y empieza en segundos.
        </p>
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-10 py-4 rounded-full text-sm hover:bg-slate-700 transition-all duration-200"
        >
          Empezar demo
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-6 text-center">
        <p className="text-xs text-slate-400">
          PhishLens · Herramienta educativa de ciberseguridad ·{' '}
          <a href="https://github.com/javiernglz/phishlens" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
