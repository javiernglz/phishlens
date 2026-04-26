# PhishLens

Simulador interactivo de phishing para concienciación en ciberseguridad. Presenta correos, SMS y archivos sospechosos en pantalla, vota si son legítimos o phishing, y descubre la verdad con el escáner X-Ray.

**[→ Demo en vivo](https://phishlens-five.vercel.app)**

---

## Qué hace

- **3 módulos**: Email (interfaz Gmail), SMS/WhatsApp, y Archivos (Finder macOS)
- **18 escenarios** distribuidos en 3 niveles de dificultad (fácil, medio, difícil)
- **50% son legítimos** — no puedes adivinar sistemáticamente, tienes que razonarlo
- **X-Ray**: al votar se activa automáticamente un escáner que ilumina cada señal de ataque con hotspots explicados
- **Pantalla de resultados** por módulo con anillo de puntuación, desglose por escenario y opción de repetir
- **Atajos de teclado**: `←` `→` para navegar, `X` para activar/desactivar X-Ray

## Técnicas cubiertas

| Módulo | Técnicas |
|---|---|
| Email | Dominios homógrafos, spoofing de remitente, spear phishing, URLs ocultas en botones |
| SMS / WhatsApp | Smishing bancario, confianza prestada, link previews manipulados, cadenas virales |
| Archivos | Extensión doble `.pdf.exe`, ejecutables disfrazados con icono de Word (`.scr`), instaladores legítimos vs maliciosos |

## Stack

- React 19 + Vite 8
- Tailwind CSS v3
- Lucide React (iconos)
- Deploy: Vercel

## Correr en local

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Estructura

```
frontend/src/
├── components/
│   ├── layout/        # Sidebar con navegación por módulo
│   ├── simulator/     # EmailView, SmsView, FileView, SimulatorStage, ModuleResult
│   ├── xray/          # XRayOverlay con máscara SVG y hotspots
│   └── LandingPage.jsx
├── data/              # Escenarios en JSON (email, sms, file)
└── hooks/
    └── useSimulator.js  # Estado global del simulador
```

## Añadir escenarios

Cada escenario vive en `frontend/src/data/{módulo}Scenarios.js` con esta forma:

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
      targetId: 'hs-sender',   // id del elemento HTML a resaltar
      label: 'Spoofing de remitente',
      severity: 'danger',      // 'danger' | 'warning' | 'safe'
      explanation: 'Texto explicativo que aparece en el tooltip del X-Ray.',
    },
  ],
}
```

## Licencia

MIT
