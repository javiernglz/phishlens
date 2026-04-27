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

  // ─── MEDIUM (nuevos) ──────────────────────────────────────────────────────

  {
    id: 'sms-medium-002',
    module: 'sms',
    isPhishing: true,
    level: 'medium',
    title: 'Paquete DHL en Aduana',
    description: 'Smishing de mensajería con cobro de aduana ficticio de 2,99 €',
    content: {
      platform: 'sms',
      sender: 'DHL',
      senderName: 'DHL',
      messages: [
        {
          from: 'them',
          text: 'DHL: Su envío 7392847651 no pudo ser entregado. Se le cobrarán gastos de aduana de 2,99€. Realice el pago para liberar su paquete:',
          time: '14:23',
        },
        {
          from: 'them',
          type: 'link',
          text: 'dhl-aduanas.es/liberar-envio',
          time: '14:23',
        },
        {
          from: 'them',
          text: 'El envío será devuelto al remitente en 48 h si no completa el pago.',
          time: '14:24',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Remitente DHL Suplantado',
        severity: 'warning',
        explanation: 'El nombre "DHL" puede falsificarse mediante SMS spoofing. DHL España envía notificaciones siempre desde "DHL" o "DHL Express" y solo incluye números de seguimiento reales de 10 dígitos. Un banco o mensajería real nunca te pedirá un pago de aduana a través de un SMS con enlace.',
      },
      {
        targetId: 'hs-link',
        label: 'Cobro de Aduana Falso + Dominio Fraudulento',
        severity: 'danger',
        explanation: 'DHL nunca solicita pagos de aduanas mediante SMS con enlace. El dominio oficial es dhl.com — "dhl-aduanas.es" es un dominio fraudulento. Esta táctica del "pequeño pago de aduana" (1,99–3,99 €) es la más utilizada en smishing de mensajería porque parece razonable y baja la guardia.',
      },
    ],
  },

  {
    id: 'sms-legit-medium-002',
    module: 'sms',
    isPhishing: false,
    level: 'medium',
    title: 'Seguimiento Correos Real',
    description: 'Notificación auténtica de Correos con número de seguimiento RR...ES y dominio oficial',
    content: {
      platform: 'sms',
      sender: 'Correos',
      senderName: 'Correos',
      messages: [
        {
          from: 'them',
          text: 'Correos: Su envío RR387654219ES está en reparto hoy y será entregado antes de las 20:00 h. Consulte el estado en:',
          time: '08:32',
        },
        {
          from: 'them',
          type: 'link',
          text: 'correos.es/localizador?codigo=RR387654219ES',
          time: '08:32',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Remitente Oficial de Correos',
        severity: 'safe',
        explanation: 'Correos usa el remitente alfanumérico "Correos". El mismo nombre que usan los atacantes — por eso es crucial analizar el resto del mensaje. Aquí no hay solicitud de pago, no hay urgencia y el enlace lleva a correos.es.',
      },
      {
        targetId: 'hs-link',
        label: 'Dominio Oficial + Formato de Código Correcto',
        severity: 'safe',
        explanation: '"correos.es" es el dominio oficial. El código "RR387654219ES" tiene el formato auténtico de Correos: 2 letras + 9 dígitos + ES. Compáralo con el smishing anterior: "ES928471623" — ese formato no existe en Correos. Aquí tampoco hay cobro de gestión.',
      },
    ],
  },

  {
    id: 'sms-medium-003',
    module: 'sms',
    isPhishing: true,
    level: 'medium',
    title: 'Cuenta Bizum Suspendida',
    description: 'Smishing suplantando a Bizum — remitente que no debería existir',
    content: {
      platform: 'sms',
      sender: 'Bizum',
      senderName: 'Bizum',
      messages: [
        {
          from: 'them',
          text: 'Bizum: Su cuenta ha sido suspendida temporalmente por motivos de seguridad. Reactívela en las próximas 24 h o su acceso será cancelado definitivamente:',
          time: '17:44',
        },
        {
          from: 'them',
          type: 'link',
          text: 'bizum-verificacion.es/reactivar',
          time: '17:44',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Bizum No Envía SMS Propios',
        severity: 'danger',
        explanation: 'Bizum no dispone de un sistema de notificaciones SMS independiente. Los avisos de pagos Bizum llegan siempre desde el SMS de tu banco (BBVA, Santander, CaixaBank…). Un remitente "Bizum" autónomo no existe en el sistema oficial — cualquier SMS con ese remitente es un fraude.',
      },
      {
        targetId: 'hs-link',
        label: 'Dominio Falso + Amenaza de Cancelación',
        severity: 'danger',
        explanation: 'El dominio oficial de Bizum es bizum.es. "bizum-verificacion.es" es un dominio fraudulento. La amenaza de "cancelación definitiva en 24 h" es manipulación emocional para que actúes sin pensar. Ningún servicio financiero cancela tu cuenta por no hacer clic en un SMS.',
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
    id: 'sms-hard-002',
    module: 'sms',
    isPhishing: true,
    level: 'hard',
    title: 'Devolución IRPF — AEAT',
    description: 'Smishing suplantando a Hacienda sincronizado con la campaña de la Renta',
    content: {
      platform: 'sms',
      sender: 'AEAT',
      senderName: 'AEAT',
      messages: [
        {
          from: 'them',
          text: 'AEAT: Tiene una devolución de IRPF pendiente por importe de 348,72€. Acceda a su espacio personal para confirmar su cuenta bancaria y gestionar el cobro:',
          time: '10:07',
        },
        {
          from: 'them',
          type: 'link',
          text: 'agencia-tributaria.devoluciones-irpf.com/acceso',
          time: '10:07',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Remitente AEAT Falsificado',
        severity: 'warning',
        explanation: 'El nombre "AEAT" puede ser suplantado mediante SMS spoofing, igual que "CORREOS" o "SANTANDER". El mensaje puede incluso aparecer en el mismo hilo que SMS legítimos de Hacienda. La clave: la AEAT nunca pide datos bancarios por SMS — las devoluciones se ingresan automáticamente en la cuenta que declaraste en la Renta.',
      },
      {
        targetId: 'hs-link',
        label: 'Dominio Falso + Recolección Bancaria',
        severity: 'danger',
        explanation: 'El dominio real de la Agencia Tributaria es "sede.agenciatributaria.gob.es". "agencia-tributaria.devoluciones-irpf.com" imita el nombre oficial pero es un dominio .com fraudulento. La campaña coincide con la época de la Renta — los atacantes sincronizan estos SMS con fechas reales para que el importe y el contexto parezcan creíbles.',
      },
    ],
  },

  {
    id: 'wa-hard-002',
    module: 'sms',
    isPhishing: true,
    level: 'hard',
    title: 'Acceso Sospechoso Amazon (WA)',
    description: 'Alerta de seguridad falsa de Amazon por WhatsApp con preview de enlace convincente',
    content: {
      platform: 'whatsapp',
      sender: 'Amazon',
      senderName: 'Amazon',
      messages: [
        {
          from: 'them',
          text: 'Amazon: Hemos detectado un acceso a tu cuenta desde un nuevo dispositivo.\n\nDispositivo: Windows PC · Chrome\nUbicación: Bucarest, Rumanía\nFecha: 26/04/2026 · 02:14 CET',
          time: '07:30',
        },
        {
          from: 'them',
          text: 'Si no fuiste tú, verifica y protege tu cuenta de inmediato para evitar cargos no autorizados en tus métodos de pago guardados:',
          time: '07:30',
        },
        {
          from: 'them',
          type: 'link',
          text: 'amazon-es-seguridad.com/verificar-acceso',
          time: '07:31',
          preview: {
            url: 'amazon-es-seguridad.com',
            title: 'Amazon — Centro de Seguridad',
            description: 'Verifica tu identidad y protege tu cuenta de Amazon España',
            headerBg: '#FF9900',
            brandText: 'amazon.es',
          },
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Amazon No Usa WhatsApp para Alertas de Seguridad',
        severity: 'warning',
        explanation: 'Amazon no envía alertas de seguridad por WhatsApp. Sus notificaciones llegan por email o por la app oficial de Amazon. Cualquier mensaje de "Amazon" por WhatsApp — sin importar cuánto se parezca — debe ponerte en alerta inmediata.',
      },
      {
        targetId: 'hs-link',
        label: 'Preview Falsa + Dominio Fraudulento',
        severity: 'danger',
        explanation: '"amazon-es-seguridad.com" no es amazon.es. La preview muestra "amazon.es" como URL visible, pero el enlace real va a un dominio diferente que el atacante controla. WhatsApp genera la preview del dominio destino — los atacantes configuran metaetiquetas en su web falsa para que parezca Amazon. Comprueba siempre el dominio real al pulsar el enlace.',
      },
    ],
  },

  {
    id: 'sms-legit-hard-002',
    module: 'sms',
    isPhishing: false,
    level: 'hard',
    title: 'Código OTP CaixaBank',
    description: 'SMS de autorización de compra real — código sin enlace ni solicitud de datos',
    content: {
      platform: 'sms',
      sender: 'CaixaBank',
      senderName: 'CaixaBank',
      messages: [
        {
          from: 'them',
          text: 'CaixaBank: Código de autorización: 847291. Compra de 89,99€ en FNAC.ES. Válido 10 min. Nunca lo compartas con nadie. Si no lo has solicitado, llama al 900 40 40 90.',
          time: '13:17',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'OTP Legítimo — Sin Enlace',
        severity: 'safe',
        explanation: 'Un SMS OTP real solo contiene el código, el importe, el comercio y un teléfono al que llamar. Nunca incluye un enlace para "validar" ni te pide que introduzcas nada en ningún sitio. Si alguien te llama haciéndose pasar por CaixaBank y te pide que le leas este código, es un ataque de vishing — cuelga y llama tú al 900 40 40 90.',
      },
    ],
  },

  {
    id: 'sms-legit-hard-003',
    module: 'sms',
    isPhishing: false,
    level: 'hard',
    title: 'Código de Acceso Santander',
    description: 'OTP de inicio de sesión real — mismo remitente que el smishing de Santander',
    content: {
      platform: 'sms',
      sender: 'SANTANDER',
      senderName: 'Santander',
      messages: [
        {
          from: 'them',
          text: 'Santander: Código de acceso: 492731. No lo compartas con nadie. Si no lo has solicitado, llama al 91 512 33 36.',
          time: '10:03',
        },
      ],
    },
    hotspots: [
      {
        targetId: 'hs-sender',
        label: 'Mismo Remitente, Mensaje Completamente Distinto',
        severity: 'safe',
        explanation: 'El remitente "SANTANDER" es idéntico al que usan los atacantes — puede incluso aparecer en el mismo hilo de conversación que SMS fraudulentos. La diferencia está en el contenido: este SMS te da un código que tú has pedido, da un teléfono oficial y no contiene ningún enlace de acción. Un banco real nunca te pide el código que te acaba de enviar.',
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
