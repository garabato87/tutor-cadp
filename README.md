# Tutor CADP — Pascal (UNLP)

Tutor web interactivo para estudiar el **segundo parcial de CADP** (Conceptos de
Algoritmos, Datos y Programas) de la UNLP. Cubre **arreglos, punteros y listas
enlazadas** en Pascal, con teoría en microbloques, mini-tests, ejercicios con
editor + feedback de IA, y seguimiento de progreso sincronizado entre dispositivos.

- **Producción:** https://tutor-cadp.vercel.app
- **Repo:** https://github.com/garabato87/tutor-cadp
- **Fecha del parcial (referencia en la app):** 13 de junio de 2026

---

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | React 18 + Vite 5 |
| Lenguaje | JavaScript (JSX) **+ TypeScript** (migración en curso) |
| Estilos | **Tailwind CSS v3** + tokens shadcn (HSL) · CSS legacy conservado |
| UI kit | shadcn (estructura) + componentes propios en `components/ui` |
| Iconos | lucide-react |
| Persistencia | Supabase (tabla `progress`) con fallback a `localStorage` |
| Deploy | Vercel (proyecto linkeado, `.vercel/`) |

> **Nota de migración:** el proyecto está a mitad de camino entre JS+CSS-vanilla y
> TS+Tailwind+shadcn. Las vistas **Inicio, Roadmap y Progreso** ya están rediseñadas
> en TSX + Tailwind (bento). Las vistas **Aprender, Ejercicios y Login** siguen en
> JSX usando las clases CSS legacy de `src/styles/index.css` (ambos mundos coexisten).

---

