import { ChevronLeft, Video, Phone, MoreVertical, Paperclip, Mic, Smile } from 'lucide-react'

function WaStatusBar() {
  return (
    <div className="bg-[#128C7E] flex items-center justify-between px-5 pt-1.5 pb-0 select-none">
      <span className="text-white text-xs font-semibold">9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex gap-px items-end h-3">
          {[3, 4, 5, 6, 7].map((h, i) => (
            <div key={i} style={{ height: h + 'px' }} className="w-[3px] bg-white rounded-sm" />
          ))}
        </div>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-white stroke-2">
          <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
        </svg>
        <div className="w-6 h-3 border border-white rounded-sm relative flex items-center px-0.5">
          <div className="w-4 h-1.5 bg-white rounded-[1px]" />
          <div className="absolute -right-[3px] top-[3px] w-[3px] h-1.5 bg-white rounded-r-sm" />
        </div>
      </div>
    </div>
  )
}

function WaLinkPreview({ preview }) {
  return (
    <div className="mt-1.5 rounded-lg overflow-hidden border border-gray-200 bg-white">
      {preview.headerBg ? (
        <div
          className="h-20 flex items-center justify-center select-none"
          style={{ backgroundColor: preview.headerBg }}
        >
          <span className="text-white font-bold text-xl tracking-wide">{preview.brandText}</span>
        </div>
      ) : (
        <div className="h-20 bg-gray-100 flex items-center justify-center text-4xl select-none">
          {preview.image ?? '🔗'}
        </div>
      )}
      <div className="p-2 border-l-4 border-[#128C7E]">
        <p className="text-[10px] text-[#128C7E] font-medium truncate">{preview.url}</p>
        <p className="text-xs font-semibold text-gray-800 leading-tight">{preview.title}</p>
        <p className="text-[10px] text-gray-500 leading-tight">{preview.description}</p>
      </div>
    </div>
  )
}

function WaMessage({ msg }) {
  const isFromThem = msg.from === 'them'

  return (
    <div className={`flex mb-1.5 ${isFromThem ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-3 py-1.5 shadow-sm ${
          isFromThem
            ? 'bg-white rounded-tl-none text-[#111B21]'
            : 'bg-[#DCF8C6] rounded-tr-none text-[#111B21]'
        }`}
      >
        {/* Forwarded indicator */}
        {msg.forwarded && (
          <div className="flex items-center gap-1 text-[10px] text-[#667781] mb-1 select-none">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
              <path d="M14 8H10C6.13 8 3 11.13 3 15v3h2v-3c0-2.76 2.24-5 5-5h4v3l5-4-5-4v3z" />
            </svg>
            <span>Reenviado</span>
          </div>
        )}

        {/* Message content */}
        {msg.type === 'link' ? (
          <div>
            <a
              id="hs-link"
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[#128C7E] text-sm underline break-all cursor-pointer"
            >
              {msg.text}
            </a>
            {msg.preview && <WaLinkPreview preview={msg.preview} />}
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{msg.text}</p>
        )}

        {/* Timestamp + read receipt */}
        <div className={`flex items-center gap-1 mt-0.5 ${isFromThem ? 'justify-start' : 'justify-end'}`}>
          <span className="text-[10px] text-[#667781] select-none">{msg.time}</span>
          {!isFromThem && (
            <svg viewBox="0 0 18 18" className="w-3.5 h-3.5 fill-[#53bdeb]" aria-hidden="true">
              <path d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076L8.28 15.605l-4.197-4.196a.434.434 0 0 0-.614 0l-.477.477a.433.433 0 0 0 0 .614l4.479 4.479a.432.432 0 0 0 .694-.076L17.47 5.644a.435.435 0 0 0-.076-.609zm-4.418 0l-.57-.444a.434.434 0 0 0-.609.076L3.863 15.605l-.318-.318a.434.434 0 0 0-.614 0l-.477.477a.433.433 0 0 0 0 .614l.6.601a.433.433 0 0 0 .694-.076L12.97 5.644a.436.436 0 0 0-.075-.609z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

export function WhatsAppView({ scenario }) {
  const { content } = scenario
  const displayName = content.senderName || content.sender

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
      <WaStatusBar />

      {/* Header */}
      <div className="bg-[#128C7E] flex items-center gap-2 px-2 py-2 flex-shrink-0">
        <button className="text-white p-1">
          <ChevronLeft size={22} />
        </button>

        {/* Contact info — hotspot target */}
        <div id="hs-sender" className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#DFD8CE] flex items-center justify-center text-[#54656F] font-semibold text-sm flex-shrink-0 select-none">
            {displayName ? displayName[0].toUpperCase() : '?'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-tight truncate">{displayName}</p>
            <p className="text-[#9fccca] text-[11px]">en línea</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="text-white/90"><Video size={20} /></button>
          <button className="text-white/90"><Phone size={18} /></button>
          <button className="text-white/90"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 bg-[#ECE5DD]">
        <div className="flex justify-center mb-3 select-none">
          <span className="bg-[#E1F0F7]/80 text-[#667781] text-[11px] px-3 py-0.5 rounded-full shadow-sm">
            Hoy
          </span>
        </div>

        {content.messages.map((msg, i) => (
          <WaMessage key={i} msg={msg} />
        ))}
      </div>

      {/* Footer */}
      <div className="bg-[#F0F0F0] flex items-center gap-2 px-2 py-1.5 border-t border-gray-300 flex-shrink-0">
        <button className="text-[#54656F] p-1.5 flex-shrink-0">
          <Smile size={22} />
        </button>
        <div className="flex-1 bg-white rounded-full border border-gray-200 px-4 py-2 flex items-center">
          <span className="text-gray-400 text-sm">Escribe un mensaje...</span>
        </div>
        <button className="text-[#54656F] p-1.5 flex-shrink-0">
          <Paperclip size={20} />
        </button>
        <button className="w-10 h-10 bg-[#128C7E] rounded-full flex items-center justify-center flex-shrink-0">
          <Mic size={18} className="text-white" />
        </button>
      </div>
    </div>
  )
}
