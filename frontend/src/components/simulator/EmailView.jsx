import { useState } from 'react'
import {
  ArrowLeft, Star, ReplyAll, MoreHorizontal, Printer, Trash2, ChevronDown,
  Menu, Mail, Search, Settings, Pencil, Inbox, Clock, Send, FileText,
  ShoppingBag, Users, Bookmark,
} from 'lucide-react'

function GmailTopBar() {
  return (
    <div className="h-16 bg-white flex items-center px-2 gap-2 flex-shrink-0">
      <div className="flex items-center gap-1 pl-2 pr-4 select-none">
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <Menu size={20} />
        </button>
        <Mail size={28} className="text-[#EA4335]" />
        <span className="text-[22px] font-normal text-gray-600 ml-0.5 tracking-tight">Gmail</span>
      </div>
      <div className="flex-1 max-w-2xl">
        <div className="bg-[#EAF1FB] hover:bg-[#dce5f5] rounded-2xl h-12 flex items-center px-4 gap-3 transition-colors cursor-text">
          <Search size={18} className="text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-500 flex-1">Buscar correo</span>
          <Settings size={16} className="text-gray-400 flex-shrink-0" />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1 pr-2">
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-sm font-medium select-none ml-1">
          U
        </div>
      </div>
    </div>
  )
}

const SIDEBAR_ITEMS = [
  { label: 'Recibidos',   Icon: Inbox,       active: true,  badge: null },
  { label: 'Destacados',  Icon: Star,        active: false, badge: null },
  { label: 'Pospuestos',  Icon: Clock,       active: false, badge: null },
  { label: 'Importantes', Icon: Bookmark,    active: false, badge: null },
  { label: 'Enviados',    Icon: Send,        active: false, badge: null },
  { label: 'Borradores',  Icon: FileText,    active: false, badge: null },
  { label: 'Compras',     Icon: ShoppingBag, active: false, badge: '1'  },
  { label: 'Social',      Icon: Users,       active: false, badge: null },
]

function GmailSidebar() {
  return (
    <div className="w-56 bg-white flex flex-col py-2 flex-shrink-0 overflow-y-auto">
      <div className="px-3 mb-3">
        <button className="flex items-center gap-4 bg-[#C2E7FF] hover:bg-[#a8d8f8] text-gray-800 rounded-2xl px-5 py-4 w-full transition-colors select-none">
          <Pencil size={20} className="text-gray-700 flex-shrink-0" />
          <span className="text-sm font-medium">Redactar</span>
        </button>
      </div>
      {SIDEBAR_ITEMS.map(({ label, Icon, active, badge }) => (
        <button
          key={label}
          className={`flex items-center gap-4 mx-2 px-4 py-2 rounded-r-full text-sm transition-colors select-none ${
            active ? 'bg-[#D3E3FD] text-gray-900 font-bold' : 'text-gray-700 hover:bg-gray-100 font-normal'
          }`}
        >
          <Icon size={18} className={`flex-shrink-0 ${active ? 'text-gray-900' : 'text-gray-600'}`} strokeWidth={active ? 2.5 : 1.5} />
          <span className="flex-1 text-left">{label}</span>
          {badge && <span className="text-xs text-gray-600 font-normal">{badge}</span>}
        </button>
      ))}
    </div>
  )
}

