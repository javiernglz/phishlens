const GROQ_KEY = import.meta.env.VITE_GROQ_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const TEXT_MODEL  = 'llama-3.3-70b-versatile'
const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'

const SYSTEM_PROMPT = `Eres un experto en ciberseguridad especializado en detección de phishing, smishing y fraudes digitales. Analiza el contenido proporcionado y devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
{"verdict":"phishing","confidence":85,"summary":"Resumen breve en español.","indicators":[{"severity":"high","category":"Nombre","finding":"dato técnico","explanation":"explicación en español"}]}
Los valores de verdict son exactamente: phishing, suspicious, legitimate.
Los valores de severity son exactamente: high, medium, low, info.
Busca: dominios suplantados, URLs fraudulentas, urgencia artificial, errores gramaticales, solicitudes de credenciales o pagos, remitentes falsificados, ingeniería social, amenazas falsas, premios falsos.`

async function compressImage(base64, maxPx = 800) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.width  * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = 'data:image/jpeg;base64,' + base64
  })
}

async function callGroq(messages, model) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.1,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const msg = body?.error?.message || `Error ${res.status}`
    throw new Error(msg)
  }

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content ?? ''
  return JSON.parse(raw)
}

export async function analyzePhishing({ text, image, onRetry }) {
  if (!GROQ_KEY) {
    await new Promise((r) => setTimeout(r, 1800))
    return DEMO_RESULT
  }

  if (image) {
    const dataUrl = await compressImage(image)
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analiza esta imagen en busca de indicadores de phishing.' },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ]
    return callGroq(messages, VISION_MODEL)
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Analiza el siguiente contenido:\n\n${text}` },
  ]
  return callGroq(messages, TEXT_MODEL)
}

// ─── Demo result (usado cuando no hay VITE_GROQ_KEY) ──────────────────────────

const DEMO_RESULT = {
  verdict: 'phishing',
  confidence: 94,
  summary:
    'El mensaje suplanta a Banco Santander mediante SMS spoofing y dirige a un dominio fraudulento diseñado para robar credenciales bancarias.',
  indicators: [
    {
      severity: 'high',
      category: 'Dominio fraudulento',
      finding: 'santander.es-seguridad-cliente.com',
      explanation:
        'El dominio real es "es-seguridad-cliente.com" — "santander" actúa únicamente como subdominio de un dominio que no pertenece al banco. El dominio oficial de Santander es santander.es.',
    },
    {
      severity: 'high',
      category: 'Solicitud de credenciales',
      finding: 'Verifica tu identidad para desbloquearla',
      explanation:
        'Los bancos nunca solicitan credenciales a través de un enlace SMS. Esta petición indica que la web de destino capturará usuario y contraseña.',
    },
    {
      severity: 'medium',
      category: 'Urgencia artificial',
      finding: 'cancela el cargo ahora',
      explanation:
        'La presión para actuar de inmediato es una táctica de ingeniería social clásica. El objetivo es que el receptor pulse el enlace antes de reflexionar.',
    },
    {
      severity: 'low',
      category: 'Remitente suplantado',
      finding: 'SANTANDER',
      explanation:
        'El nombre del remitente puede falsificarse mediante SMS spoofing. El mensaje puede aparecer en el mismo hilo que mensajes legítimos del banco.',
    },
  ],
}
