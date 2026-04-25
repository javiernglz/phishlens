export const smsScenarios = [
  // ─── EASY: phishing → legít → phishing ───────────────────────────────────

  {
    id: 'sms-easy-001',
    module: 'sms',
    isPhishing: true,
    level: 'easy',
    title: 'Premio de Supermercado',
    description: 'SMS de premio falso desde número desconocido',
    content: {
      platform: 'sms',
      sender: '+34 622 098 341',
      senderName: null,
      messages: [
        {
          from: 'them',
          text: 'ENHORABUENA! Has sido seleccionado para recibir un IPHONE 15 GRATIS. Tienes 2 horas para reclamar tu premio:',
          time: '10:14',
        },
        {
          from: 'them',
          type: 'link',
          text: 'regalos-merkadona.net/iphone-gratis',
          time: '10:14',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Número Desconocido',
        severity: 'danger',
        explanation: 'Las empresas legítimas usan remitentes alfanuméricos (MERCADONA, CORREOS). Un número de móvil desconocido enviando ofertas es señal inmediata de fraude.',
      },
      {
        targetId: 'hs-link',
        label: 'Dominio Falso',
        severity: 'danger',
        explanation: '"regalos-merkadona.net" no es el dominio oficial (mercadona.es). La "k" en lugar de "c" y el sufijo .net son señales claras de dominio fraudulento creado para engañar.',
      },
    ],
  },

  {
    id: 'sms-legit-easy-001',
    module: 'sms',
    isPhishing: false,
    level: 'easy',
    title: 'Entrega Amazon',
    description: 'SMS de seguimiento de pedido real de Amazon',
    content: {
      platform: 'sms',
      sender: 'Amazon',
      senderName: 'Amazon',
      messages: [
        {
          from: 'them',
          text: 'Tu pedido #303-7841092-3456781 está en camino. Entrega estimada: hoy antes de las 18:00.',
          time: '08:47',
        },
        {
          from: 'them',
          type: 'link',
          text: 'amazon.es/orders/303-7841092-3456781',
          time: '08:47',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Remitente Oficial',
        severity: 'safe',
        explanation: 'Amazon siempre envía SMS desde el remitente alfanumérico "Amazon". Los mensajes legítimos de empresas usan nombres registrados, no números de teléfono desconocidos.',
      },
      {
        targetId: 'hs-link',
        label: 'Dominio Oficial Amazon',
        severity: 'safe',
        explanation: '"amazon.es" es el dominio oficial de Amazon en España. Sin guiones adicionales, sin subdominios sospechosos, sin extensiones inusuales. El número de pedido del enlace coincide con el del mensaje.',
      },
    ],
  },

  {
    id: 'wa-easy-001',
    module: 'sms',
    isPhishing: true,
    level: 'easy',
    title: 'Viral de Zara (WA)',
    description: 'Mensaje reenviado masivamente con premio falso',
    content: {
      platform: 'whatsapp',
      sender: '+34 666 234 812',
      senderName: 'Desconocido',
      messages: [
        {
          from: 'them',
          text: '⚠️⚠️ REENVÍA ESTE MENSAJE A 10 PERSONAS Y RECIBE 500€ EN TU CUENTA!! Zara está regalando tarjetas de regalo para celebrar su 50 aniversario. ¡Solo quedan 100 disponibles!!',
          time: '10:02',
          forwarded: true,
        },
        {
          from: 'them',
          type: 'link',
          text: 'zara-regalo50aniversario.com/gratis',
          time: '10:02',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Número Desconocido',
        severity: 'danger',
        explanation: 'Las empresas como Zara contactan por canales oficiales, nunca por WhatsApp desde números desconocidos. La instrucción de "reenviar a 10 personas" es la mecánica clásica de las cadenas de fraude viral.',
      },
      {
        targetId: 'hs-link',
        label: 'Dominio Fraudulento',
        severity: 'danger',
        explanation: '"zara-regalo50aniversario.com" no tiene relación con zara.com. Los dominios largos con guiones son una señal de alerta. Las marcas reales usan su dominio propio, no subdominios descriptivos.',
      },
    ],
  },

  // ─── MEDIUM: legít → phishing → phishing ─────────────────────────────────

  {
    id: 'sms-legit-medium-001',
    module: 'sms',
    isPhishing: false,
    level: 'medium',
    title: 'Confirmación Booking (WA)',
    description: 'Confirmación de reserva real vía WhatsApp Business',
    content: {
      platform: 'whatsapp',
      sender: 'Booking.com',
      senderName: 'Booking.com',
      messages: [
        {
          from: 'them',
          text: 'Hola! Tu reserva en Hotel Meliá Barcelona está confirmada. Check-in: 02/05/2026. Número de reserva: 3841920847.',
          time: '14:22',
        },
        {
          from: 'them',
          type: 'link',
          text: 'booking.com/myreservations/3841920847',
          time: '14:22',
          preview: {
            url: 'booking.com',
            title: 'Tu reserva — Hotel Meliá Barcelona',
            description: 'Check-in: 02 mayo · 1 habitación · 2 noches',
            headerBg: '#003580',
            brandText: 'booking.com',
          },
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'WhatsApp Business Verificado',
        severity: 'safe',
        explanation: 'Booking.com usa WhatsApp Business con nombre de empresa registrado. El mensaje llega solo después de hacer una reserva — contexto que tú mismo iniciaste. Las empresas legítimas no te contactan sin razón previa.',
      },
      {
        targetId: 'hs-link',
        label: 'Dominio Oficial',
        severity: 'safe',
        explanation: '"booking.com" es el dominio oficial, sin guiones ni extensiones añadidas. El número de reserva del enlace coincide con el del mensaje. Compara con el escenario de BBVA: "bbva.es-cliente-seguro.com" — allí "bbva" es solo un subdominio del dominio fraudulento.',
      },
    ],
  },

  {
    id: 'sms-medium-001',
    module: 'sms',
    isPhishing: true,
    level: 'medium',
    title: 'Paquete Retenido — Correos',
    description: 'Smishing clásico suplantando el servicio de paquetería',
    content: {
      platform: 'sms',
      sender: 'CORREOS',
      senderName: 'CORREOS',
      messages: [
        {
          from: 'them',
          text: 'CORREOS: Su paquete (ES928471623) no pudo ser entregado por dirección incompleta. Pague 1,89€ de gastos de gestión para reprogramar la entrega:',
          time: '12:31',
        },
        {
          from: 'them',
          type: 'link',
          text: 'correos-envios.com/reprogramar',
          time: '12:31',
        },
        {
          from: 'them',
          text: 'El paquete será devuelto al remitente en 48h si no se realiza el pago.',
          time: '12:31',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Remitente Suplantado',
        severity: 'warning',
        explanation: 'El nombre "CORREOS" puede ser falsificado mediante SMS spoofing. El dominio oficial es correos.es. Puede incluso aparecer en el mismo hilo que mensajes legítimos de Correos.',
      },
      {
        targetId: 'hs-link',
        label: 'Cobro Falso + Dominio Fraudulento',
        severity: 'danger',
        explanation: 'Correos nunca solicita pagos por SMS. "correos-envios.com" no es el dominio oficial. El importe pequeño (1,89€) está diseñado para que bajes la guardia y no dudes.',
      },
    ],
  },

  {
    id: 'wa-medium-001',
    module: 'sms',
    isPhishing: true,
    level: 'medium',
    title: 'Bloqueo BBVA (WA)',
    description: 'Bloqueo de tarjeta falso con link preview manipulada',
    content: {
      platform: 'whatsapp',
      sender: 'BBVA',
      senderName: 'BBVA',
      messages: [
        {
          from: 'them',
          text: 'BBVA: Hemos bloqueado temporalmente tu tarjeta terminada en 4521 por actividad inusual. Verifica tu identidad para desbloquearla:',
          time: '15:48',
        },
        {
          from: 'them',
          type: 'link',
          text: 'bbva.es-cliente-seguro.com/verificar',
          time: '15:48',
          preview: {
            url: 'bbva.es-cliente-seguro.com',
            title: 'BBVA — Banca Online',
            description: 'Accede de forma segura a tu cuenta BBVA y gestiona tu tarjeta',
            headerBg: '#004481',
            brandText: 'BBVA',
          },
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Nombre de Empresa Falsificado',
        severity: 'warning',
        explanation: 'WhatsApp Business permite registrar un nombre de empresa, pero puede ser falsificado. El dominio real de BBVA es bbva.es — cualquier variación con guiones es fraudulenta. BBVA nunca te bloqueará una tarjeta sin llamarte primero.',
      },
      {
        targetId: 'hs-link',
        label: 'Subdominio Trampa + Preview Falsa',
        severity: 'danger',
        explanation: '"bbva.es-cliente-seguro.com": el dominio real es "es-cliente-seguro.com" — "bbva" es solo un subdominio. El atacante controla la preview del enlace y puede poner cualquier título e imagen para que parezca legítima.',
      },
    ],
  },

  // ─── HARD: phishing → phishing → legít ───────────────────────────────────

  {
    id: 'sms-hard-001',
    module: 'sms',
    isPhishing: true,
    level: 'hard',
    title: 'Alerta de Cargo Bancario',
    description: 'Smishing bancario con remitente suplantado y urgencia extrema',
    content: {
      platform: 'sms',
      sender: 'SANTANDER',
      senderName: 'Santander',
      messages: [
        {
          from: 'them',
          text: 'Banco Santander: Hemos detectado un cargo no autorizado de 847,00€ en tu tarjeta terminada en 4521. Si no reconoces esta operación, cancela el cargo ahora:',
          time: '15:52',
        },
        {
          from: 'them',
          type: 'link',
          text: 'santander.es-seguridad-cliente.com/cancelar',
          time: '15:52',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Remitente Falsificado',
        severity: 'warning',
        explanation: 'El SMS spoofing permite enviar mensajes con el nombre de tu banco real. Puede aparecer incluso en el hilo de SMS legítimos de Santander. Un banco nunca te pedirá que canceles cargos desde un link por SMS.',
      },
      {
        targetId: 'hs-link',
        label: 'Trampa de Subdominio',
        severity: 'danger',
        explanation: '"santander.es-seguridad-cliente.com" parece legítimo, pero el dominio REAL es "es-seguridad-cliente.com". La parte "santander" es solo un subdominio del dominio fraudulento. Analiza siempre el dominio raíz.',
      },
    ],
  },

  {
    id: 'wa-hard-001',
    module: 'sms',
    isPhishing: true,
    level: 'hard',
    title: 'Ayuda del Gobierno (WA)',
    description: 'Phishing reenviado por un contacto de confianza',
    content: {
      platform: 'whatsapp',
      sender: 'María (trabajo)',
      senderName: 'María (trabajo)',
      messages: [
        {
          from: 'them',
          text: 'Hola! Mira esto que me pasó Sara del otro departamento. Parece que es real — el gobierno tiene una ayuda de 2.000€ por la subida de precios y el plazo es el viernes:',
          time: '09:15',
          forwarded: true,
        },
        {
          from: 'them',
          type: 'link',
          text: 'ayudas2026.gob-espana.com/solicitar',
          time: '09:15',
          preview: {
            url: 'gob-espana.com',
            title: 'Gobierno de España — Ayudas Ciudadanas 2026',
            description: 'Solicita tu ayuda directa de 2.000€ antes del 30 de abril. Acceso rápido con DNI.',
            image: '🇪🇸',
          },
        },
        {
          from: 'them',
          text: 'Yo ya lo he solicitado, es muy fácil. Solo piden el DNI y el número de cuenta.',
          time: '09:16',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Confianza Prestada',
        severity: 'warning',
        explanation: 'El mensaje viene de María, una persona conocida, lo que elimina la desconfianza. Pero María también fue víctima — reenvió el phishing creyendo que era real. Esta técnica se llama "confianza prestada" y es muy efectiva porque no cuestionamos a nuestros contactos.',
      },
      {
        targetId: 'hs-link',
        label: 'Dominio Falso + Recolección de DNI',
        severity: 'danger',
        explanation: '"gob-espana.com" imita un dominio oficial, pero el real sería "gob.es". Pedir DNI + número de cuenta = robo de identidad completo. Los atacantes sincronizan estos fraudes con ayudas reales para que el monto parezca creíble.',
      },
    ],
  },

  {
    id: 'sms-legit-hard-001',
    module: 'sms',
    isPhishing: false,
    level: 'hard',
    title: 'Alerta Real BBVA',
    description: 'Notificación bancaria auténtica: informa sin pedir clics',
    content: {
      platform: 'sms',
      sender: 'BBVA',
      senderName: 'BBVA',
      messages: [
        {
          from: 'them',
          text: 'BBVA: Cargo de 47,80€ en tu tarjeta *4521 en MERCADONA BARCELONA a las 11:08. Si no lo reconoces, llama al 900 102 801. No compartas este código con nadie.',
          time: '11:15',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Sin Enlace — Patrón Legítimo',
        severity: 'safe',
        explanation: 'Los bancos reales notifican cargos sin incluir enlaces de acción. Este mensaje solo informa y da un teléfono para llamar. Si hubiera un link "para cancelar el cargo", sería señal de fraude. La ausencia de enlace es aquí la clave que lo distingue del phishing.',
      },
    ],
  },
]
