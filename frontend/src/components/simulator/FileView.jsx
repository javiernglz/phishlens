import { useState, useEffect } from 'react'
import { FolderOpen } from 'lucide-react'

// ─── Icon config ──────────────────────────────────────────────────────────────

const ICON_CFG = {
  pdf:     { bg: '#CC0000', label: 'PDF',  cls: 'text-[8px] font-black tracking-tight' },
  word:    { bg: '#2B579A', label: 'W',    cls: 'text-xl font-bold' },
  wordm:   { bg: '#2B579A', label: 'W',    cls: 'text-xl font-bold', badge: 'M' },
  excel:   { bg: '#1D6F42', label: 'X',    cls: 'text-xl font-bold' },
  excelm:  { bg: '#1D6F42', label: 'X',    cls: 'text-xl font-bold', badge: 'M' },
  exe:     { bg: '#546E7A', label: '⚙',    cls: 'text-lg' },
  zip:     { bg: '#E8A000', label: '▤',    cls: 'text-lg' },
  iso:     { bg: '#607D8B', label: '◎',    cls: 'text-lg' },
  lnk:    { bg: '#1D6F42', label: 'X',    cls: 'text-xl font-bold', shortcut: true },
  scr:     { bg: '#37474F', label: 'SCR',  cls: 'text-[7px] font-black tracking-tight' },
  msi:     { bg: '#0078D4', label: '⬇',    cls: 'text-lg' },
  powerpoint: { bg: '#D24726', label: 'P', cls: 'text-xl font-bold' },
  generic: { bg: '#78909C', label: '?',    cls: 'text-lg' },
}

function FileIcon({ type, px = 60, round = 'rounded-xl' }) {
  const c = ICON_CFG[type] ?? ICON_CFG.generic
  return (
    <div className="relative inline-flex flex-shrink-0" style={{ width: px, height: px }}>
      <div
        className={`w-full h-full flex items-center justify-center text-white select-none ${c.cls} ${round}`}
        style={{ background: c.bg }}
      >
        {c.label}
      </div>
      {c.badge && (
        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[6px] font-black rounded px-1 leading-4 border border-white">
          {c.badge}
        </div>
      )}
      {c.shortcut && (
        <div className="absolute bottom-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-sm flex items-center justify-center shadow">
          <span className="text-[8px] text-gray-600 leading-none">↗</span>
        </div>
      )}
    </div>
  )
}

function RowIcon({ type }) {
  const c = ICON_CFG[type] ?? ICON_CFG.generic
  return (
    <div className="relative inline-flex flex-shrink-0" style={{ width: 18, height: 18 }}>
      <div
        className="w-full h-full flex items-center justify-center text-white text-[6px] font-bold rounded select-none"
        style={{ background: c.bg }}
      >
        {c.label?.slice(0, 3)}
      </div>
      {c.badge && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-amber-500 text-white text-[5px] font-black rounded px-px leading-3 border border-white">
          {c.badge}
        </div>
      )}
      {c.shortcut && (
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-white rounded flex items-center justify-center">
          <span className="text-[5px] text-gray-600">↗</span>
        </div>
      )}
    </div>
  )
}

// ─── Dialog simulation ────────────────────────────────────────────────────────