## Cómo correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción a /dist
npm run preview  # previsualizar el build
npx tsc --noEmit # typecheck (debe quedar limpio)
```

### Variables de entorno (`.env`)

Copiar `.env.example` → `.env`:

```
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_ANTHROPIC_API_KEY=        # ver "Pendientes / seguridad"
```

Si Supabase no está configurado, la app funciona igual usando `localStorage`.

### Schema de Supabase (SQL Editor)

```sql
create table if not exists progress (
  device_id  text primary key,   -- aquí se guarda el "código de usuario"
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table progress enable row level security;
create policy "acceso anonimo" on progress
  for all using (true) with check (true);
```

---

## Estructura

```
tutor-cadp/
├── index.html                 # carga fuentes (Fraunces + JetBrains Mono)
├── tailwind.config.js         # darkMode class, tokens marca, fade-up
├── postcss.config.js
├── components.json            # config shadcn
├── tsconfig.json / tsconfig.node.json
├── vite.config.ts             # alias @ -> ./src
├── CONTEXTO-TUTOR-CADP.md      # brief original con notación exacta de la cátedra
└── src/
    ├── main.jsx                # entry; importa styles/index.css
    ├── App.jsx                 # shell + tabs + estado de progreso (JSX)
    ├── data/
    │   ├── curriculum.js       # SUBHABILIDADES (teoría + mini-tests) + EJERCICIOS
    │   └── plan.js             # PLAN_ESTUDIO (roadmap día por día)
    ├── lib/
    │   ├── supabaseClient.js   # cliente (null si no hay config)
    │   ├── storage.js          # loadProgress/saveProgress + getUserId/setUserId
    │   ├── utils.ts            # cn() (clsx + tailwind-merge)
    │   ├── progress.ts         # skillProgress() y calcularProgreso()
    │   └── skillMeta.tsx       # subhabilidad -> icono Lucide + acento HSL
    ├── components/
    │   ├── MiniTest.jsx        # mini-test de opción múltiple (legacy)
    │   ├── Ejercicio.jsx       # editor + pista + solución + feedback IA (legacy)
    │   ├── ui/
    │   │   ├── bento-grid.tsx  # grilla bento accesible (article + button overlay)
    │   │   └── progress-bar.tsx
    │   └── views/
    │       ├── DashboardView.tsx   # tab "Inicio" (hero + countdown + bento)
    │       ├── RoadmapView.tsx     # tab "Roadmap" (bento día por día)
    │       └── ProgresoView.tsx    # tab "Progreso" (bento por subhabilidad)
    └── styles/
        └── index.css           # @tailwind + tokens HSL shadcn + clases legacy
```

### Tabs de la app
`inicio` (Dashboard) · `roadmap` · `aprender` (teoría + mini-test) · `ejercicios` · `progreso`.

### Modelo de progreso
Guardado por **código de usuario** (texto que el alumno elige; mismo código = mismo
progreso en cualquier navegador). En Supabase va en `progress.device_id`.
Estructura del JSON por subhabilidad:
```
progress[skillId] = {
  microbloquesDone: string[],          // ids de microbloques leídos
  miniTestResults:  { [pregId]: bool },// respuestas correctas
  ejerciciosDone:   string[],          // ids de ejercicios hechos
}
```

---

## Contenido pedagógico (5 subhabilidades)

`arreglos-base` · `arreglos-busquedas` · `punteros` · `listas-base` · `listas-avanzado`.
Cada una: **microbloques** (teoría + ejemplo Pascal + nota de cátedra), **mini-test**
y **ejercicios** (nivel 1–3, con pista/solución/reto). Total actual: **22 microbloques,
25 preguntas, 20 ejercicios**.

> ⚠️ La notación de la cátedra es exacta y crítica (ver `CONTEXTO-TUTOR-CADP.md`):
> while de búsqueda siempre `(pos <= dL)` primero · insertar usa `downto`, eliminar `to`
> · `dispose(p)` libera memoria, `p := nil` no · listas se recorren con `aux` · en
> insertar ordenado los casos 3 y 4 se unifican. **La tabla de bytes cambia según el
> enunciado** (clase: integer=6/real=8 · Práctica 5: integer=2/real=4).

---

## Diseño / convenciones

- Tema **oscuro**, identidad ámbar (`--primary`), teal/verde/rojo/uva como acentos.
- Tokens shadcn en HSL en `:root, .dark` de `index.css`; marca en `--brand-*`.
  En `tailwind.config.js` se exponen como `primary`, `teal`, `success`, `danger`, `grape`, etc.
- Tipografía: **Fraunces** (display, `font-sans`) + **JetBrains Mono** (`font-mono`, datos/código).
- Iconos **Lucide**, nunca emojis como iconos estructurales.
- **Accesibilidad WCAG 2.2 AA**: tarjetas bento = `<article>` + `<button>` overlay con
  `aria-label` (sin roles ARIA anidados); contraste ≥4.5:1; `aria-hidden` en iconos
  decorativos; `motion-reduce` en animaciones; focus-visible rings.
- Skill de diseño instalada globalmente: `ui-ux-pro-max`
  (`~/.claude/skills/ui-ux-pro-max`, scripts con `python`, no `python3`).

---

## Estado actual (último cierre: 2026-05-29)

**Hecho:**
- Tutor funcional con teoría dinámica (auto-avance de microbloques, botón
  teoría→práctica, navegación entre temas).
- Sincronización de progreso por código de usuario (Supabase + fallback local).
- Migración de stack a Tailwind + shadcn + TypeScript (coexistiendo con CSS legacy).
- Rediseño bento de Inicio + Roadmap + Progreso, con pasada de accesibilidad.
- `npm run build` y `tsc --noEmit` en verde.

**Pendientes / próximos pasos:**
1. **Feedback con IA inseguro/inactivo.** `Ejercicio.jsx` usa
   `VITE_ANTHROPIC_API_KEY` **en el navegador**: hoy está vacía (la feature solo
   muestra un aviso). Si se pone una key real, queda embebida en el bundle público.
   **TODO:** crear un **proxy serverless de Vercel** (`/api/feedback`) que guarde la
   key server-side y que el front llame a ese endpoint.
2. **Migrar a Tailwind las vistas restantes** (Aprender, Ejercicios, Login) y, al
   terminar, retirar las clases legacy de `index.css`.
3. (Opcional) Reducir bundle (lucide-react sube el JS a ~141 kB gz; importar iconos puntuales).

---

## Despliegue

```bash
git add -A && git commit -m "..."   # mensajes en formato conventional (feat/fix/...)
git push origin master
vercel --prod --yes                 # alias: https://tutor-cadp.vercel.app
```

El proyecto Vercel ya está linkeado (`.vercel/project.json`). Sesión CLI: `garabato87`.
