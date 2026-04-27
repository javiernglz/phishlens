# PhishLens

Simulador interactivo de phishing para concienciación en ciberseguridad. Interfaces calcadas a las reales, modo multijugador estilo Kahoot y detector de phishing con IA.

**[→ Demo en vivo](https://phishlens-five.vercel.app)**

---

## Qué incluye

### Simulador en modo solo
- **3 módulos**: Email (interfaz Gmail), SMS/WhatsApp (iMessage + WhatsApp), Archivos (Finder macOS)
- **39 escenarios** en 3 niveles de dificultad — la mitad son legítimos, no puedes adivinar
- **SMS y WhatsApp separados** visualmente dentro del mismo módulo
- **X-Ray**: al votar se activa un escáner que ilumina cada señal de ataque con hotspots explicados
- **Progreso persistente** — las respuestas se guardan en localStorage y sobreviven al cierre del navegador
- **Pantalla de resultados** por módulo con anillo de puntuación y opción de repetir
- **Atajos de teclado**: `←` `→` para navegar, `X` para activar/desactivar X-Ray

### Modo multijugador
- Sala con código QR — los jugadores se unen desde el móvil sin registro
- Votos en tiempo real con Supabase Realtime
- Podio y marcador final al terminar

### Detector de Phishing con IA
- Analiza texto o capturas de pantalla con Groq
- Devuelve veredicto, nivel de riesgo e indicadores detallados por severidad
- Historial de los últimos 10 análisis guardado en localStorage

---

## Técnicas cubiertas

| Módulo | Técnicas |
|---|---|
| Email | Dominios homógrafos, spoofing de remitente, typosquatting, truco de subdominio, spear phishing, URLs ocultas en botones |
| SMS | Smishing bancario (Santander, CaixaBank, BBVA), paquetes retenidos (DHL, Correos), AEAT, Bizum |
| WhatsApp | Confianza prestada, link previews manipulados, cadenas virales, suplantación de organismos oficiales |
| Archivos | Extensión doble `.pdf.exe`, macros `.xlsm`/`.docm`, `.iso` para eludir Mark of the Web, `.lnk` con icono falso |

## Marcas simuladas

Google · Microsoft · Apple · DocuSign · Amazon · Booking.com · BBVA · CaixaBank · Santander · AEAT · Bizum · Correos · DHL · El País

---

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v3
- **Multijugador**: Supabase Realtime (presencia + broadcast)
- **IA**: Groq — `llama-3.3-70b-versatile` (texto) · `meta-llama/llama-4-scout-17b-16e-instruct` (visión)
- **Deploy**: Vercel

## Correr en local

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

Para el detector de IA crea `frontend/.env`:

```env
VITE_GROQ_KEY=tu_clave_groq
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_supabase
```

La clave de Groq es gratuita en [console.groq.com](https://console.groq.com). Sin ella el detector funciona en modo demo con un resultado de ejemplo.

## Estructura

```
frontend/src/
├── components/
│   ├── layout/        # Sidebar con navegación y agrupación SMS/WhatsApp
│   ├── simulator/     # EmailView, SmsView, WhatsAppView, FileView, SimulatorStage, ModuleResult
│   ├── xray/          # XRayOverlay con hotspots
│   ├── ui/            # LevelBadge, ScenarioCard, PhishLensLogo
│   └── LandingPage.jsx
├── data/              # Escenarios (emailScenarios, smsScenarios, fileScenarios)
├── hooks/
│   └── useSimulator.js       # Estado global + persistencia localStorage
├── lib/
│   └── phishingDetector.js   # Integración Groq
└── pages/
    ├── DetectorPage.jsx   # Detector IA con historial
    ├── HostRoom.jsx       # Vista del presentador multijugador
    ├── PlayerRoom.jsx     # Vista del jugador en móvil
    └── PlayerJoin.jsx     # Pantalla de unión a sala
```

## Añadir escenarios

Cada escenario vive en `frontend/src/data/{módulo}Scenarios.js`:

```js
{
  id: 'email-medium-001',
  module: 'email',         // 'email' | 'sms' | 'file'
  isPhishing: true,        // false para escenarios legítimos
  level: 'medium',         // 'easy' | 'medium' | 'hard'
  title: 'Nombre visible en el sidebar',
  content: { /* campos específicos del módulo */ },
  hotspots: [
    {
      targetId: 'hs-sender',
      label: 'Spoofing de remitente',
      severity: 'danger',    // 'danger' | 'warning' | 'safe'
      explanation: 'Explicación que aparece en el tooltip del X-Ray.',
    },
  ],
}
```

Para escenarios de WhatsApp añade `content.platform: 'whatsapp'` — aparecerán en la sección WhatsApp del módulo SMS automáticamente.

## Licencia

MIT