function DialogMock({ dialog }) {
  if (!dialog) return null

  if (dialog.type === 'macro-excel' || dialog.type === 'macro-word') {
    const isExcel = dialog.type === 'macro-excel'
    const appBg = isExcel ? '#1D6F42' : '#2B579A'
    return (
      <div className="rounded overflow-hidden border border-gray-300 shadow-sm text-[10px]">
        <div className="px-2 py-0.5 text-white text-[9px] font-medium flex items-center gap-1 truncate" style={{ background: appBg }}>
          {isExcel ? 'Microsoft Excel' : 'Microsoft Word'}
          <span className="text-white/50 truncate">— {dialog.filename}</span>
        </div>
        <div className="bg-[#FFF8C5] border-b border-[#FFCE00] px-2 py-1.5 flex items-center gap-1.5">
          <span>⚠️</span>
          <span className="font-semibold text-gray-700 text-[9px] flex-shrink-0">ADVERTENCIA DE SEGURIDAD</span>
          <span className="text-gray-600 text-[9px] flex-1">Las macros han sido deshabilitadas.</span>
          <button className="bg-[#0078D4] text-white text-[8px] px-1.5 py-0.5 rounded flex-shrink-0">Habilitar contenido</button>
        </div>
        <div className="bg-white px-3 py-3 flex flex-col gap-1.5 opacity-25">
          {[55, 80, 40, 65, 50].map((w, i) => (
            <div key={i} className="h-1.5 bg-gray-400 rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (dialog.type === 'uac') {
    return (
      <div className="rounded overflow-hidden border border-gray-400 shadow-sm text-[10px]">
        <div className="bg-[#1A3A5C] text-white px-2 py-1 text-[9px] font-medium flex items-center gap-1.5">
          🛡️ Control de cuentas de usuario
        </div>
        <div className="bg-[#EEF3FB] px-3 py-2 space-y-1">
          <p className="text-gray-800 font-semibold text-[9px]">¿Deseas permitir que esta aplicación realice cambios en el dispositivo?</p>
          <div className="space-y-0.5 text-[9px]">
            <p className="text-gray-600">Aplicación: <span className="font-mono text-gray-800">{dialog.filename}</span></p>
            <p className="text-gray-600">Publicador: <span className="text-rose-600 font-semibold">Desconocido</span></p>
          </div>
        </div>
        <div className="bg-white px-2 py-1.5 flex gap-1.5 justify-end border-t border-gray-200">
          <button className="bg-[#0078D4] text-white text-[9px] px-3 py-0.5 rounded">Sí</button>
          <button className="bg-white border border-gray-300 text-gray-700 text-[9px] px-3 py-0.5 rounded">No</button>
        </div>
      </div>
    )
  }

  if (dialog.type === 'iso-mount') {
    return (
      <div className="rounded border border-gray-300 overflow-hidden shadow-sm text-[10px]">
        <div className="bg-[#1A3A5C] text-white px-2 py-1 text-[9px] flex items-center gap-1.5">
          💿 {dialog.diskName} (E:\) — montado
        </div>
        <div className="bg-white px-3 py-2 flex items-center gap-2">
          <span className="text-base">⚙️</span>
          <span className="font-mono text-rose-600 text-[9px] flex-1">{dialog.exeFile}</span>
          <span className="text-gray-400 text-[9px]">{dialog.exeSize}</span>
        </div>
        <div className="bg-amber-50 border-t border-amber-200 px-2 py-1 text-[9px] text-amber-700">
          ⚠ Ejecutable sin firma digital verificada
        </div>
      </div>
    )
  }

  if (dialog.type === 'hidden-ext') {
    return (
      <div className="rounded border border-gray-200 overflow-hidden shadow-sm text-[10px]">
        <div className="bg-slate-100 px-2 py-1 border-b text-[9px] font-semibold text-slate-600">
          Extensiones de archivo ocultas (Windows)
        </div>
        <div className="bg-white px-3 py-2 space-y-2">
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wide block mb-0.5">El usuario ve:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded flex items-center justify-center text-white text-[5px] font-black" style={{ background: '#CC0000' }}>PDF</div>
              <span className="font-mono text-slate-800 text-[9px]">{dialog.displayName}</span>
            </div>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wide block mb-0.5">Nombre real:</span>
            <span className="font-mono text-rose-600 font-semibold text-[9px]">{dialog.realName}</span>
          </div>
        </div>
        <div className="bg-rose-50 border-t border-rose-200 px-2 py-1 text-[9px] text-rose-700">
          ⚠ Activa "Mostrar extensiones" en Opciones de carpeta
        </div>
      </div>
    )
  }

  if (dialog.type === 'lnk-target') {
    return (
      <div className="rounded border border-gray-200 overflow-hidden shadow-sm text-[10px]">
        <div className="bg-slate-100 px-2 py-1 border-b text-[9px] font-semibold text-slate-600">
          Propiedades — Destino del acceso directo
        </div>
        <div className="bg-white px-3 py-2">
          <p className="font-mono text-rose-600 text-[8px] break-all leading-relaxed">{dialog.target}</p>
        </div>
        <div className="bg-amber-50 border-t border-amber-200 px-2 py-1 text-[9px] text-amber-700">
          ⚠ Ejecuta PowerShell oculto para descargar malware
        </div>
      </div>
    )
  }

  if (dialog.type === 'security-warning') {
    return (
      <div className="rounded overflow-hidden border border-gray-300 shadow-sm text-[10px]">
        <div className="bg-white border-b border-gray-200 px-2 py-1 text-[9px] font-semibold text-gray-700 flex items-center gap-1.5">
          🛡️ Windows SmartScreen
        </div>
        <div className="bg-[#FFF8E7] px-3 py-2 space-y-1">
          <p className="font-semibold text-gray-800 text-[9px]">Aplicación no reconocida bloqueada</p>
          <p className="text-gray-600 text-[9px] break-all">Archivo: <span className="font-mono text-gray-800">{dialog.filename}</span></p>
          <p className="text-[9px]">Publicador: <span className="text-rose-600 font-semibold">Desconocido (sin firma digital)</span></p>
        </div>
        <div className="bg-white px-2 py-1.5 flex gap-2 justify-end border-t border-gray-200">
          <span className="text-blue-600 text-[9px] underline cursor-default">Más información</span>
          <button className="bg-white border border-gray-300 text-gray-700 text-[9px] px-2 py-0.5 rounded">No ejecutar</button>
        </div>
      </div>
    )
  }

  return null
}

// ─── Inspector panel (macOS) ──────────────────────────────────────────────────

function MacInspector({ file }) {
  if (!file) return null
  const display = file.displayName ?? file.name
  return (
    <div className="w-52 bg-[#F0F0F0] border-l border-gray-300 flex flex-col overflow-y-auto flex-shrink-0">
      <div className="flex flex-col items-center pt-5 pb-4 px-3 border-b border-gray-300">
        <FileIcon type={file.icon} px={60} round="rounded-xl" />
        <p className="mt-2 text-center text-[11px] font-semibold text-gray-800 leading-tight break-all">{display}</p>
        {file.kind && <p className="text-[9px] text-gray-500 mt-0.5 text-center">{file.kind}</p>}
      </div>
      <div className="px-3 py-2.5 border-b border-gray-200">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">General</p>
        <dl className="space-y-1">
          {[{ k: 'Tamaño', v: file.size }, { k: 'Modificado', v: file.date }].map(({ k, v }) => (
            <div key={k} className="flex text-[10px]">
              <dt className="text-gray-400 w-20 flex-shrink-0">{k}:</dt>
              <dd className="text-gray-700 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      {file.dialog && (
        <div className="px-3 py-2.5">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Al abrirlo</p>
          <DialogMock dialog={file.dialog} />
        </div>
      )}
    </div>
  )
}

// ─── Details panel (Windows) ──────────────────────────────────────────────────

function WinDetails({ file }) {
  if (!file) return null
  const display = file.displayName ?? file.name
  return (
    <div className="w-52 bg-white border-l border-gray-200 flex flex-col overflow-y-auto flex-shrink-0">
      <div className="flex flex-col items-center pt-5 pb-3 px-3 border-b border-gray-200">
        <FileIcon type={file.icon} px={56} round="rounded" />
        <p className="mt-2 text-center text-[11px] font-semibold text-gray-800 leading-tight break-all">{display}</p>
        {file.kind && <p className="text-[9px] text-gray-500 mt-0.5 text-center">{file.kind}</p>}
      </div>
      <div className="px-3 py-2.5 border-b border-gray-100">
        <dl className="space-y-1">
          {[{ k: 'Tamaño', v: file.size }, { k: 'Modificado', v: file.date }].map(({ k, v }) => (
            <div key={k} className="flex text-[10px]">
              <dt className="text-gray-400 w-20 flex-shrink-0">{k}:</dt>
              <dd className="text-gray-700 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      {file.dialog && (
        <div className="px-3 py-2.5">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Al ejecutarlo</p>
          <DialogMock dialog={file.dialog} />
        </div>
      )}
    </div>
  )
}

// ─── macOS Finder ─────────────────────────────────────────────────────────────

const MAC_SIDEBAR = [
  { label: 'AirDrop',    icon: '📶' },
  { label: 'Recientes',  icon: '🕐' },
  { label: 'Inicio',     icon: '🏠' },
  { label: 'Escritorio', icon: '💻' },
  { label: 'Documentos', icon: '📄' },
  { label: 'Descargas',  icon: '⬇️' },
]

function MacFinder({ content, selectedFile, onSelect }) {
  const active = content.folderName?.startsWith('Documentos') ? 'Documentos' : 'Descargas'
  return (
    <div className="flex h-full bg-[#f0f0f0]" style={{ fontFamily: '-apple-system, system-ui, sans-serif' }}>
      <div className="w-40 bg-[#E8E8E8] border-r border-gray-300 flex flex-col pt-6 flex-shrink-0">
        <div className="px-3 pb-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Favoritos</div>
        {MAC_SIDEBAR.map(({ label, icon }) => (
          <div key={label} className={`flex items-center gap-2 px-3 py-0.5 rounded-md mx-1.5 text-[12px] cursor-default ${
            label === active ? 'bg-[#3478f6] text-white' : 'text-gray-700 hover:bg-gray-300/60'
          }`}>
            <span className="text-sm leading-none">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
        <div className="mt-3 px-3 pb-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Ubicaciones</div>
        <div className="flex items-center gap-2 px-3 py-0.5 mx-1.5 text-[12px] text-gray-700">
          <span className="text-sm leading-none">💾</span><span>Macintosh HD</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-9 bg-[#E8E8E8] border-b border-gray-300 flex items-center px-4 gap-3 flex-shrink-0">
          <span className="text-gray-400 text-lg leading-none select-none">‹</span>
          <span className="text-gray-300 text-lg leading-none select-none">›</span>
          <div className="flex items-center gap-1.5 ml-2">
            <FolderOpen size={13} className="text-[#3478f6]" />
            <span className="text-[12px] font-medium text-gray-700">{content.folderName}</span>
          </div>
        </div>
        <div className="flex border-b border-gray-300 bg-[#ECECEC] px-4 py-0.5 flex-shrink-0">
          <div className="flex-1 text-[10px] text-gray-500 font-medium">Nombre</div>
          <div className="w-32 text-[10px] text-gray-500 font-medium">Fecha de modificación</div>
          <div className="w-16 text-[10px] text-gray-500 font-medium text-right pr-3">Tamaño</div>
          <div className="w-36 text-[10px] text-gray-500 font-medium">Tipo</div>
        </div>
        <div className="flex-1 bg-white overflow-y-auto">
          {content.files.map((file, i) => {
            const sel = selectedFile?.name === file.name
            const display = file.displayName ?? file.name
            return (
              <div
                key={file.name}
                id={file.id}
                onClick={() => onSelect(file)}
                className={`flex items-center px-4 py-1 cursor-default select-none ${
                  sel ? 'bg-[#3478f6]' : i % 2 === 0 ? 'hover:bg-[#3478f6]/10' : 'bg-gray-50/60 hover:bg-[#3478f6]/10'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <RowIcon type={file.icon} />
                  <span className={`text-[12px] truncate ${sel ? 'text-white' : 'text-gray-800'}`}>{display}</span>
                </div>
                <div className={`w-32 text-[10px] flex-shrink-0 ${sel ? 'text-white/80' : 'text-gray-500'}`}>{file.date}</div>
                <div className={`w-16 text-[10px] flex-shrink-0 text-right pr-3 ${sel ? 'text-white/80' : 'text-gray-500'}`}>{file.size}</div>
                <div className={`w-36 text-[10px] flex-shrink-0 ${sel ? 'text-white/80' : 'text-gray-500'}`}>{file.kind}</div>
              </div>
            )
          })}
        </div>
      </div>

      <MacInspector file={selectedFile} />
    </div>
  )
}

// ─── Windows Explorer ─────────────────────────────────────────────────────────

const WIN_SIDEBAR = [
  { label: 'Escritorio',  icon: '💻' },
  { label: 'Descargas',   icon: '⬇️' },
  { label: 'Documentos',  icon: '📄' },
  { label: 'Imágenes',    icon: '🖼️' },
  { label: 'Este equipo', icon: '💾' },
]

function WinExplorer({ content, selectedFile, onSelect }) {
  return (
    <div className="flex h-full bg-[#F3F3F3]" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
      <div className="w-44 bg-white border-r border-gray-200 flex flex-col pt-3 flex-shrink-0">
        <div className="px-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Acceso rápido</div>
        {WIN_SIDEBAR.map(({ label, icon }) => {
          const isAct = content.folderName?.includes(label) || (label === 'Descargas' && !content.folderName?.includes('Documentos'))
          return (
            <div key={label} className={`flex items-center gap-2 px-3 py-0.5 text-[12px] cursor-default rounded mx-1 ${
              isAct ? 'bg-[#CCE4F7] text-gray-800' : 'text-gray-600 hover:bg-gray-100'
            }`}>
              <span className="text-sm leading-none">{icon}</span>
              <span>{label}</span>
            </div>
          )
        })}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-9 bg-white border-b border-gray-200 flex items-center px-3 gap-2 flex-shrink-0">
          <span className="text-gray-400 text-sm select-none">‹</span>
          <span className="text-gray-300 text-sm select-none">›</span>
          <div className="flex-1 bg-[#F3F3F3] border border-gray-300 rounded px-2 py-0.5 text-[11px] text-gray-600 font-mono">
            Este equipo › {content.folderName}
          </div>
        </div>
        <div className="flex border-b border-gray-200 bg-[#F9F9F9] px-3 py-0.5 flex-shrink-0">
          <div className="flex-1 text-[10px] text-gray-500 font-semibold">Nombre</div>
          <div className="w-32 text-[10px] text-gray-500 font-semibold">Fecha de modificación</div>
          <div className="w-16 text-[10px] text-gray-500 font-semibold text-right pr-3">Tamaño</div>
          <div className="w-36 text-[10px] text-gray-500 font-semibold">Tipo</div>
        </div>
        <div className="flex-1 bg-white overflow-y-auto">
          {content.files.map((file) => {
            const sel = selectedFile?.name === file.name
            const display = file.displayName ?? file.name
            return (
              <div
                key={file.name}
                id={file.id}
                onClick={() => onSelect(file)}
                className={`flex items-center px-3 py-1 cursor-default select-none ${
                  sel ? 'bg-[#CCE4F7]' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <RowIcon type={file.icon} />
                  <span className="text-[12px] text-gray-800 truncate">{display}</span>
                </div>
                <div className="w-32 text-[10px] text-gray-500 flex-shrink-0">{file.date}</div>
                <div className="w-16 text-[10px] text-gray-500 flex-shrink-0 text-right pr-3">{file.size}</div>
                <div className="w-36 text-[10px] text-gray-500 flex-shrink-0">{file.kind}</div>
              </div>
            )
          })}
        </div>
        <div className="h-6 bg-[#F9F9F9] border-t border-gray-200 flex items-center px-3 text-[10px] text-gray-500 flex-shrink-0">
          {selectedFile ? `1 elemento seleccionado · ${selectedFile.size}` : `${content.files.length} elementos`}
        </div>
      </div>

      <WinDetails file={selectedFile} />
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function FileView({ scenario }) {
  const { content } = scenario
  const focal = content.files.find(f => f.id === 'hs-file') ?? content.files[0]
  const [selected, setSelected] = useState(focal)

  useEffect(() => {
    setSelected(content.files.find(f => f.id === 'hs-file') ?? content.files[0])
  }, [scenario.id])

  return content.os === 'windows'
    ? <WinExplorer content={content} selectedFile={selected} onSelect={setSelected} />
    : <MacFinder content={content} selectedFile={selected} onSelect={setSelected} />
}
