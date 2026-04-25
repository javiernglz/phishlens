import { useEffect, useState } from 'react'

const PAD = 6

export function XRayOverlay({ stageRef, scenario, activeHotspotId, onHotspotClick }) {
  const [positions, setPositions] = useState([])

  useEffect(() => {
    if (!stageRef.current) return

    const measure = () => {
      const stageRect = stageRef.current.getBoundingClientRect()
      const measured = scenario.hotspots
        .map((hp) => {
          const el = document.getElementById(hp.targetId)
          if (!el) return null
          const r = el.getBoundingClientRect()
          return {
            ...hp,
            top: r.top - stageRect.top,
            left: r.left - stageRect.left,
            width: r.width,
            height: r.height,
          }
        })
        .filter(Boolean)
      setPositions(measured)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [scenario.id, stageRef])

  return (
    <div className="absolute inset-0 z-50">

      {/* Dark backdrop with transparent cutouts at hotspot positions */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="xray-mask">
            {/* White = show the dark rect; black = hide it (creates transparent hole) */}
            <rect x="-1" y="-1" width="99999" height="99999" fill="white" />
            {positions.map((hp) => (
              <rect
                key={hp.targetId}
                x={hp.left - PAD}
                y={hp.top - PAD}
                width={hp.width + PAD * 2}
                height={hp.height + PAD * 2}
                rx="5"
                fill="black"
              />
            ))}
          </mask>
        </defs>
        <rect x="-1" y="-1" width="99999" height="99999" fill="rgba(2,6,23,0.84)" mask="url(#xray-mask)" />
      </svg>

      {/* Hotspot highlights */}
      {positions.map((hp) => {
        const isDanger = hp.severity === 'danger'
        const isSafe = hp.severity === 'safe'
        const borderColor = isDanger ? '#ef4444' : isSafe ? '#22c55e' : '#f97316'
        const shadowRgb = isDanger ? 'rgba(239,68,68,0.7)' : isSafe ? 'rgba(34,197,94,0.7)' : 'rgba(249,115,22,0.7)'
        const pillBg = isDanger ? 'rgba(127,29,29,0.9)' : isSafe ? 'rgba(20,83,45,0.9)' : 'rgba(120,53,15,0.9)'
        const pillText = isDanger ? '#fca5a5' : isSafe ? '#86efac' : '#fdba74'
        const emoji = isDanger ? '🔴' : isSafe ? '🟢' : '🟠'
        const tooltipBorder = isDanger ? 'rgba(239,68,68,0.4)' : isSafe ? 'rgba(34,197,94,0.4)' : 'rgba(249,115,22,0.4)'
        const tooltipTitle = isDanger ? '#f87171' : isSafe ? '#4ade80' : '#fb923c'
        const isActive = hp.targetId === activeHotspotId

        return (
          <div key={hp.targetId}>
            {/* Glowing border */}
            <div
              className="absolute rounded pointer-events-none transition-all duration-200"
              style={{
                top: hp.top - PAD,
                left: hp.left - PAD,
                width: hp.width + PAD * 2,
                height: hp.height + PAD * 2,
                border: `2px solid ${borderColor}`,
                boxShadow: `0 0 ${isActive ? 24 : 12}px ${shadowRgb}`,
              }}
            />

            {/* Clickable hit area */}
            <button
              className="absolute cursor-pointer"
              style={{
                top: hp.top - PAD,
                left: hp.left - PAD,
                width: hp.width + PAD * 2,
                height: hp.height + PAD * 2,
              }}
              onClick={() => onHotspotClick(isActive ? null : hp.targetId)}
            />

            {/* Label pill above the highlight */}
            <div
              className="absolute pointer-events-none"
              style={{ top: hp.top - PAD - 24, left: hp.left - PAD }}
            >
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border select-none"
                style={{
                  background: pillBg,
                  borderColor: borderColor,
                  color: pillText,
                }}
              >
                {emoji} {hp.label}
              </span>
            </div>

            {/* Tooltip on click */}
            {isActive && (
              <div
                className="absolute z-10 w-72 rounded-xl border p-4 shadow-2xl"
                style={{
                  top: hp.top + hp.height + PAD + 8,
                  left: Math.max(8, Math.min(hp.left - PAD, (stageRef.current?.offsetWidth ?? 800) - 296)),
                  background: '#0d1117',
                  borderColor: tooltipBorder,
                }}
              >
                <p className="text-[11px] font-bold mb-1.5" style={{ color: tooltipTitle }}>
                  {hp.label}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">{hp.explanation}</p>
              </div>
            )}
          </div>
        )
      })}

      {/* Bottom status chip */}
      <div className="absolute bottom-5 right-5 flex items-center gap-2.5 bg-slate-900/95 border border-slate-700/60 rounded-full px-4 py-2 shadow-xl pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-bold text-red-400 tracking-widest uppercase">X-Ray Activo</span>
        <span className="text-[10px] text-slate-500">· Haz clic en los puntos resaltados</span>
      </div>
    </div>
  )
}
