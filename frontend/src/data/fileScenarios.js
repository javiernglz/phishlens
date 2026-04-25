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

]
