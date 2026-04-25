import { FileText, FileCode, File, FolderOpen, Archive } from 'lucide-react'

const ICON_MAP = {
  pdf:        { Icon: FileText,  color: '#e11d48', bg: '#fff1f2' },
  word:       { Icon: FileText,  color: '#2563eb', bg: '#eff6ff' },
  excel:      { Icon: FileText,  color: '#16a34a', bg: '#f0fdf4' },
  powerpoint: { Icon: FileText,  color: '#ea580c', bg: '#fff7ed' },
  exe:        { Icon: FileCode,  color: '#6b7280', bg: '#f9fafb' },
  zip:        { Icon: Archive,   color: '#d97706', bg: '#fffbeb' },
  generic:    { Icon: File,      color: '#6b7280', bg: '#f9fafb' },
}

const KIND_MAP = {
  pdf:        'Documento PDF',
  word:       'Documento Word',
  excel:      'Hoja de cálculo',
  powerpoint: 'Presentación',
  exe:        'Aplicación',
  zip:        'Archivo comprimido',
  generic:    'Documento',
}

function FileRow({ file, isEven }) {
  const { Icon, color } = ICON_MAP[file.icon] ?? ICON_MAP.generic

  return (
    <div
      id={file.id}
      className={`flex items-center px-4 py-1.5 cursor-default hover:bg-[#3478f6]/10 select-none group ${
        isEven ? 'bg-white' : 'bg-gray-50/60'
      }`}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <Icon className="w-5 h-5 flex-shrink-0" style={{ color }} />
        <span className="text-sm text-gray-800 truncate">{file.name}</span>
      </div>
      <div className="w-36 text-xs text-gray-500 flex-shrink-0">{file.date}</div>
      <div className="w-20 text-xs text-gray-500 flex-shrink-0 text-right pr-4">{file.size}</div>
      <div className="w-36 text-xs text-gray-500 flex-shrink-0">{file.kind ?? KIND_MAP[file.icon] ?? 'Documento'}</div>
    </div>
  )
}

export function FileView({ scenario }) {
  const { content } = scenario

  const sidebarItems = [
    { label: 'AirDrop',     emoji: '📶' },
    { label: 'Recientes',   emoji: '🕐' },
    { label: 'Inicio',      emoji: '🏠' },
    { label: 'Escritorio',  emoji: '💻' },
    { label: 'Documentos',  emoji: '📄' },
    { label: 'Descargas',   emoji: '⬇️' },
  ]

  const activeLabel = content.folderName.startsWith('Documentos') ? 'Documentos' : 'Descargas'

  return (
    <div className="flex h-full bg-[#f0f0f0]" style={{ fontFamily: '-apple-system, system-ui, sans-serif' }}>
      {/* Finder sidebar */}
      <div className="w-44 bg-[#e5e5e5] border-r border-gray-300 flex flex-col pt-6 flex-shrink-0">
        <div className="px-3 pb-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          Favoritos
        </div>
        {sidebarItems.map(({ label, emoji }) => (
          <div
            key={label}
            className={`flex items-center gap-2 px-3 py-1 rounded-md mx-1.5 text-sm cursor-default ${
              label === activeLabel
                ? 'bg-[#3478f6] text-white'
                : 'text-gray-700 hover:bg-gray-300/60'
            }`}
          >
            <span className="text-base leading-none">{emoji}</span>
            <span>{label}</span>
          </div>
        ))}

        <div className="mt-4 px-3 pb-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          Ubicaciones
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-md mx-1.5 text-sm text-gray-700">
          <span className="text-base leading-none">💾</span>
          <span>Macintosh HD</span>
        </div>
      </div>

      {/* Main Finder pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-10 bg-[#e5e5e5] border-b border-gray-300 flex items-center px-4 gap-3 flex-shrink-0">
          <button className="text-gray-400 text-lg leading-none select-none">‹</button>
          <button className="text-gray-300 text-lg leading-none select-none">›</button>
          <div className="flex items-center gap-1.5 ml-2">
            <FolderOpen size={14} className="text-[#3478f6]" />
            <span className="text-sm font-medium text-gray-700">{content.folderName}</span>
          </div>
        </div>

        {/* Column headers */}
        <div className="flex border-b border-gray-300 bg-[#ececec] px-4 py-1 flex-shrink-0">
          <div className="flex-1 text-[11px] text-gray-500 font-medium">Nombre</div>
          <div className="w-36 text-[11px] text-gray-500 font-medium">Fecha de modificación</div>
          <div className="w-20 text-[11px] text-gray-500 font-medium text-right pr-4">Tamaño</div>
          <div className="w-36 text-[11px] text-gray-500 font-medium">Tipo</div>
        </div>

        {/* File list */}
        <div className="flex-1 bg-white overflow-y-auto">
          {content.files.map((file, i) => (
            <FileRow key={file.name} file={file} isEven={i % 2 === 0} />
          ))}
        </div>
      </div>
    </div>
  )
}
