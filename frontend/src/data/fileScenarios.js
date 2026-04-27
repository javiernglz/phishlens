export const fileScenarios = [
  // ─── EASY ────────────────────────────────────────────────────────────────

  {
    id: 'file-easy-001',
    module: 'file',
    isPhishing: true,
    level: 'easy',
    title: 'Ejecutable Directo (.exe)',
    description: 'Archivo malicioso con extensión .exe visible — Windows muestra UAC al intentar abrirlo',
    content: {
      os: 'windows',
      folderName: 'Descargas',
      files: [
        { name: 'vacaciones_fotos.zip',    icon: 'zip',  size: '4.2 MB',  date: '24/04/2026', kind: 'Archivo ZIP' },
        { name: 'presupuesto_abril.xlsx',  icon: 'excel', size: '128 KB', date: '24/04/2026', kind: 'Hoja de cálculo' },
        {
          name: 'PREMIO_RECLAMA_AHORA.exe',
          icon: 'exe',
          size: '892 KB',
          date: '25/04/2026',
          kind: 'Aplicación',
          id: 'hs-file',
          dialog: { type: 'uac', filename: 'PREMIO_RECLAMA_AHORA.exe' },
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Ejecutable Directo (.exe)',
        severity: 'danger',
        explanation: 'Los archivos .exe son programas que se ejecutan directamente en el sistema. El nombre en mayúsculas intenta crear urgencia. Windows muestra el diálogo UAC porque la aplicación quiere hacer cambios — el publicador es "Desconocido", señal clara de malware. Nunca abras un .exe recibido por email o descargado de un enlace no solicitado.',
      },
    ],
  },

  {
    id: 'file-legit-easy-001',
    module: 'file',
    isPhishing: false,
    level: 'easy',
    title: 'Documento PDF Normal',
    description: 'Archivo PDF legítimo con nombre y extensión coherentes — macOS muestra la vista previa sin alertas',
    content: {
      os: 'macos',
      folderName: 'Descargas',
      files: [
        { name: 'fotos_verano.zip',                icon: 'zip',  size: '210 MB', date: '20/04/2026', kind: 'Archivo comprimido' },
        {
          name: 'contrato_alquiler_mayo2026.pdf',
          icon: 'pdf',
          size: '312 KB',
          date: '25/04/2026',
          kind: 'Documento PDF',
          id: 'hs-file',
        },
        { name: 'presupuesto_reforma.xlsx', icon: 'excel', size: '88 KB', date: '23/04/2026', kind: 'Hoja de cálculo' },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Extensión y Nombre Coherentes',
        severity: 'safe',
        explanation: 'Un .pdf con nombre descriptivo en minúsculas, tamaño razonable (312 KB) y sin anomalías es seguro de abrir. Una sola extensión visible, sin urgencia en el nombre. Compara con los escenarios de phishing: .exe en mayúsculas, doble extensión .pdf.exe, o iconos de Word en archivos .scr.',
      },
    ],
  },

  // ─── MEDIUM ──────────────────────────────────────────────────────────────

  {
    id: 'file-legit-medium-001',
    module: 'file',
    isPhishing: false,
    level: 'medium',
    title: 'ZIP de Fotos del Evento',
    description: 'Archivo comprimido legítimo — tamaño y contenido coherentes con fotos de alta resolución',
    content: {
      os: 'macos',
      folderName: 'Descargas',
      files: [
        { name: 'orden_del_dia_mayo.pdf', icon: 'pdf', size: '412 KB', date: '24/04/2026', kind: 'Documento PDF' },
        {
          name: 'Fotos_Evento_Empresa_Abril2026.zip',
          icon: 'zip',
          size: '84.3 MB',
          date: '25/04/2026',
          kind: 'Archivo comprimido',
          id: 'hs-file',
        },
        { name: 'acta_reunion_q1.docx', icon: 'word', size: '72 KB', date: '22/04/2026', kind: 'Documento Word' },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'ZIP Legítimo — Tamaño y Contexto Coherentes',
        severity: 'safe',
        explanation: 'Un ZIP no es intrínsecamente peligroso — es un contenedor. 84 MB es coherente con fotos de alta resolución. Los ZIP maliciosos suelen pesar menos de 5 MB y contener ejecutables. Antes de extraer cualquier ZIP, comprueba su contenido sin descomprimirlo: clic derecho → "Ver contenido" en macOS.',
      },
    ],
  },

  {
    id: 'file-medium-001',
    module: 'file',
    isPhishing: true,
    level: 'medium',
    title: 'Extensión Doble (PDF.EXE)',
    description: 'Windows oculta .exe por defecto — el usuario ve un PDF pero es un ejecutable',
    content: {
      os: 'windows',
      folderName: 'Descargas',
      files: [
        { name: 'contrato_servicio.docx', icon: 'word', size: '245 KB', date: '24/04/2026', kind: 'Documento Word' },
        {
          name: 'Factura_Correos_2026_04.pdf.exe',
          displayName: 'Factura_Correos_2026_04.pdf',
          icon: 'pdf',
          size: '1.1 MB',
          date: '25/04/2026',
          kind: 'Aplicación',
          id: 'hs-file',
          dialog: {
            type: 'hidden-ext',
            displayName: 'Factura_Correos_2026_04.pdf',
            realName: 'Factura_Correos_2026_04.pdf.exe',
          },
        },
        { name: 'NIF_escaneado.pdf', icon: 'pdf', size: '312 KB', date: '23/04/2026', kind: 'Documento PDF' },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Extensión Doble — Windows la Oculta',
        severity: 'danger',
        explanation: 'Windows oculta extensiones conocidas por defecto. El archivo parece "Factura.pdf" pero es "Factura.pdf.exe". La columna Tipo lo delata: dice "Aplicación", no "Documento PDF". Al abrirlo se ejecuta el malware. Activa siempre "Mostrar extensiones de nombre de archivo" en Opciones de carpeta.',
      },
    ],
  },

  {
    id: 'file-medium-002',
    module: 'file',
    isPhishing: true,
    level: 'medium',
    title: 'Excel con Macros (.xlsm)',
    description: 'Factura de proveedor que ejecuta código malicioso al pulsar "Habilitar contenido"',
    content: {
      os: 'macos',
      folderName: 'Descargas',
      files: [
        { name: 'informe_reunion_abril.docx', icon: 'word', size: '94 KB', date: '23/04/2026', kind: 'Documento Word' },
        {
          name: 'Factura_Proveedor_ABR2026.xlsm',
          icon: 'excelm',
          size: '2.8 MB',
          date: '25/04/2026',
          kind: 'Hoja de cálculo con macros',
          id: 'hs-file',
          dialog: { type: 'macro-excel', filename: 'Factura_Proveedor_ABR2026.xlsm' },
        },
        { name: 'catalogo_precios_2026.pdf', icon: 'pdf', size: '1.1 MB', date: '22/04/2026', kind: 'Documento PDF' },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Extensión .xlsm — Macros Embebidas',
        severity: 'danger',
        explanation: '".xlsm" es un Excel con macros — código que se ejecuta dentro del documento. El tipo "Hoja de cálculo con macros" lo confirma en el Finder. Al abrir, Excel muestra la barra amarilla "Habilitar contenido": hacerlo descarga y ejecuta el payload. Ninguna factura legítima necesita macros para mostrarse.',
      },
    ],
  },

  {
    id: 'file-medium-003',
    module: 'file',
    isPhishing: true,
    level: 'medium',
    title: 'Imagen de Disco ISO Infectada',
    description: 'ISO con ejecutable dentro — al montarlo Windows lo trata como unidad de confianza',
    content: {
      os: 'windows',
      folderName: 'Descargas',
      files: [
        { name: 'contrato_nda_firmado.pdf', icon: 'pdf', size: '398 KB', date: '24/04/2026', kind: 'Documento PDF' },
        {
          name: 'Adobe_Acrobat_License_2026.iso',
          icon: 'iso',
          size: '1.3 MB',
          date: '25/04/2026',
          kind: 'Imagen de disco',
          id: 'hs-file',
          dialog: {
            type: 'iso-mount',
            diskName: 'ADOBE_LICENSE',
            exeFile: 'Adobe_License_2026.exe',
            exeSize: '1.2 MB',
          },
        },
        { name: 'licencias_software_2026.pdf', icon: 'pdf', size: '214 KB', date: '20/04/2026', kind: 'Documento PDF' },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'ISO — Técnica para Saltarse Filtros de Email',
        severity: 'danger',
        explanation: 'Los .iso son un vector de ataque moderno. Outlook bloqueaba los .exe adjuntos, así que los atacantes los empaquetan en imágenes de disco. Al montar el ISO, Windows lo trata como unidad de confianza y el ejecutable no hereda la etiqueta "Descargado de Internet". Además, una licencia de Adobe legítima nunca llega como imagen de disco.',
      },
    ],
  },

  {
    id: 'file-medium-004',
    module: 'file',
    isPhishing: true,
    level: 'medium',
    title: 'Acceso Directo con Icono Excel (.lnk)',
    description: 'Windows oculta .lnk y muestra icono de Excel — al abrirlo ejecuta PowerShell',
    content: {
      os: 'windows',
      folderName: 'Descargas',
      files: [
        { name: 'notas_reunion_25abr.docx', icon: 'word', size: '91 KB', date: '25/04/2026', kind: 'Documento Word' },
        {
          name: 'Presupuesto_Final_2026.xlsx.lnk',
          displayName: 'Presupuesto_Final_2026.xlsx',
          icon: 'lnk',
          size: '2 KB',
          date: '25/04/2026',
          kind: 'Acceso directo',
          id: 'hs-file',
          dialog: {
            type: 'lnk-target',
            target: 'C:\\Windows\\System32\\powershell.exe -WindowStyle Hidden -enc SQBFAFgAKABOAGUAdwAtAE8AYgBqAGUAYwB0...',
          },
        },
        { name: 'catalogo_productos_q2.pdf', icon: 'pdf', size: '2.4 MB', date: '23/04/2026', kind: 'Documento PDF' },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Acceso Directo .lnk — Dos Señales Visibles',
        severity: 'danger',
        explanation: 'Dos pistas delatan el fraude: el Tipo dice "Acceso directo" en lugar de "Hoja de cálculo", y el tamaño es solo 2 KB — un Excel real pesaría decenas de KB mínimo. Las propiedades revelan que el destino es PowerShell con un comando codificado en Base64 que descarga malware en segundo plano.',
      },
    ],
  },

  // ─── HARD ────────────────────────────────────────────────────────────────

  {
    id: 'file-legit-hard-001',
    module: 'file',
    isPhishing: false,
    level: 'hard',
    title: 'Instalador VPN Corporativa',
    description: 'Ejecutable legítimo recibido tras solicitud previa a TI — la fuente y el contexto lo validan',
    content: {
      os: 'windows',
      folderName: 'Descargas',
      files: [
        { name: 'reunion_notas_24abr.docx', icon: 'word', size: '94 KB', date: '24/04/2026', kind: 'Documento Word' },
        {
          name: 'GlobalProtect64.msi',
          icon: 'msi',
          size: '38.2 MB',
          date: '25/04/2026',
          kind: 'Instalador Windows',
          id: 'hs-file',
        },
        { name: 'politica_seguridad_2026.pdf', icon: 'pdf', size: '1.2 MB', date: '15/03/2026', kind: 'Documento PDF' },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Instalador Legítimo — Contexto y Tamaño Coherentes',
        severity: 'safe',
        explanation: 'Un .msi es un instalador de Windows — inofensivo si proviene de una fuente de confianza. La clave es el contexto: TI avisó de esta instalación y el tamaño (38 MB) es coherente con una VPN real. Sin ese contexto previo, cualquier ejecutable no solicitado debe tratarse con precaución incluso si el nombre parece corporativo.',
      },
    ],
  },

  {
    id: 'file-hard-001',
    module: 'file',
    isPhishing: true,
    level: 'hard',
    title: 'Icono Manipulado (.SCR)',
    description: 'Screensaver con icono de Word — SmartScreen revela la extensión real al intentar ejecutarlo',
    content: {
      os: 'windows',
      folderName: 'Documentos compartidos',
      files: [
        { name: 'Q1_2026_resultados.xlsx',    icon: 'excel',      size: '2.8 MB', date: '24/04/2026', kind: 'Hoja de cálculo' },
        { name: 'estrategia_2026.pptx',       icon: 'powerpoint', size: '5.1 MB', date: '24/04/2026', kind: 'Presentación' },
        {
          name: 'Informe_Confidencial_RRHH_Salarios.docx',
          icon: 'word',
          size: '892 KB',
          date: '25/04/2026',
          kind: 'Documento Word',
          id: 'hs-file',
          dialog: { type: 'security-warning', filename: 'Informe_Confidencial_RRHH_Salarios.scr' },
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Icono y Nombre Falsos — SmartScreen Revela .SCR',
        severity: 'danger',
        explanation: 'El archivo parece un Word normal, pero SmartScreen expone el nombre real: ".scr" (screensaver), que en Windows es un ejecutable completo. El atacante le asignó un icono de Word y un nombre irresistible ("Salarios"). Antes de abrir cualquier archivo corporativo sensible, comprueba sus propiedades — el tipo real no puede falsificarse en el panel de detalles.',
      },
    ],
  },

  {
    id: 'file-hard-002',
    module: 'file',
    isPhishing: true,
    level: 'hard',
    title: 'Carta de Oferta de Trabajo (.docm)',
    description: 'Word habilitado para macros disfrazado de oferta laboral — la barra amarilla es la trampa',
    content: {
      os: 'macos',
      folderName: 'Descargas',
      files: [
        { name: 'CV_actualizado_2026.pdf', icon: 'pdf', size: '290 KB', date: '24/04/2026', kind: 'Documento PDF' },
        {
          name: 'Oferta_Trabajo_Confidencial_RRHH.docm',
          icon: 'wordm',
          size: '3.1 MB',
          date: '25/04/2026',
          kind: 'Documento Word habilitado para macros',
          id: 'hs-file',
          dialog: { type: 'macro-word', filename: 'Oferta_Trabajo_Confidencial_RRHH.docm' },
        },
        { name: 'referencias_laborales.pdf', icon: 'pdf', size: '156 KB', date: '22/04/2026', kind: 'Documento PDF' },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Extensión .docm — Word con Macros Activas',
        severity: 'danger',
        explanation: '".docm" es un documento Word con macros: código que se ejecuta al pulsar "Habilitar contenido". El tipo "Documento Word habilitado para macros" en el Finder lo confirma. Ninguna carta de oferta de trabajo necesita macros — el contenido legítimo usa .pdf o .docx estándar. Si Word muestra la barra amarilla, cierra el archivo.',
      },
    ],
  },

  {
    id: 'file-legit-hard-002',
    module: 'file',
    isPhishing: false,
    level: 'hard',
    title: 'Instalador de Chrome (.exe)',
    description: 'Ejecutable legítimo descargado del sitio oficial — la fuente importa más que la extensión',
    content: {
      os: 'windows',
      folderName: 'Descargas',
      files: [
        { name: 'presupuesto_obras_mayo.pdf', icon: 'pdf', size: '1.1 MB', date: '24/04/2026', kind: 'Documento PDF' },
        {
          name: 'ChromeSetup.exe',
          icon: 'exe',
          size: '1.3 MB',
          date: '25/04/2026',
          kind: 'Aplicación',
          id: 'hs-file',
        },
        { name: 'acta_comunidad_abril.pdf', icon: 'pdf', size: '204 KB', date: '21/04/2026', kind: 'Documento PDF' },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Ejecutable Legítimo — La Fuente es la Clave',
        severity: 'safe',
        explanation: 'Un .exe no es siempre malware — todo instalador de Windows es un ejecutable. La diferencia es la fuente: "ChromeSetup.exe" descargado directamente de google.com/chrome es seguro. El mismo archivo recibido por email no solicitado sería una señal de alerta. Antes de ejecutar cualquier instalador: ¿lo descargué yo del sitio oficial? ¿El tamaño es coherente?',
      },
    ],
  },
]
