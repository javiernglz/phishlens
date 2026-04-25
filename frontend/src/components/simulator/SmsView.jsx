import { ChevronLeft } from 'lucide-react'
import { WhatsAppView } from './WhatsAppView'

function StatusBar() {
  return (
    <div className="bg-black flex items-center justify-between px-5 pt-2 pb-1 select-none">
      <span className="text-white text-xs font-semibold">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <div className="flex gap-px items-end h-3">
          {[3, 4, 5, 6, 7].map((h, i) => (
            <div key={i} style={{ height: h + 'px' }} className="w-[3px] bg-white rounded-sm" />
          ))}
        </div>
        {/* WiFi */}
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-white stroke-2">
          <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
        </svg>
        {/* Battery */}
        <div className="w-6 h-3 border border-white rounded-sm relative flex items-center px-0.5">
          <div className="w-4 h-1.5 bg-white rounded-[1px]" />
          <div className="absolute -right-[3px] top-[3px] w-[3px] h-1.5 bg-white rounded-r-sm" />
        </div>
      </div>
    </div>
  )
}

function SmsMessage({ msg }) {
  const isLink = msg.type === 'link'
  const isFromThem = msg.from === 'them'

  return (
    <div className={`flex ${isFromThem ? 'justify-start' : 'justify-end'}`}>
      <div className="flex flex-col gap-0.5 max-w-[78%]">
        {isLink ? (
          <a
            id="hs-link"
            href="#"
            onClick={(e) => e.preventDefault()}
            className="bg-[#1c1c1e] text-[#0a84ff] text-sm px-4 py-2.5 rounded-2xl underline break-all cursor-pointer"
          >
            {msg.text}
          </a>
        ) : (
          <div
            className={`text-sm px-4 py-2.5 rounded-2xl leading-snug ${
              isFromThem ? 'bg-[#2c2c2e] text-white' : 'bg-[#0a84ff] text-white'
            }`}
          >
            {msg.text}
          </div>
        )}
        <span className={`text-[10px] text-gray-600 px-1 ${isFromThem ? 'text-left' : 'text-right'}`}>
          {msg.time}
        </span>
      </div>
    </div>
  )
}

function IMessageView({ scenario }) {
  const { content } = scenario
  const displayName = content.senderName || content.sender

  return (
    <div className="flex flex-col h-full bg-black" style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
      <StatusBar />

      {/* Navigation bar */}
      <div className="bg-[#1c1c1e] flex items-center px-3 py-2 border-b border-gray-800">
        <button className="text-[#0a84ff] flex items-center gap-0.5 text-sm min-w-[60px]">
          <ChevronLeft size={20} />
          <span>Mensajes</span>
        </button>

        {/* Contact info centered */}
        <div className="flex-1 flex flex-col items-center">
          <div
            id="hs-sender"
            className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold text-lg select-none"
          >
            {displayName ? displayName[0].toUpperCase() : '?'}
          </div>
          <span className="text-white text-xs font-semibold mt-0.5">{displayName}</span>
        </div>

        <button className="text-[#0a84ff] text-sm min-w-[60px] text-right pr-1">i</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 bg-black">
        <div className="text-center text-gray-600 text-[11px] py-2 select-none">Hoy</div>
        {content.messages.map((msg, i) => (
          <SmsMessage key={i} msg={msg} />
        ))}
      </div>

      {/* Input bar */}
      <div className="bg-[#1c1c1e] border-t border-gray-800 px-3 py-2 flex items-center gap-2 flex-shrink-0">
        <button className="text-[#0a84ff] flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
        </button>
        <div className="flex-1 bg-[#2c2c2e] rounded-full border border-gray-700 px-4 py-2">
          <span className="text-gray-500 text-sm">iMessage</span>
        </div>
        <button className="text-[#0a84ff] flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function SmsView({ scenario }) {
  if (scenario.content.platform === 'whatsapp') {
    return <WhatsAppView scenario={scenario} />
  }
  return <IMessageView scenario={scenario} />
}
