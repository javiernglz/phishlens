import { useState, useEffect, useRef } from 'react'

// ── Global CSS ──────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  @keyframes fadeUp   { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:none } }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes detProgress { from{width:0} to{width:88%} }
  .fade-up { opacity:0; transform:translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
  .fade-up.in { opacity:1; transform:none; }
  .card-hover { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .card-hover:hover { transform: translateY(-4px); }
`

// ── Palette & Theme ─────────────────────────────────────────────────────────

const PALETTES = {
  cyan:   { accent:'#22d3ee', accentHov:'#67e8f9', glow:'rgba(34,211,238,0.07)',  dim:'rgba(34,211,238,0.10)',  line:'rgba(34,211,238,0.22)'  },
  indigo: { accent:'#818cf8', accentHov:'#a5b4fc', glow:'rgba(129,140,248,0.07)', dim:'rgba(129,140,248,0.10)', line:'rgba(129,140,248,0.22)' },
  cobalt: { accent:'#60a5fa', accentHov:'#93c5fd', glow:'rgba(96,165,250,0.07)',  dim:'rgba(96,165,250,0.10)',  line:'rgba(96,165,250,0.22)'  },
}

function mkTheme(dark, palette) {
  const p = PALETTES[palette] || PALETTES.indigo
  if (dark) return {
    bg:'#070e1c', bgAlt:'#0b1628', bgCard:'rgba(255,255,255,0.035)',
    bgCardHov:'rgba(255,255,255,0.06)', border:'rgba(255,255,255,0.08)',
    borderMed:'rgba(255,255,255,0.13)', text:'#eef4ff',
    muted:'rgba(148,163,184,0.85)', sub:'rgba(100,116,139,0.65)',
    danger:'#f87171', success:'#4ade80', shadow:'0 24px 60px rgba(0,0,0,0.55)',
    shadowSm:'0 4px 16px rgba(0,0,0,0.4)', isDark:true,
    accentGlow: p.glow.replace('0.07','0.22'),
    accentDim: p.dim, accentLine: p.line,
    ...p,
  }
  return {
    bg:'#ffffff', bgAlt:'#f5f8fd', bgCard:'rgba(0,0,0,0.025)',
    bgCardHov:'rgba(0,0,0,0.045)', border:'rgba(0,0,0,0.07)',
    borderMed:'rgba(0,0,0,0.12)', text:'#0b1928',
    muted:'rgba(51,65,85,0.85)', sub:'rgba(100,116,139,0.7)',
    danger:'#ef4444', success:'#16a34a', shadow:'0 8px 32px rgba(0,0,0,0.09)',
    shadowSm:'0 2px 10px rgba(0,0,0,0.07)', isDark:false,
    accent:p.accent, accentHov:p.accentHov,
    glow:p.glow.replace('0.07','0.05'), dim:p.dim.replace('0.10','0.07'), line:p.line.replace('0.22','0.16'),
    accentGlow: p.glow.replace('0.07','0.14'),
    accentDim: p.dim.replace('0.10','0.07'), accentLine: p.line.replace('0.22','0.16'),
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function useInView(opts = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.12, ...opts })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function Btn({ children, onClick, variant = 'primary', t, style = {} }) {
  const [hov, setHov] = useState(false)
  const base = {
    display:'inline-flex', alignItems:'center', gap:8, fontWeight:700,
    fontSize:14, padding:'12px 24px', borderRadius:8, cursor:'pointer',
    letterSpacing:'-0.01em', transition:'all 0.18s', border:'none',
    fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif",
    ...style,
  }
  const styles = {
    primary: { background: hov ? t.accentHov : t.accent, color: t.isDark ? '#07111f' : '#fff' },
    ghost:   { background: hov ? t.bgCardHov : t.bgCard, color: t.text, border:`1px solid ${t.border}` },
    blue:    { background: hov ? '#fcd34d' : '#fde68a', color:'#78350f' },
  }
  return (
    <button onClick={onClick} style={{...base,...styles[variant]}}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}>
      {children}
    </button>
  )
}

// ── Logo ────────────────────────────────────────────────────────────────────

function Logo({ t, size = 20 }) {
  return (
    <span style={{display:'inline-flex',alignItems:'flex-end',fontSize:size,fontWeight:800,letterSpacing:'-0.04em',lineHeight:1,userSelect:'none'}}>
      <span style={{color:t.text}}>Ph</span>
      <svg width={size*0.52} height={size} viewBox="0 0 11 24" fill="none" style={{display:'inline-block',verticalAlign:'text-bottom'}}>
        <circle cx="5" cy="2.4" r="2.1" fill={t.accent}/>
        <path d="M5 6 L5 15.5 C5 21.5 11.5 21.5 11.5 15.5 L10 14" stroke={t.accent} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{color:t.text}}>sh</span>
      <span style={{color:t.accent,fontWeight:300}}>Lens</span>
    </span>
  )
}

// ── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ t, dark, onToggleDark }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      transition:'all 0.3s',
      background: scrolled ? (t.isDark ? 'rgba(7,14,28,0.88)' : 'rgba(255,255,255,0.88)') : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? `1px solid ${t.border}` : '1px solid transparent',
    }}>
      <div style={{maxWidth:1140,margin:'0 auto',padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Logo t={t} size={20} />
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <button onClick={onToggleDark} style={{
            width:34,height:34,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',
            background:t.bgCard,border:`1px solid ${t.border}`,color:t.muted,transition:'all 0.18s',cursor:'pointer',
          }}
            onMouseOver={e=>{e.currentTarget.style.background=t.bgCardHov;e.currentTarget.style.color=t.text}}
            onMouseOut={e=>{e.currentTarget.style.background=t.bgCard;e.currentTarget.style.color=t.muted}}>
            {dark ? '☀' : '☾'}
          </button>
          <a href="https://github.com/javiernglz/phishlens" target="_blank" rel="noopener noreferrer"
            style={{fontSize:12,fontWeight:600,color:t.sub,padding:'6px 12px',borderRadius:6,border:`1px solid ${t.border}`,
              background:t.bgCard,display:'flex',alignItems:'center',gap:6,transition:'all 0.18s',textDecoration:'none'}}
            onMouseOver={e=>{e.currentTarget.style.color=t.text;e.currentTarget.style.borderColor=t.borderMed}}
            onMouseOut={e=>{e.currentTarget.style.color=t.sub;e.currentTarget.style.borderColor=t.border}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            GitHub
          </a>
        </div>
      </div>
    </nav>
  )
}

// ── Hero Visual ──────────────────────────────────────────────────────────────

const HERO_SCENARIOS = [
  {
    module:'Email', level:'Difícil', num:'4/8',
    avatar:'G', avatarBg:'#1a73e8',
    from:'Google Security Alert',
    addr:'noreply@g00gle-accounts.com', addrDanger:true,
    subject:'Inicio de sesión bloqueado',
    body:'Detectamos un inicio de sesión sospechoso desde Moscú, Rusia. Verifica tu identidad de inmediato para proteger tu cuenta.',
    cta:'Verificar cuenta →',
  },
  {
    module:'SMS', level:'Medio', num:'2/6',
    avatar:'C', avatarBg:'#ea580c',
    from:'CORREOS España',
    addr:'+34 622 847 291', addrDanger:false,
    subject:'Tu paquete no pudo entregarse',
    body:'Para liberar tu envío abona 1,80€ de tasas de aduana antes de 24h: bit.ly/c0rR-3os',
    cta:null,
  },
]

function HeroVisual({ t }) {
  const [step, setStep] = useState(0)
  const [scenIdx, setScenIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 2400)
    const t2 = setTimeout(() => setStep(2), 3700)
    const t3 = setTimeout(() => {
      setVisible(false)
      const t4 = setTimeout(() => {
        setScenIdx(i => (i + 1) % HERO_SCENARIOS.length)
        setStep(0)
        setVisible(true)
      }, 380)
      return () => clearTimeout(t4)
    }, 6400)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [scenIdx])

  const s = HERO_SCENARIOS[scenIdx]
  const voted = step >= 1
  const showResult = step === 2

  return (
    <div style={{width:430, flexShrink:0, position:'relative', paddingLeft:36}}>
      <div style={{position:'absolute',inset:'-60px',background:`radial-gradient(ellipse 70% 60% at 50% 40%, ${t.accentGlow} 0%, transparent 70%)`,pointerEvents:'none'}}/>

      <div style={{display:'flex',justifyContent:'center',marginBottom:14}}>
        <div style={{
          display:'inline-flex',alignItems:'center',gap:6,
          padding:'5px 12px',borderRadius:6,
          background:t.isDark?'rgba(255,255,255,0.05)':'rgba(109,40,217,0.08)',
          border:`1px solid ${t.isDark?'rgba(255,255,255,0.1)':'rgba(109,40,217,0.2)'}`,
          fontSize:10.5,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',
          color:t.isDark?'rgba(148,163,184,0.8)':'#6d28d9',
        }}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'#4ade80',display:'inline-block',animation:'pulse 1.5s infinite'}}/>
          Simulador en vivo
        </div>
      </div>

      <div style={{
        position:'relative', borderRadius:20,
        background: t.isDark ? 'rgba(8,18,38,0.97)' : '#ffffff',
        border:`1px solid ${t.borderMed}`,
        boxShadow: t.shadow,
        overflow:'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition:'opacity 0.38s ease, transform 0.38s ease',
      }}>
        {/* Window chrome */}
        <div style={{
          display:'flex', alignItems:'center', padding:'10px 16px', gap:10,
          background: t.isDark ? 'rgba(255,255,255,0.025)' : '#f0f3f8',
          borderBottom:`1px solid ${t.border}`,
        }}>
          <div style={{display:'flex',gap:5}}>
            {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{width:9,height:9,borderRadius:'50%',background:c}}/>)}
          </div>
          <div style={{flex:1,display:'flex',justifyContent:'center',gap:2}}>
            {['Email','SMS','Archivo'].map(m => (
              <span key={m} style={{
                fontSize:10.5, fontWeight:600, padding:'3px 10px', borderRadius:5,
                transition:'all 0.35s',
                color: m===s.module ? t.accent : t.sub,
                background: m===s.module ? t.accentDim : 'transparent',
              }}>{m}</span>
            ))}
          </div>
          <span style={{fontSize:9.5,color:t.sub,fontFamily:'JetBrains Mono,monospace'}}>
            {s.num} · <span style={{color:t.accent,fontWeight:600}}>{s.level}</span>
          </span>
        </div>

        {/* Content body */}
        <div style={{padding:'22px 22px 16px', minHeight:195}}>
          <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:14}}>
            <div style={{width:38,height:38,borderRadius:'50%',background:s.avatarBg,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontWeight:800,flexShrink:0}}>{s.avatar}</div>
            <div>
              <div style={{fontSize:11.5,fontWeight:700,color:t.text,marginBottom:2}}>{s.from}</div>
              <div style={{fontSize:9,color:s.addrDanger?'#f87171':t.sub,fontFamily:'JetBrains Mono,monospace'}}>{s.addr}</div>
            </div>
          </div>
          <div style={{fontSize:13.5,fontWeight:700,color:t.text,marginBottom:9}}>{s.subject}</div>
          <div style={{fontSize:11.5,color:t.muted,lineHeight:1.65,marginBottom:s.cta?14:0}}>{s.body}</div>
          {s.cta && (
            <div style={{background:'#1a73e8',color:'#fff',fontSize:10.5,textAlign:'center',padding:'10px',borderRadius:7,fontWeight:600}}>
              {s.cta}
            </div>
          )}
        </div>

        {/* Vote / Result bar */}
        {showResult ? (
          <div style={{
            display:'flex', alignItems:'center', gap:12, padding:'14px 22px',
            background:'rgba(248,113,113,0.07)',
            borderTop:`1px solid rgba(248,113,113,0.22)`,
            animation:'fadeUp 0.32s ease',
          }}>
            <span style={{fontSize:22}}>✗</span>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:'#f87171'}}>¡Correcto! Era phishing.</div>
              <div style={{fontSize:10,color:t.sub,marginTop:2}}>Dominio falsificado · Urgencia artificial</div>
            </div>
          </div>
        ) : (
          <div style={{display:'flex',gap:8,padding:'12px 16px',borderTop:`1px solid ${t.border}`}}>
            <div style={{
              flex:1, padding:'10px', borderRadius:8, fontSize:12, fontWeight:700, textAlign:'center',
              background: voted ? 'transparent' : 'rgba(74,222,128,0.08)',
              color: voted ? t.sub : '#4ade80',
              border:`1px solid ${voted?t.border:'rgba(74,222,128,0.28)'}`,
              opacity: voted ? 0.3 : 1, transition:'all 0.5s ease',
            }}>✓ Legítimo</div>
            <div style={{
              flex:1, padding:'10px', borderRadius:8, fontSize:12, fontWeight:700, textAlign:'center',
              background: voted ? 'rgba(248,113,113,0.15)' : 'rgba(248,113,113,0.07)',
              color:'#f87171',
              border:`1px solid rgba(248,113,113,${voted?'0.45':'0.22'})`,
              transform: voted ? 'scale(1.03)' : 'none',
              boxShadow: voted ? '0 0 20px rgba(248,113,113,0.22)' : 'none',
              transition:'all 0.5s ease',
            }}>⚠ Phishing</div>
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div style={{display:'flex',justifyContent:'center',gap:6,marginTop:18}}>
        {HERO_SCENARIOS.map((_, i) => (
          <div key={i} style={{width:i===scenIdx?22:7,height:7,borderRadius:99,background:i===scenIdx?t.accent:t.border,transition:'all 0.45s ease'}}/>
        ))}
      </div>
      <div style={{textAlign:'center',marginTop:12,fontSize:13.5,fontWeight:700,letterSpacing:'-0.02em',color:t.isDark?'rgba(148,163,184,0.6)':'#7c3aed'}}>
        ¿Tú lo habrías detectado?
      </div>
    </div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ t, onStart, onHost }) {
  return (
    <section style={{
      minHeight:'100vh', background:t.bg, paddingTop:60,
      display:'flex', flexDirection:'column', justifyContent:'center',
      position:'relative', overflow:'hidden',
      fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* Glow */}
      <div style={{position:'absolute',top:'40%',left:'55%',transform:'translate(-50%,-50%)',width:800,height:500,borderRadius:'50%',background:`radial-gradient(ellipse,${t.isDark?t.glow.replace('0.07','0.22'):t.glow.replace('0.05','0.16')} 0%,transparent 65%)`,pointerEvents:'none'}}/>
      {/* Split right accent */}
      <div style={{position:'absolute',top:0,right:0,bottom:0,width:'42%',background:t.isDark?'linear-gradient(160deg,rgba(49,46,129,0.78) 0%,rgba(67,56,202,0.52) 100%)':'linear-gradient(160deg,#ede9fe 0%,#ddd6fe 100%)',clipPath:'polygon(7% 0%,100% 0%,100% 100%,0% 100%)',pointerEvents:'none'}}/>

      <div style={{maxWidth:1140,margin:'0 auto',padding:'60px 32px',display:'flex',alignItems:'center',gap:64,position:'relative',zIndex:2,width:'100%',boxSizing:'border-box'}}>
        <div style={{flex:1,minWidth:0}}>
          {/* Badge */}
          <div style={{display:'inline-flex',alignItems:'center',gap:7,background:t.dim,border:`1px solid ${t.line}`,borderRadius:6,padding:'5px 12px',marginBottom:28}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:t.accent,display:'inline-block',animation:'pulse 2s ease-in-out infinite'}}/>
            <span style={{fontSize:11,fontWeight:700,color:t.accent,letterSpacing:'0.07em',textTransform:'uppercase'}}>Simulador de phishing · Gratuito</span>
          </div>

          <h1 style={{fontSize:'clamp(2.6rem,4.5vw,4rem)',fontWeight:900,lineHeight:1.05,letterSpacing:'-0.04em',color:t.text,margin:'0 0 20px'}}>
            El phishing engaña<br/>a casi todos.
            <br/><span style={{color:t.accent}}>¿A ti también?</span>
          </h1>

          <p style={{fontSize:17,lineHeight:1.7,color:t.muted,margin:'0 0 36px',maxWidth:440}}>
            Simulaciones reales de correos, SMS y archivos maliciosos. Entrena tu instinto, juega en grupo y descubre cómo funcionan los ataques.
          </p>

          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:44}}>
            <Btn t={t} onClick={onStart} variant="primary">Empezar solo <span>→</span></Btn>
            <Btn t={t} onClick={onHost} variant="blue">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Multijugador
            </Btn>
          </div>

          {/* Stats + modules */}
          <div style={{borderTop:`1px solid ${t.border}`,paddingTop:24}}>
            <div style={{display:'flex',gap:0,marginBottom:18}}>
              {[{n:'20+',l:'escenarios'},{n:'3',l:'módulos'},{n:'∞',l:'partidas'}].map(({n,l},i) => (
                <div key={l} style={{paddingRight:28,marginRight:28,borderRight:i<2?`1px solid ${t.border}`:'none'}}>
                  <div style={{fontSize:22,fontWeight:800,color:t.text,letterSpacing:'-0.03em'}}>{n}</div>
                  <div style={{fontSize:11,color:t.sub,fontWeight:500,marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
              {[
                {label:'Email',    color:'#818cf8', icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>},
                {label:'SMS',      color:'#fb923c', icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
                {label:'Archivos', color:'#a78bfa', icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>},
              ].map(({label,color,icon}) => (
                <div key={label} style={{display:'inline-flex',alignItems:'center',gap:5,padding:'5px 12px',borderRadius:6,fontSize:12,fontWeight:600,background:`${color}15`,border:`1px solid ${color}30`,color}}>
                  {icon}{label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero visual — hidden on mobile */}
        <div className="hero-visual-wrap" style={{flexShrink:0,display:'none'}}>
          <HeroVisual t={t} />
        </div>
        <style>{`@media(min-width:900px){.hero-visual-wrap{display:block!important}}`}</style>
      </div>
    </section>
  )
}

// ── Features ─────────────────────────────────────────────────────────────────

function Features({ t }) {
  const [ref, inView] = useInView()

  const INDIGO = 'linear-gradient(145deg,#4338ca 0%,#6d28d9 100%)'
  const YELLOW = 'linear-gradient(145deg,#fde68a 0%,#fef9c3 100%)'

  const feats = [
    {
      n:'01', grad:INDIGO, light:false,
      icon:(
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2.5"/>
          <path d="M8 21h8M12 17v4"/>
          <rect x="5.5" y="6.5" width="6" height="4.5" rx="1" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
        </svg>
      ),
      title:'Interfaces\n100% reales',
      desc:'Gmail, iMessage, WhatsApp — cada escenario replica la app original sin pistas artificiales.',
    },
    {
      n:'02', grad:YELLOW, light:true,
      icon:(
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(120,53,15,0.75)" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="11" cy="11" r="7"/>
          <path d="m21 21-4.35-4.35"/>
          <line x1="11" y1="8" x2="11" y2="14" strokeWidth="2"/>
          <line x1="8" y1="11" x2="14" y2="11" strokeWidth="2"/>
        </svg>
      ),
      title:'X-Ray revela\nla trampa',
      desc:'El escáner ilumina cada indicador de ataque con una explicación técnica precisa y accesible.',
    },
    {
      n:'03', grad:INDIGO, light:false,
      icon:(
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="8" cy="7" r="4"/>
          <path d="M4 21v-2a4 4 0 0 1 4-4h4"/>
          <circle cx="18" cy="17" r="4"/>
          <path d="M18 14v3M18 20h.01" strokeWidth="2"/>
        </svg>
      ),
      title:'Multijugador\nen tiempo real',
      desc:'Crea una sala y tu equipo vota desde el móvil. Votos en vivo, marcador y X-Ray compartido.',
    },
    {
      n:'04', grad:YELLOW, light:true,
      icon:(
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(120,53,15,0.75)" strokeWidth="1.6" strokeLinecap="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-5 0v-15A2.5 2.5 0 0 1 9.5 2z"/>
          <path d="M14.5 8A2.5 2.5 0 0 1 17 10.5v9a2.5 2.5 0 0 1-5 0v-9A2.5 2.5 0 0 1 14.5 8z"/>
          <path d="M4 18h2M18 18h2"/>
        </svg>
      ),
      title:'Detector\nde Phishing IA',
      desc:'Sube cualquier captura o pega el texto. La IA detecta los vectores de ataque en segundos.',
    },
  ]

  return (
    <section style={{background:t.isDark?t.bg:t.bgAlt,borderTop:`1px solid ${t.border}`,fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
      <div ref={ref} style={{maxWidth:1140,margin:'0 auto',padding:'88px 32px'}}>
        <div className={`fade-up${inView?' in':''}`} style={{marginBottom:48}}>
          <div style={{fontSize:12,fontWeight:700,color:t.accent,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:12}}>Qué incluye</div>
          <h2 style={{fontSize:'clamp(1.8rem,3vw,2.4rem)',fontWeight:800,letterSpacing:'-0.03em',color:t.text,margin:0}}>
            Todo lo que necesitas para<br/>entrenar a tu equipo
          </h2>
        </div>
        <style>{`@media(max-width:860px){.feat-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
        <div className="feat-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
          {feats.map(({n,grad,light,icon,title,desc},i) => (
            <div key={n} className={`card-hover fade-up${inView?' in':''}`}
              style={{borderRadius:18,overflow:'hidden',background:grad,transitionDelay:`${i*70}ms`,
                boxShadow: light ? '0 16px 48px rgba(0,0,0,0.10)' : '0 16px 48px rgba(0,0,0,0.28)'}}>
              <div style={{padding:'26px 22px 24px'}}>
                <div style={{fontSize:44,fontWeight:900,lineHeight:1,letterSpacing:'-0.05em',marginBottom:18,
                  color: light ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}}>{n}</div>
                <div style={{marginBottom:14}}>{icon}</div>
                <h3 style={{fontSize:16,fontWeight:800,margin:'0 0 10px',letterSpacing:'-0.02em',lineHeight:1.2,whiteSpace:'pre-line',
                  color: light ? '#1c1917' : '#fff'}}>{title}</h3>
                <p style={{fontSize:13,lineHeight:1.65,margin:0,
                  color: light ? 'rgba(28,25,23,0.62)' : 'rgba(255,255,255,0.68)'}}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Multiplayer Section ───────────────────────────────────────────────────────

const MOCK_PLAYERS = ['Ana R.','Carlos M.','Laura P.','Javier G.','María S.','Pedro L.','Sofía T.','David C.']

function QRCodeMock() {
  return (
    <div style={{width:110,height:110,margin:'0 auto 12px',background:'#fff',borderRadius:12,padding:11,boxShadow:'0 8px 28px rgba(0,0,0,0.18)'}}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        {[[0,0],[62,0],[0,62]].map(([x,y]) => [
          <rect key={`o${x}${y}`} x={x} y={y} width="26" height="26" rx="3" fill="#0d1f35"/>,
          <rect key={`m${x}${y}`} x={x+4} y={y+4} width="18" height="18" rx="2" fill="white"/>,
          <rect key={`i${x}${y}`} x={x+8} y={y+8} width="10" height="10" rx="1" fill="#0d1f35"/>,
        ])}
        {[[30,0],[36,0],[42,0],[54,0],[30,6],[48,6],[30,12],[42,12],[54,12],[30,18],[48,18],
          [0,30],[6,30],[12,30],[18,30],[24,30],[30,30],[42,30],[54,30],[60,30],[72,30],[78,30],
          [0,36],[12,36],[30,36],[48,36],[60,36],[72,36],
          [6,42],[18,42],[36,42],[54,42],[66,42],[78,42],
          [0,48],[12,48],[24,48],[42,48],[60,48],[72,48],
          [6,54],[24,54],[36,54],[60,54],[72,54],[84,54],
          [30,60],[42,60],[54,60],[66,60],[78,60],
          [36,66],[54,66],[66,66],[84,66],
          [30,72],[48,72],[60,72],[72,72],
          [30,78],[36,78],[54,78],[66,78],[84,78],
        ].map(([x,y]) => (
          <rect key={`d${x}${y}`} x={x} y={y} width="5" height="5" rx="0.5" fill="#0d1f35"/>
        ))}
      </svg>
    </div>
  )
}

function MultiplayerSection({ t }) {
  const [ref, inView] = useInView()
  const [phaseKey, setPhaseKey] = useState(0)
  const [phase, setPhase] = useState(0)
  const [playerCount, setPlayerCount] = useState(3)
  const [countdown, setCountdown] = useState(30)
  const [phVotes, setPhVotes] = useState(0)
  const [lgVotes, setLgVotes] = useState(0)

  useEffect(() => {
    setPhase(0); setPlayerCount(3); setCountdown(30); setPhVotes(0); setLgVotes(0)
    const timers = []
    ;[700,1400,2100,2800,3500].forEach(d => timers.push(setTimeout(() => setPlayerCount(c => c+1), d)))
    timers.push(setTimeout(() => { setPhase(1); setCountdown(30) }, 5200))
    let pv=0, lv=0
    ;[5700,6200,6600,7000,7400,7800,8200,8600].forEach((d,i) => {
      timers.push(setTimeout(() => { if(i%3===0){lv++;setLgVotes(lv)}else{pv++;setPhVotes(pv)} }, d))
    })
    timers.push(setTimeout(() => setPhase(2), 11500))
    timers.push(setTimeout(() => setPhaseKey(k => k+1), 17000))
    return () => timers.forEach(clearTimeout)
  }, [phaseKey])

  useEffect(() => {
    if (phase !== 1) return
    const id = setInterval(() => setCountdown(c => Math.max(0,c-1)), 1000)
    return () => clearInterval(id)
  }, [phase])

  const totalV = phVotes + lgVotes
  const phPct = totalV ? Math.round(phVotes/totalV*100) : 0
  const lgPct = totalV ? 100-phPct : 0

  const feats = [
    {icon:'📱', title:'Únete con QR', desc:'Sin registro. Escanea y juegas desde el móvil en segundos.'},
    {icon:'⏱', title:'30 segundos por turno', desc:'La presión del tiempo es parte del entrenamiento real.'},
    {icon:'📊', title:'Votos en tiempo real', desc:'Ves cómo decide el grupo mientras el reloj corre.'},
    {icon:'🏆', title:'Podio al final', desc:'Clasificación con racha de aciertos y puntuación total.'},
  ]

  return (
    <section style={{background:t.bgAlt,borderTop:`1px solid ${t.border}`,fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
      <div ref={ref} style={{maxWidth:1140,margin:'0 auto',padding:'88px 32px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'center'}}>

          {/* Left */}
          <div className={`fade-up${inView?' in':''}`}>
            <div style={{fontSize:12,fontWeight:700,color:t.accent,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:12}}>Modo multijugador</div>
            <h2 style={{fontSize:'clamp(1.8rem,3vw,2.4rem)',fontWeight:800,letterSpacing:'-0.03em',color:t.text,margin:'0 0 16px'}}>
              Como Kahoot,<br/>pero de ciberseguridad.
            </h2>
            <p style={{fontSize:15,color:t.muted,lineHeight:1.75,marginBottom:28}}>
              Crea una sala, comparte el QR y tus jugadores se unen desde el móvil. Cada uno vota en cada escenario contra el reloj. Al final: podio, debate y X-Ray.
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:13,marginBottom:36}}>
              {feats.map(({icon,title,desc}) => (
                <div key={title} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                  <div style={{width:38,height:38,borderRadius:9,flexShrink:0,background:t.bgCard,border:`1px solid ${t.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>
                    {icon}
                  </div>
                  <div>
                    <div style={{fontSize:13.5,fontWeight:700,color:t.text,marginBottom:2}}>{title}</div>
                    <div style={{fontSize:12.5,color:t.sub,lineHeight:1.5}}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Btn t={t} variant="blue" onClick={() => {}} style={{fontSize:14,padding:'13px 26px'}}>Crear sala ahora →</Btn>
          </div>

          {/* Right: animated demo */}
          <div className={`fade-up${inView?' in':''}`} style={{transitionDelay:'120ms'}}>
            <div style={{background:t.isDark?'rgba(8,18,38,0.97)':'#fff',border:`1px solid ${t.borderMed}`,borderRadius:18,overflow:'hidden',boxShadow:t.shadow}}>
              {/* Chrome */}
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 16px',background:t.isDark?'rgba(255,255,255,0.025)':'#f0f3f8',borderBottom:`1px solid ${t.border}`}}>
                <div style={{display:'flex',gap:5}}>{['#ff5f57','#febc2e','#28c840'].map(c=><div key={c} style={{width:8,height:8,borderRadius:'50%',background:c}}/>)}</div>
                <span style={{fontSize:11,fontWeight:600,color:t.muted,marginLeft:4}}>
                  PhishLens · Sala <span style={{color:t.accent,fontFamily:'JetBrains Mono,monospace',letterSpacing:'0.06em'}}>ABC-123</span>
                </span>
                <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:5}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:'#4ade80',animation:'pulse 1.5s infinite'}}/>
                  <span style={{fontSize:10,fontWeight:700,color:'#4ade80'}}>EN VIVO</span>
                </div>
              </div>

              <div style={{padding:22,minHeight:340}}>
                {phase===0 && (
                  <div style={{animation:'fadeUp 0.3s ease'}}>
                    <div style={{textAlign:'center',marginBottom:14}}>
                      <QRCodeMock/>
                      <div style={{fontSize:24,fontWeight:900,color:t.text,letterSpacing:'0.12em',fontFamily:'JetBrains Mono,monospace'}}>ABC-123</div>
                      <div style={{fontSize:11,color:t.sub,marginTop:3}}>phishlens.app/join/ABC-123</div>
                    </div>
                    <div style={{borderTop:`1px solid ${t.border}`,paddingTop:12}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                        <span style={{fontSize:11,fontWeight:700,color:t.text}}>Esperando jugadores…</span>
                        <span style={{fontSize:11,fontWeight:800,color:t.accent}}>{playerCount} en sala</span>
                      </div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                        {MOCK_PLAYERS.slice(0,playerCount).map(p=>(
                          <span key={p} style={{fontSize:10,fontWeight:600,color:t.text,padding:'3px 9px',borderRadius:99,background:t.bgCard,border:`1px solid ${t.border}`,animation:'fadeUp 0.2s ease'}}>{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {phase===1 && (
                  <div style={{animation:'fadeUp 0.3s ease'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                      <span style={{fontSize:10,fontWeight:700,color:t.sub,textTransform:'uppercase',letterSpacing:'0.06em'}}>Escenario 4 · Email · Difícil</span>
                      <div style={{fontSize:22,fontWeight:900,fontFamily:'JetBrains Mono,monospace',letterSpacing:'-0.02em',color:countdown<=10?'#f87171':t.accent,transition:'color 0.3s'}}>
                        ⏱ {String(countdown).padStart(2,'0')}s
                      </div>
                    </div>
                    <div style={{background:t.isDark?'rgba(255,255,255,0.04)':'#f8fafc',border:`1px solid ${t.border}`,borderRadius:10,padding:'11px 13px',marginBottom:12}}>
                      <div style={{display:'flex',gap:8,marginBottom:7}}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:'#1a73e8',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:800,flexShrink:0}}>G</div>
                        <div>
                          <div style={{fontSize:10.5,fontWeight:700,color:t.text}}>Google Security Alert</div>
                          <div style={{fontSize:8.5,color:'#f87171',fontFamily:'JetBrains Mono,monospace'}}>noreply@g00gle-accounts.com</div>
                        </div>
                      </div>
                      <div style={{fontSize:11,fontWeight:700,color:t.text,marginBottom:4}}>Inicio de sesión bloqueado</div>
                      <div style={{fontSize:10,color:t.muted,lineHeight:1.5}}>Acceso sospechoso desde Moscú, Rusia. Verifica tu identidad inmediatamente.</div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:10,fontWeight:700,color:t.sub,marginBottom:8}}>
                      <span>Votos en tiempo real</span><span>{totalV}/8 jugadores</span>
                    </div>
                    {[{label:'⚠ Phishing',pct:phPct,c:'#f87171',v:phVotes},{label:'✓ Legítimo',pct:lgPct,c:'#4ade80',v:lgVotes}].map(({label,pct,c,v})=>(
                      <div key={label} style={{marginBottom:8}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                          <span style={{fontSize:10.5,fontWeight:700,color:c}}>{label}</span>
                          <span style={{fontSize:10.5,fontWeight:700,color:c}}>{v} votos · {pct}%</span>
                        </div>
                        <div style={{height:6,borderRadius:99,background:t.border,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${pct}%`,borderRadius:99,background:c,transition:'width 0.6s ease'}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {phase===2 && (
                  <div style={{animation:'fadeUp 0.3s ease'}}>
                    <div style={{textAlign:'center',marginBottom:14}}>
                      <div style={{fontSize:13,fontWeight:700,color:t.accent,textTransform:'uppercase',letterSpacing:'0.06em'}}>🏆 Resultados finales</div>
                      <div style={{fontSize:10.5,color:t.sub,marginTop:3}}>8 jugadores · 8 escenarios completados</div>
                    </div>
                    <div style={{display:'flex',justifyContent:'center',alignItems:'flex-end',gap:8,height:120,marginBottom:14}}>
                      {[
                        {name:'Carlos M.',score:7,height:82,bg:'rgba(148,163,184,0.12)',medal:'🥈',delay:100},
                        {name:'Ana R.',score:8,height:118,bg:'rgba(251,191,36,0.10)',medal:'🥇',delay:0},
                        {name:'Laura P.',score:6,height:62,bg:'rgba(180,83,9,0.10)',medal:'🥉',delay:200},
                      ].map(({name,score,medal,height,bg,delay})=>(
                        <div key={name} style={{flex:1,height,borderRadius:'8px 8px 0 0',background:bg,border:`1px solid ${t.border}`,borderBottom:'none',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',paddingTop:8,gap:3,animation:`fadeUp 0.4s ease ${delay}ms both`}}>
                          <span style={{fontSize:18}}>{medal}</span>
                          <span style={{fontSize:9,fontWeight:700,color:t.text,textAlign:'center',padding:'0 4px',lineHeight:1.3}}>{name}</span>
                          <span style={{fontSize:13,fontWeight:900,color:t.accent}}>{score}/8</span>
                        </div>
                      ))}
                    </div>
                    {[{n:'Javier G.',s:6,i:4},{n:'María S.',s:5,i:5},{n:'Pedro L.',s:5,i:6}].map(({n,s,i})=>(
                      <div key={n} style={{display:'flex',justifyContent:'space-between',padding:'7px 10px',borderRadius:7,background:t.bgCard,border:`1px solid ${t.border}`,marginBottom:5,animation:`fadeUp 0.3s ease ${i*60}ms both`}}>
                        <span style={{fontSize:11,color:t.muted}}>{i}. {n}</span>
                        <span style={{fontSize:11,fontWeight:700,color:t.text}}>{s}/8</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:14,alignItems:'center'}}>
              {['Sala de espera','En juego','Resultados'].map((label,i)=>(
                <div key={label} style={{display:'flex',alignItems:'center',gap:4}}>
                  <div style={{width:i===phase?18:6,height:6,borderRadius:99,background:i===phase?t.accent:t.border,transition:'all 0.4s'}}/>
                  {i===phase && <span style={{fontSize:9.5,color:t.accent,fontWeight:600}}>{label}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Detector Section ──────────────────────────────────────────────────────────

const DEMO_INDICATORS = [
  {type:'danger', label:'Dominio falsificado', detail:'g00gle-accounts.com — "00" en vez de "oo"'},
  {type:'danger', label:'Urgencia artificial', detail:'"inmediatamente" · "bloqueado" — presión psicológica'},
  {type:'warn',   label:'Sin personalización', detail:'Los correos reales incluyen tu nombre completo'},
]

function DetectorSection({ t, onDetect }) {
  const [ref, inView] = useInView()
  const [demoKey, setDemoKey] = useState(0)
  const [demoPhase, setDemoPhase] = useState(0)

  useEffect(() => {
    setDemoPhase(0)
    const t1 = setTimeout(() => setDemoPhase(1), 2600)
    const t2 = setTimeout(() => setDemoPhase(2), 4600)
    const t3 = setTimeout(() => setDemoKey(k => k + 1), 10000)
    return () => [t1,t2,t3].forEach(clearTimeout)
  }, [demoKey])

  return (
    <section id="detector" style={{background:t.isDark?t.bgAlt:t.bg,borderTop:`1px solid ${t.border}`,fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
      <div ref={ref} style={{maxWidth:1140,margin:'0 auto',padding:'88px 32px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'center'}}>

          <div className={`fade-up${inView?' in':''}`}>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 10px',background:'rgba(52,211,153,0.1)',border:'1px solid rgba(52,211,153,0.25)',borderRadius:5,marginBottom:18}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'#34d399',display:'inline-block',animation:'pulse 2s infinite'}}/>
              <span style={{fontSize:10.5,fontWeight:700,color:'#34d399',letterSpacing:'0.07em',textTransform:'uppercase'}}>Nuevo · Beta</span>
            </div>
            <h2 style={{fontSize:'clamp(1.8rem,3vw,2.4rem)',fontWeight:800,letterSpacing:'-0.03em',color:t.text,margin:'0 0 16px'}}>
              Detector de<br/>Phishing con IA
            </h2>
            <p style={{fontSize:15,color:t.muted,lineHeight:1.75,marginBottom:28}}>
              Sube una captura de pantalla o pega el texto de cualquier mensaje sospechoso. Nuestra IA detecta los indicadores de ataque en segundos y te explica cada uno.
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:11,marginBottom:36}}>
              {[
                ['Análisis en menos de 3 segundos', '#34d399'],
                ['Detecta typosquatting, urgencia y dominios falsos', t.accent],
                ['Explica cada indicador en lenguaje claro', '#a78bfa'],
              ].map(([text, color]) => (
                <div key={text} style={{display:'flex',alignItems:'flex-start',gap:10}}>
                  <div style={{width:18,height:18,borderRadius:'50%',background:`${color}18`,border:`1px solid ${color}30`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:color}}/>
                  </div>
                  <span style={{fontSize:14,color:t.muted,lineHeight:1.5}}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
              <Btn t={t} variant="primary" onClick={onDetect} style={{fontSize:14,padding:'13px 26px'}}>Acceder al Detector →</Btn>
              <span style={{fontSize:12,color:t.sub,fontWeight:500}}>Beta · Gratis</span>
            </div>
          </div>

          <div className={`fade-up${inView?' in':''}`} style={{transitionDelay:'130ms'}}>
            <div style={{background:t.isDark?'rgba(8,18,38,0.97)':'#ffffff',border:`1px solid ${t.borderMed}`,borderRadius:18,overflow:'hidden',boxShadow:t.shadow}}>
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 18px',background:t.isDark?'rgba(255,255,255,0.025)':'#f0f3f8',borderBottom:`1px solid ${t.border}`}}>
                <div style={{width:8,height:8,borderRadius:'50%',transition:'background 0.5s',background:demoPhase===2?'#4ade80':demoPhase===1?t.accent:'#475569'}}/>
                <span style={{fontSize:11,fontWeight:600,color:t.muted}}>
                  {demoPhase===0 ? 'Esperando archivo…' : demoPhase===1 ? 'Analizando con IA…' : 'Análisis completado'}
                </span>
                {demoPhase===2 && (
                  <span style={{marginLeft:'auto',fontSize:10,fontWeight:700,color:'#4ade80',padding:'2px 8px',background:'rgba(74,222,128,0.1)',borderRadius:4}}>96% confianza</span>
                )}
              </div>

              <div style={{padding:22,minHeight:270}}>
                {demoPhase===0 && (
                  <div style={{animation:'fadeUp 0.35s ease'}}>
                    <div style={{border:`2px dashed ${t.border}`,borderRadius:14,padding:'38px 24px',textAlign:'center',marginBottom:16,background:t.bgCard}}>
                      <div style={{fontSize:28,marginBottom:10}}>📎</div>
                      <div style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:5}}>Arrastra tu captura aquí</div>
                      <div style={{fontSize:11,color:t.sub}}>PNG, JPG · o pega el texto del correo</div>
                    </div>
                    <div style={{height:36,borderRadius:8,background:t.accentDim,border:`1px solid ${t.accentLine}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <span style={{fontSize:12,fontWeight:700,color:t.accent}}>Analizar con IA →</span>
                    </div>
                  </div>
                )}

                {demoPhase===1 && (
                  <div style={{textAlign:'center',padding:'28px 0',animation:'fadeUp 0.35s ease'}}>
                    <div style={{width:44,height:44,borderRadius:'50%',border:`3px solid ${t.border}`,borderTopColor:t.accent,animation:'spin 0.75s linear infinite',margin:'0 auto 18px'}}/>
                    <div style={{fontSize:14,fontWeight:600,color:t.text,marginBottom:7}}>Detectando patrones…</div>
                    <div style={{fontSize:11.5,color:t.sub,marginBottom:22}}>Remitente · Dominio · Tono · Enlaces</div>
                    <div style={{height:4,borderRadius:99,background:t.border,overflow:'hidden',maxWidth:240,margin:'0 auto'}}>
                      <div style={{height:'100%',background:t.accent,borderRadius:99,animation:'detProgress 2.1s ease forwards'}}/>
                    </div>
                  </div>
                )}

                {demoPhase===2 && (
                  <div style={{animation:'fadeUp 0.35s ease'}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',marginBottom:14,background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.25)',borderRadius:11}}>
                      <span style={{fontSize:22,flexShrink:0}}>⚠️</span>
                      <div>
                        <div style={{fontSize:14,fontWeight:800,color:'#f87171',letterSpacing:'-0.01em'}}>PHISHING DETECTADO</div>
                        <div style={{fontSize:10.5,color:t.sub,marginTop:2}}>Este mensaje contiene indicadores de ataque</div>
                      </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:7}}>
                      {DEMO_INDICATORS.map((ind,i) => (
                        <div key={i} style={{display:'flex',gap:10,padding:'9px 13px',background:t.bgCard,border:`1px solid ${t.border}`,borderRadius:9,borderLeft:`3px solid ${ind.type==='danger'?'#f87171':'#fb923c'}`,animation:`fadeUp 0.35s ease ${i*90}ms both`}}>
                          <div>
                            <span style={{fontSize:11.5,fontWeight:700,color:ind.type==='danger'?'#f87171':'#fb923c'}}>{ind.label}</span>
                            <span style={{fontSize:10.5,color:t.sub}}> · {ind.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:6,marginTop:14,alignItems:'center'}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:t.accent,animation:'pulse 1.5s infinite'}}/>
              <span style={{fontSize:11,color:t.sub,fontWeight:500}}>Demo interactivo en tiempo real</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────────────────────

function HowItWorks({ t }) {
  const [ref, inView] = useInView()
  const steps = [
    {n:'01',title:'Elige el escenario',desc:'Email, SMS, WhatsApp o archivo. La interfaz replica la aplicación real sin pistas que lo delaten.'},
    {n:'02',title:'¿Legítimo o phishing?',desc:'Una sola oportunidad. La mitad son mensajes reales — no puedes adivinar sistemáticamente.'},
    {n:'03',title:'X-Ray revela la verdad',desc:'El escáner ilumina cada señal de ataque y explica la técnica con lenguaje accesible.'},
  ]
  return (
    <section style={{background:t.isDark?t.bg:t.bgAlt,borderTop:`1px solid ${t.border}`,fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
      <div ref={ref} style={{maxWidth:1140,margin:'0 auto',padding:'88px 32px'}}>
        <div className={`fade-up${inView?' in':''}`} style={{textAlign:'center',marginBottom:56}}>
          <h2 style={{fontSize:'clamp(1.8rem,3vw,2.4rem)',fontWeight:800,letterSpacing:'-0.03em',color:t.text,margin:'0 0 12px'}}>Cómo funciona</h2>
          <p style={{fontSize:15,color:t.muted,margin:0}}>Sin registro. Sin instalación. Empieza en 10 segundos.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:1}}>
          {steps.map(({n,title,desc},i) => (
            <div key={n} className={`fade-up${inView?' in':''}`}
              style={{padding:'32px 36px',transitionDelay:`${i*100}ms`,borderLeft:i>0?`1px solid ${t.border}`:'none'}}>
              <div style={{fontSize:56,fontWeight:900,color:t.dim,lineHeight:1,marginBottom:16,letterSpacing:'-0.05em'}}>{n}</div>
              <h3 style={{fontSize:16,fontWeight:700,color:t.text,margin:'0 0 10px',letterSpacing:'-0.02em'}}>{title}</h3>
              <p style={{fontSize:14,color:t.muted,lineHeight:1.7,margin:0}}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────

function CTASection({ t, onStart, onHost }) {
  const [ref, inView] = useInView()
  return (
    <section style={{background:t.bg,borderTop:`1px solid ${t.border}`,fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
      <div ref={ref} style={{maxWidth:1140,margin:'0 auto',padding:'88px 32px'}}>
        <div className={`fade-up${inView?' in':''}`} style={{
          background:`linear-gradient(135deg,${t.isDark?'rgba(255,255,255,0.04)':'#f5f8fd'} 0%,${t.isDark?'rgba(255,255,255,0.02)':'#eef4ff'} 100%)`,
          border:`1px solid ${t.border}`,borderRadius:24,padding:'64px',textAlign:'center',
        }}>
          <div style={{fontSize:12,fontWeight:700,color:t.accent,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:16}}>Empieza ahora</div>
          <h2 style={{fontSize:'clamp(2rem,3.5vw,2.8rem)',fontWeight:900,letterSpacing:'-0.04em',color:t.text,margin:'0 0 16px'}}>¿Te atreves a comprobarlo?</h2>
          <p style={{fontSize:15,color:t.muted,margin:'0 0 36px',lineHeight:1.6}}>
            Gratis, sin cuenta, sin instalación. Ideal para charlas, aulas y equipos.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Btn t={t} onClick={onStart} variant="primary" style={{fontSize:15,padding:'14px 28px'}}>Empezar solo →</Btn>
            <Btn t={t} onClick={onHost} variant="ghost" style={{fontSize:15,padding:'14px 28px'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Multijugador
            </Btn>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer({ t }) {
  return (
    <footer style={{background:t.bgAlt,borderTop:`1px solid ${t.border}`,padding:'24px 32px',fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
      <div style={{maxWidth:1140,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <Logo t={t} size={15}/>
        <span style={{fontSize:12,color:t.sub}}>Herramienta educativa de ciberseguridad · Open Source</span>
        <a href="https://github.com/javiernglz/phishlens" target="_blank" rel="noopener noreferrer"
          style={{fontSize:12,color:t.sub,display:'flex',alignItems:'center',gap:5,transition:'color 0.15s',textDecoration:'none'}}
          onMouseOver={e=>e.currentTarget.style.color=t.muted} onMouseOut={e=>e.currentTarget.style.color=t.sub}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          GitHub
        </a>
      </div>
    </footer>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function LandingPage({ onStart, onHost, onDetect }) {
  const [dark, setDark] = useState(false)
  const t = mkTheme(dark, 'indigo')

  return (
    <div style={{background:t.bg,color:t.text,minHeight:'100vh',transition:'background 0.3s,color 0.3s',fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
      <style>{GLOBAL_CSS}</style>
      <Nav t={t} dark={dark} onToggleDark={() => setDark(d => !d)} />
      <Hero t={t} onStart={onStart} onHost={onHost} />
      <Features t={t} />
      <MultiplayerSection t={t} />
      <DetectorSection t={t} onDetect={onDetect} />
      <HowItWorks t={t} />
      <CTASection t={t} onStart={onStart} onHost={onHost} />
      <Footer t={t} />
    </div>
  )
}