function EmailBlock({ block, onLinkHover }) {
  if (block.type === 'text') {
    return <p className="mb-1 whitespace-pre-line text-gray-800">{block.value}</p>
  }

  if (block.type === 'spacer') {
    return <div className="h-3" />
  }

  // Full-width brand header — breaks out of the indented body container
  if (block.type === 'brand-header') {
    return (
      <div
        style={{
          marginLeft: '-52px',
          width: 'calc(100% + 52px)',
          marginBottom: '20px',
          marginTop: '-4px',
          background: block.bg,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px' }}>
          {block.icon && (
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: block.iconBg ?? 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: block.iconColor ?? '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0,
            }}>
              {block.icon}
            </div>
          )}
          <span style={{
            color: block.color ?? '#fff',
            fontWeight: 700,
            fontSize: block.fontSize ?? 15,
            letterSpacing: block.letterSpacing ?? 0,
            fontFamily: block.fontFamily ?? 'inherit',
          }}>
            {block.text}
          </span>
          {block.tagline && (
            <span style={{ color: block.taglineColor ?? 'rgba(255,255,255,0.55)', fontSize: 12 }}>
              {block.tagline}
            </span>
          )}
        </div>
        {block.stripe && (
          <div style={{ height: 4, background: block.stripe }} />
        )}
      </div>
    )
  }

  if (block.type === 'divider') {
    return <hr className="my-4 border-gray-200" />
  }

  if (block.type === 'caption') {
    return (
      <p className="text-xs text-gray-400 mt-2 leading-relaxed whitespace-pre-line">
        {block.value}
      </p>
    )
  }

  if (block.type === 'info-block') {
    return (
      <div className="my-2 border border-gray-200 rounded-lg overflow-hidden text-sm w-fit min-w-[320px]">
        {block.rows.map((row, i) => (
          <div key={i} className={`flex px-4 py-2 gap-6 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <span className="text-gray-500 w-24 flex-shrink-0">{row.label}</span>
            <span className="text-gray-800 font-medium">{row.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (block.type === 'button') {
    const s = block.style ?? {}
    const bg           = s.bg           ?? '#1a73e8'
    const color        = s.color        ?? '#ffffff'
    const borderRadius = s.borderRadius ?? '4px'
    const border       = s.border       ?? 'none'
    const fontSize     = s.fontSize     ?? '14px'
    const fontWeight   = s.fontWeight   ?? '500'

    return (
      <div id={block.id} className="my-4 inline-block">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          onMouseEnter={() => onLinkHover(block.realUrl)}
          onMouseLeave={() => onLinkHover(null)}
          style={{
            display: 'inline-block',
            background: bg,
            color,
            borderRadius,
            border,
            fontSize,
            fontWeight,
            padding: s.padding ?? '10px 22px',
            textDecoration: 'none',
            cursor: 'pointer',
            userSelect: 'none',
            letterSpacing: s.letterSpacing ?? 'normal',
            fontFamily: s.fontFamily ?? 'inherit',
            transition: 'opacity 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.opacity = '0.88' }}
          onMouseOut={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          {block.label}
        </a>
      </div>
    )
  }

  return null
}

export function EmailView({ scenario }) {
  const [hoveredLink, setHoveredLink] = useState(null)
  const { content } = scenario

  return (
    <div className="flex flex-col h-full bg-white font-roboto relative">
      <GmailTopBar />

      <div className="flex flex-1 overflow-hidden">
        <GmailSidebar />

        <div className="flex-1 overflow-y-auto" style={{ background: content.emailBg ?? '#fff' }}>
          {/* Action toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100 sticky top-0 bg-white z-10">
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
              <Trash2 size={16} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
              <Printer size={16} />
            </button>
          </div>

          {/* Email card */}
          <div
            className="px-6 py-5 max-w-4xl"
            style={content.cardBg ? {
              background: content.cardBg,
              margin: '16px',
              borderRadius: 8,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            } : {}}
          >
            <h2
              id="hs-subject"
              className="text-2xl font-normal text-gray-800 mb-5 leading-snug"
            >
              {content.subject}
            </h2>

            {/* Sender row */}
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0"
                style={{ background: content.avatarColor }}
              >
                {content.avatarInitial}
              </div>

              <div className="flex-1 min-w-0">
                <div id="hs-sender" className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-800 text-sm">{content.fromDisplay}</span>
                  <span className="text-gray-500 text-xs">&lt;{content.fromEmail}&gt;</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <span>a mí</span>
                  <ChevronDown size={12} />
                  <span className="ml-4">{content.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <Star size={16} className="text-gray-400" />
                </button>
                <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <ReplyAll size={16} className="text-gray-400" />
                </button>
                <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Email body */}
            <div className="mt-5 text-sm leading-relaxed" style={{ marginLeft: '52px' }}>
              {content.body.map((block, i) => (
                <EmailBlock key={i} block={block} onLinkHover={setHoveredLink} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {hoveredLink && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 px-3 py-0.5 text-xs text-gray-600 font-mono z-20 truncate">
          {hoveredLink}
        </div>
      )}
    </div>
  )
}
