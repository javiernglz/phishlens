export const fileScenarios = [
  // ─── EASY ────────────────────────────────────────────────────────────────

  {
    id: 'file-easy-001',
    module: 'file',
    isPhishing: true,
    level: 'easy',
    title: 'Ejecutable Directo (.exe)',
    description: 'Archivo malicioso con extensión .exe visible',
    content: {
      folderName: 'Descargas',
      files: [
        { name: 'vacaciones_fotos.zip', icon: 'zip', size: '4.2 MB', date: '24/04/2026', kind: 'Archivo ZIP', safe: true },
        { name: 'presupuesto_abril.xlsx', icon: 'excel', size: '128 KB', date: '24/04/2026', kind: 'Hoja de cálculo', safe: true },
        {
          name: 'PREMIO_RECLAMA_AHORA.exe',
          icon: 'exe',
          size: '892 KB',
          date: '25/04/2026',
          kind: 'Aplicación',
          safe: false,
          id: 'hs-file',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Ejecutable Directo',
        severity: 'danger',
        explanation: 'Los archivos .exe son programas que se ejecutan directamente. El nombre en mayúsculas intenta crear urgencia. Nunca abras un .exe recibido por email o descargado de un enlace no solicitado.',
      },
    ],
  },

  {
    id: 'file-legit-easy-001',
    module: 'file',
    isPhishing: false,
    level: 'easy',
    title: 'Documento PDF Normal',
    description: 'Archivo PDF legítimo con nombre y extensión coherentes',
    content: {
      folderName: 'Descargas',
      files: [
        { name: 'fotos_verano.zip', icon: 'zip', size: '210 MB', date: '20/04/2026', kind: 'Archivo ZIP', safe: true },
        {
          name: 'contrato_alquiler_mayo2026.pdf',
          icon: 'pdf',
          size: '312 KB',
          date: '25/04/2026',
          kind: 'Documento PDF',
          safe: true,
          id: 'hs-file',
        },
        { name: 'presupuesto_reforma.xlsx', icon: 'excel', size: '88 KB', date: '23/04/2026', kind: 'Hoja de cálculo', safe: true },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Extensión y Nombre Coherentes',
        severity: 'safe',
        explanation: 'Un .pdf con nombre descriptivo en minúsculas, tamaño razonable y sin anomalías es seguro de abrir. Una sola extensión visible, sin urgencia en el nombre. Compara con los escenarios de phishing: .exe en mayúsculas, doble extensión .pdf.exe, o iconos de Word en archivos .scr.',
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
    description: 'Archivo comprimido legítimo — tamaño y contenido coherentes con fotos reales',
    content: {
      folderName: 'Descargas',
      files: [
        { name: 'orden_del_dia_mayo.pdf', icon: 'pdf', size: '412 KB', date: '24/04/2026', kind: 'Documento PDF', safe: true },
        {
          name: 'Fotos_Evento_Empresa_Abril2026.zip',
          icon: 'zip',
          size: '84.3 MB',
          date: '25/04/2026',
          kind: 'Archivo comprimido',
          safe: true,
          id: 'hs-file',
        },
        { name: 'acta_reunion_q1.docx', icon: 'word', size: '72 KB', date: '22/04/2026', kind: 'Documento Word', safe: true },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'ZIP Legítimo — Tamaño y Contexto Coherentes',
        severity: 'safe',
        explanation: 'Un ZIP no es intrínsecamente peligroso — es un contenedor. 84 MB es coherente con fotos de alta resolución. Los ZIP maliciosos suelen pesar menos de 5 MB y contener ejecutables. Antes de extraer cualquier ZIP, comprueba su contenido sin descomprimirlo: clic derecho → "Ver contenido" en macOS o "Abrir con" el explorador en Windows.',
      },
    ],
  },

  {
    id: 'file-medium-001',
    module: 'file',
    isPhishing: true,
    level: 'medium',
    title: 'Extensión Doble (PDF.EXE)',
    description: 'Ejecutable camuflado bajo una extensión de documento',
    content: {
      folderName: 'Descargas',
      files: [
        { name: 'contrato_servicio.docx', icon: 'word', size: '245 KB', date: '24/04/2026', kind: 'Documento Word', safe: true },
        {
          name: 'Factura_Correos_2026_04.pdf.exe',
          icon: 'pdf',
          size: '1.1 MB',
          date: '25/04/2026',
          kind: 'Aplicación',
          safe: false,
          id: 'hs-file',
          note: 'Windows oculta por defecto las extensiones conocidas. El usuario ve solo "Factura_Correos_2026_04.pdf"',
        },
        { name: 'NIF_escaneado.pdf', icon: 'pdf', size: '312 KB', date: '23/04/2026', kind: 'Documento PDF', safe: true },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Extensión Doble',
        severity: 'danger',
        explanation: 'Windows oculta extensiones conocidas por defecto. El archivo parece "Factura.pdf" pero es "Factura.pdf.exe". Al abrirlo se ejecuta el malware. Activa siempre "Mostrar extensiones de archivo" en el Explorador.',
      },
    ],
  },

  {
    id: 'file-medium-002',
    module: 'file',
    isPhishing: true,
    level: 'medium',
    title: 'Excel con Macros (.xlsm)',
    description: 'Factura de proveedor que ejecuta código malicioso al habilitar macros',
    content: {
      folderName: 'Descargas',
      files: [
        { name: 'informe_reunion_abril.docx', icon: 'word', size: '94 KB', date: '23/04/2026', kind: 'Documento Word', safe: true },
        {
          name: 'Factura_Proveedor_ABR2026.xlsm',
          icon: 'excel',
          size: '2.8 MB',
          date: '25/04/2026',
          kind: 'Hoja de cálculo con macros',
          safe: false,
          id: 'hs-file',
          note: 'Al abrir, Excel muestra "Contenido deshabilitado — pulsa Habilitar contenido para ver la factura". Hacerlo ejecuta el malware.',
        },
        { name: 'catalogo_precios_2026.pdf', icon: 'pdf', size: '1.1 MB', date: '22/04/2026', kind: 'Documento PDF', safe: true },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Extensión .xlsm — Macros Embebidas',
        severity: 'danger',
        explanation: '".xlsm" es un Excel con macros — código que se ejecuta dentro del documento. El tipo "Hoja de cálculo con macros" lo confirma en el Finder. Ninguna factura legítima necesita macros para mostrarse. Si Excel te muestra la barra amarilla "Habilitar contenido", cierra el archivo y pide al proveedor un PDF o un .xlsx estándar.',
      },
    ],
  },

  {
    id: 'file-medium-003',
    module: 'file',
    isPhishing: true,
    level: 'medium',
    title: 'Imagen de Disco ISO Infectada',
    description: 'ISO con ejecutable dentro — técnica moderna para saltarse filtros de email',
    content: {
      folderName: 'Descargas',
      files: [
        { name: 'contrato_nda_firmado.pdf', icon: 'pdf', size: '398 KB', date: '24/04/2026', kind: 'Documento PDF', safe: true },
        {
          name: 'Adobe_Acrobat_License_2026.iso',
          icon: 'generic',
          size: '1.3 MB',
          date: '25/04/2026',
          kind: 'Imagen de disco',
          safe: false,
          id: 'hs-file',
          note: 'El ISO contiene un único ejecutable. Al montarlo, Windows lo trata como unidad de confianza, saltándose los filtros Mark of the Web de Outlook y Edge.',
        },
        { name: 'licencias_software_2026.pdf', icon: 'pdf', size: '214 KB', date: '20/04/2026', kind: 'Documento PDF', safe: true },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'ISO — Técnica para Saltarse Filtros de Email',
        severity: 'danger',
        explanation: 'Los .iso son un vector de ataque moderno. Outlook bloqueaba los .exe adjuntos, así que los atacantes los empaquetan en imágenes de disco. Al montar un ISO, Windows lo trata como unidad de confianza y el ejecutable no hereda la etiqueta de riesgo "Descargado de Internet". Además, una licencia de software legítima nunca llega como imagen de disco.',
      },
    ],
  },

  {
    id: 'file-medium-004',
    module: 'file',
    isPhishing: true,
    level: 'medium',
    title: 'Acceso Directo con Icono Excel (.lnk)',
    description: 'Archivo .lnk camuflado — Windows oculta la extensión y el usuario ve un Excel falso',
    content: {
      folderName: 'Descargas',
      files: [
        { name: 'notas_reunion_25abr.docx', icon: 'word', size: '91 KB', date: '25/04/2026', kind: 'Documento Word', safe: true },
        {
          name: 'Presupuesto_Final_2026.xlsx.lnk',
          icon: 'excel',
          size: '2 KB',
          date: '25/04/2026',
          kind: 'Acceso directo',
          safe: false,
          id: 'hs-file',
          note: 'Windows oculta .lnk (extensión conocida) y muestra "Presupuesto_Final_2026.xlsx" con icono de Excel. El archivo ejecuta PowerShell que descarga malware.',
        },
        { name: 'catalogo_productos_q2.pdf', icon: 'pdf', size: '2.4 MB', date: '23/04/2026', kind: 'Documento PDF', safe: true },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Acceso Directo .lnk — Dos Señales Visibles',
        severity: 'danger',
        explanation: 'Dos pistas delatan el fraude en esta vista: el Tipo dice "Acceso directo" en lugar de "Hoja de cálculo", y el tamaño es solo 2 KB — un Excel real pesaría decenas de KB mínimo. En Windows, la extensión .lnk se oculta por defecto y el usuario solo ve el icono de Excel. Los accesos directos pueden ejecutar cualquier comando del sistema operativo.',
      },
    ],
  },

  // ─── HARD: legít → phishing ──────────────────────────────────────────────

  {
    id: 'file-legit-hard-001',
    module: 'file',
    isPhishing: false,
    level: 'hard',
    title: 'Instalador VPN Corporativa',
    description: 'Ejecutable legítimo recibido tras solicitud previa a TI',
    content: {
      folderName: 'Descargas',
      files: [
        { name: 'reunion_notas_24abr.docx', icon: 'word', size: '94 KB', date: '24/04/2026', kind: 'Documento Word', safe: true },
        {
          name: 'GlobalProtect64.msi',
          icon: 'generic',
          size: '38.2 MB',
          date: '25/04/2026',
          kind: 'Instalador Windows',
          safe: true,
          id: 'hs-file',
        },
        { name: 'politica_seguridad_2026.pdf', icon: 'pdf', size: '1.2 MB', date: '15/03/2026', kind: 'Documento PDF', safe: true },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Instalador Legítimo con Contexto',
        severity: 'safe',
        explanation: 'Un .msi es un instalador de Windows — inofensivo si proviene de una fuente de confianza. La clave es el contexto: ¿TI te avisó de esta instalación? ¿Lo descargaste del portal oficial de la empresa? Sin ese contexto previo, cualquier ejecutable no solicitado debe tratarse con precaución.',
      },
    ],
  },

  {
    id: 'file-hard-001',
    module: 'file',
    isPhishing: true,
    level: 'hard',
    title: 'Icono Manipulado (.SCR)',
    description: 'Screensaver con icono de Word camuflado como informe confidencial',
    content: {
      folderName: 'Documentos compartidos',
      files: [
        { name: 'Q1_2026_resultados.xlsx', icon: 'excel', size: '2.8 MB', date: '24/04/2026', kind: 'Hoja de cálculo', safe: true },
        { name: 'estrategia_2026.pptx', icon: 'powerpoint', size: '5.1 MB', date: '24/04/2026', kind: 'Presentación', safe: true },
        {
          name: 'Informe_Confidencial_RRHH_Salarios.docx',
          icon: 'word',
          size: '892 KB',
          date: '25/04/2026',
          kind: 'Documento Word',
          safe: false,
          id: 'hs-file',
          note: 'El archivo real es .scr (screensaver/ejecutable). Tiene icono de Word personalizado y metadatos falsificados.',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Icono y Nombre Manipulados',
        severity: 'danger',
        explanation: 'Los archivos .scr (screensaver) son ejecutables que Windows permite correr directamente. El atacante le asigna un icono de Word y un nombre irresistible ("Salarios"). Revisa las propiedades del archivo: el tipo real delata el fraude.',
      },
    ],
  },


  {
    id: 'file-hard-002',
    module: 'file',
    isPhishing: true,
    level: 'hard',
    title: 'Carta de Oferta de Trabajo (.docm)',
    description: 'Word habilitado para macros disfrazado de oferta laboral confidencial',
    content: {
      folderName: 'Descargas',
      files: [
        { name: 'CV_actualizado_2026.pdf', icon: 'pdf', size: '290 KB', date: '24/04/2026', kind: 'Documento PDF', safe: true },
        {
          name: 'Oferta_Trabajo_Confidencial_RRHH.docm',
          icon: 'word',
          size: '3.1 MB',
          date: '25/04/2026',
          kind: 'Documento Word habilitado para macros',
          safe: false,
          id: 'hs-file',
          note: 'Al abrirse, Word muestra "Este documento contiene macros — Habilitar contenido para ver la oferta". Las macros descargan y ejecutan un payload.',
        },
        { name: 'referencias_laborales.pdf', icon: 'pdf', size: '156 KB', date: '22/04/2026', kind: 'Documento PDF', safe: true },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Extensión .docm — Word con Macros',
        severity: 'danger',
        explanation: '".docm" es el equivalente de ".xlsm" pero para Word: un documento con macros activas. Ninguna carta de oferta de trabajo necesita macros — el contenido legítimo usa .pdf o .docx estándar. Si Word muestra la barra amarilla "Habilitar contenido", el documento quiere ejecutar código. Cierra el archivo y pide al remitente un PDF.',
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
      folderName: 'Descargas',
      files: [
        { name: 'presupuesto_obras_mayo.pdf', icon: 'pdf', size: '1.1 MB', date: '24/04/2026', kind: 'Documento PDF', safe: true },
        {
          name: 'ChromeSetup.exe',
          icon: 'exe',
          size: '1.3 MB',
          date: '25/04/2026',
          kind: 'Aplicación',
          safe: true,
          id: 'hs-file',
        },
        { name: 'acta_comunidad_abril.pdf', icon: 'pdf', size: '204 KB', date: '21/04/2026', kind: 'Documento PDF', safe: true },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-file',
        label: 'Ejecutable Legítimo — La Fuente es la Clave',
        severity: 'safe',
        explanation: 'Un .exe no es siempre malware — todo instalador de Windows es un ejecutable. La diferencia es la fuente: "ChromeSetup.exe" descargado directamente de google.com/chrome es seguro. El mismo archivo recibido por email no solicitado sería una señal de alerta. Antes de ejecutar cualquier instalador verifica: ¿lo descargué yo del sitio oficial? ¿El tamaño es coherente con lo que esperaba?',
      },
    ],
  },
]
