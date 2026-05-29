# Tutor CADP Pascal — Contexto completo para Claude Code

## Situación

Braian es estudiante de CADP (Conceptos de Algoritmos, Datos y Programas) en la **UNLP**, rinde el **segundo parcial el 13 de junio de 2026**. Viene de cero en los temas. La materia es casi toda práctica en Pascal.

El objetivo es construir un **tutor interactivo web** (React + Vite) que siga la metodología de los 10 pasos de la imagen adjunta, con **guardado de progreso en Supabase** (sin login, una sola tabla por device_id anónimo). Ya existe un proyecto base en `/home/claude/tutor-cadp` con la estructura React+Vite+Supabase armada pero con el **contenido vacío** (los archivos `src/data/curriculum.js` y `src/data/plan.js` fueron borrados para empezar de cero con el temario correcto).

---

## Temario exacto del segundo parcial

### 1. Arreglos (vectores)
- Dimensión física vs. dimensión lógica
- Agregar elementos al final
- Insertar en una posición
- Eliminar de una posición
- Búsqueda en vector **desordenado** (con bandera `esta`)
- Búsqueda **mejorada** en vector ordenado
- Búsqueda **dicotómica** (binaria) en vector ordenado

### 2. Punteros
- Alocación estática vs. dinámica
- Declaración con `^`, operaciones `new`, `dispose`, `:= nil`
- Acceso al contenido con `^` (`p^`, `p^.campo`)
- `sizeof(p)` siempre 4 bytes vs. `sizeof(p^)` depende del tipo
- Errores clásicos: usar `p^` antes de `new`, después de `dispose`
- Pasar punteros a módulos: por valor vs. por referencia (`var`)
- **Cálculo de memoria estática y dinámica**

### 3. Listas enlazadas (con punteros)
- Declaración del tipo nodo y puntero
- Creación (`pri := nil`)
- Recorrido con `aux`
- Agregar adelante (`agregarAdelante`)
- Agregar al final — opción 1 (recorre con `aux`) y opción 2 (mantiene puntero `ult`)
- Buscar un elemento
- Eliminar un elemento (3 casos: no está / es el primero / no es el primero)
- Insertar ordenado (4 casos unificados en 2 al final)

---

## Notación exacta de la cátedra (UNLP)

### Arreglos

```pascal
const fisica = 10;
type numeros = array[1..fisica] of integer;
var VN: numeros;
    dimL: integer;  { dimension logica, empieza en 0 }
```

**Agregar al final:**
```pascal
procedure agregar(var a: numeros; var dL: integer; var pude: boolean; num: integer);
begin
  pude := false;
  if ((dL + 1) <= fisica) then begin
    pude := true;
    dL := dL + 1;
    a[dL] := num;
  end;
end;
```

**Insertar en posición:**
```pascal
procedure insertar(var a: numeros; var dL: integer; var pude: boolean; num: integer; pos: integer);
var i: integer;
begin
  pude := false;
  if ((dL + 1) <= fisica) and (pos >= 1) and (pos <= dL) then begin
    for i := dL downto pos do
      a[i+1] := a[i];
    pude := true;
    a[pos] := num;
    dL := dL + 1;
  end;
end;
```

**Eliminar de posición:**
```pascal
procedure eliminar(var a: numeros; var dL: integer; var pude: boolean; pos: integer);
var i: integer;
begin
  pude := false;
  if (pos >= 1) and (pos <= dL) then begin
    for i := pos to (dL - 1) do
      a[i] := a[i+1];
    pude := true;
    dL := dL - 1;
  end;
end;
```

**Búsqueda desordenada (con bandera):**
```pascal
{ CRITICO: el orden de las condiciones en el while importa }
{ primero (pos <= dL) y DESPUES (a[pos] <> valor) para no leer fuera del arreglo }
function buscar(a: numeros; dL: integer; valor: integer): boolean;
var
  pos: integer;
  esta: boolean;
begin
  esta := false;
  pos := 1;
  while (pos <= dL) and (not esta) do
    if (a[pos] = valor) then esta := true
    else pos := pos + 1;
  buscar := esta;
end;
```

**Búsqueda mejorada (ordenado):**
```pascal
function existe(a: numeros; dL: integer; valor: integer): boolean;
var pos: integer;
begin
  pos := 1;
  while (pos <= dL) and (a[pos] < valor) do
    pos := pos + 1;
  if (pos <= dL) and (a[pos] = valor) then existe := true
  else existe := false;
end;
```

**Búsqueda dicotómica:**
```pascal
function dicotomica(a: numeros; dL: integer; valor: integer): boolean;
var
  pri, ult, medio: integer;
  ok: boolean;
begin
  ok := false;
  pri := 1; ult := dL;
  medio := (pri + ult) div 2;
  while (pri <= ult) and (valor <> a[medio]) do begin
    if (valor < a[medio]) then ult := medio - 1
    else pri := medio + 1;
    medio := (pri + ult) div 2;
  end;
  if (pri <= ult) and (valor = a[medio]) then ok := true;
  dicotomica := ok;
end;
```

---

### Punteros

```pascal
type
  listaE = ^datosEnteros;       { puntero siempre 4 bytes estaticos }
  puntero = ^real;
  puntero2 = ^char;
  persona = record
    nombre: string[20];         { 21 bytes }
    dni: integer;               { depende tabla del enunciado }
  end;
  puntPer = ^persona;

var
  p: puntero;
begin
  new(p);       { reserva memoria dinamica del tipo apuntado }
  p^ := 3.14;   { acceso al contenido }
  dispose(p);   { libera memoria dinamica - NO es lo mismo que p := nil }
  { p := nil NO libera memoria dinamica, solo pierde la referencia }
end.
```

**TABLA DE BYTES — ¡USAR SIEMPRE LA DEL ENUNCIADO!**

| Tipo | Teórico clase | Práctica 5 |
|------|--------------|------------|
| integer | 6 bytes | 2 bytes |
| real | 8 bytes | 4 bytes |
| char | 1 byte | 1 byte |
| boolean | 1 byte | 1 byte |
| puntero | 4 bytes | 4 bytes |
| string[n] | n + 1 bytes | n + 1 bytes |
| record | suma campos | suma campos |
| array | dimFísica × tipo | dimFísica × tipo |

**Regla clave:** `sizeof(p)` = siempre 4 (el puntero). `sizeof(p^)` = lo que apunta.
`new(p)` agrega memoria dinámica. `dispose(p)` la libera. `p := nil` NO la libera.
Asignar `p1 := p` no crea memoria nueva, solo copia la dirección.

---

### Listas enlazadas

**Declaración base (igual en todos los ejercicios de la cátedra):**
```pascal
type
  listaE = ^datosEnteros;
  datosEnteros = record
    elem: integer;
    sig: listaE;
  end;
var
  pri: listaE;
```

**Crear (inicializar):**
```pascal
procedure crear(var pI: listaE);
begin
  pI := nil;
end;
```

**Recorrido:**
```pascal
procedure recorrer(pI: listaE);
var aux: listaE;
begin
  aux := pI;
  while (aux <> nil) do begin
    writeln(aux^.elem);
    aux := aux^.sig;
  end;
end;
```

**Agregar adelante:**
```pascal
procedure agregarAdelante(var pI: listaE; num: integer);
var nuevo: listaE;
begin
  new(nuevo); nuevo^.elem := num; nuevo^.sig := nil;
  if (pI = nil) then pI := nuevo
  else begin
    nuevo^.sig := pI;
    pI := nuevo;
  end;
end;
```

**Agregar al final — opción 1 (recorre):**
```pascal
procedure agregarAlFinal(var pI: listaE; num: integer);
var nuevo, aux: listaE;
begin
  new(nuevo); nuevo^.elem := num; nuevo^.sig := nil;
  if (pI = nil) then pI := nuevo
  else begin
    aux := pI;
    while (aux^.sig <> nil) do
      aux := aux^.sig;
    aux^.sig := nuevo;
  end;
end;
```

**Agregar al final — opción 2 (con puntero `ult`):**
```pascal
procedure agregarAlFinal2(var pI, pU: listaE; num: integer);
var nuevo: listaE;
begin
  new(nuevo); nuevo^.elem := num; nuevo^.sig := nil;
  if (pI = nil) then begin
    pI := nuevo;
    pU := nuevo;
  end else begin
    pU^.sig := nuevo;
    pU := nuevo;
  end;
end;
```

**Eliminar (3 casos con `actual` y `ant`):**
```pascal
{ CRITICO: usar actual y ant, NO anterior }
procedure eliminar(var pI: listaE; valor: integer);
var actual, ant: listaE;
begin
  actual := pI;
  while (actual <> nil) and (actual^.elem <> valor) do begin
    ant := actual;
    actual := actual^.sig;
  end;
  if (actual <> nil) then begin
    if (actual = pI) then
      pI := pI^.sig        { caso: es el primero }
    else
      ant^.sig := actual^.sig;  { caso: no es el primero }
    dispose(actual);
  end;
  { si actual = nil: no estaba, no hace nada }
end;
```

**Insertar ordenado (4 casos, unificados en 2 al final):**
```pascal
{ El while avanza mientras actual^.elem < nuevo^.elem }
{ Casos 3 y 4 se unifican: anterior^.sig := nuevo; nuevo^.sig := actual }
{ En caso 4, actual = nil, que es exactamente lo que queremos como siguiente }
procedure insertar(var pI: listaE; valor: integer);
var actual, anterior, nuevo: listaE;
begin
  new(nuevo); nuevo^.elem := valor; nuevo^.sig := nil;
  if (pI = nil) then
    pI := nuevo                     { caso 1: lista vacia }
  else begin
    actual := pI; anterior := pI;
    while (actual <> nil) and (actual^.elem < nuevo^.elem) do begin
      anterior := actual;
      actual := actual^.sig;
    end;
    if (actual = pI) then begin     { caso 2: va al principio }
      nuevo^.sig := pI;
      pI := nuevo;
    end else begin                  { casos 3 y 4 unificados }
      anterior^.sig := nuevo;
      nuevo^.sig := actual;
    end;
  end;
end;
```

---

## Metodología de los 10 pasos (infografía)

El tutor debe seguir estos pasos en orden:

1. **Diagnóstico inicial** — mini-test de 3-5 preguntas para detectar nivel (inicial/intermedio/avanzado). No enseñar lo que ya sabe, no saltear pasos.
2. **Clarificación** — resumir el tema y dividirlo en subhabilidades clave.
3. **Roadmap estructurado** — plan día por día desde 28/05 hasta 13/06 con los temas de la cátedra.
4. **Microbloques** — explicación teórica + ejemplo funcional en Pascal + mini-test de 2-3 preguntas inmediatas.
5. **Práctica activa** — ejercicios con editor de código, pista, reto extra (un poco más difícil), y solución de referencia.
6. **Feedback y corrección** — el tutor (via API de Claude) analiza el código del alumno y da feedback específico.
7. **Recursos** — links a documentación relevante.
8. **Revisión espaciada** — lista de lo hecho y lo pendiente, mezclar temas anteriores.
9. **Proyecto final** — programa integrador que combina arreglos + punteros + listas.
10. **Dificultad progresiva** — ejercicios van de nivel 1 a 3, con reto extra en cada uno.

---

## Stack técnico

- **React + Vite** (ya inicializado en `/home/claude/tutor-cadp`)
- **Supabase** para persistencia entre dispositivos (sin login)
- Guardado por `device_id` anónimo (generado una vez, guardado en localStorage)
- **Fallback automático a localStorage** si Supabase no está configurado
- Credenciales van en `.env` (ya existe `.env.example`)
- La app funciona offline/sin Supabase configurado

### Estructura de archivos existente
```
tutor-cadp/
├── index.html
├── package.json          { react, react-dom, @supabase/supabase-js, vite }
├── vite.config.js
├── .env.example          { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY }
├── .gitignore
└── src/
    ├── main.jsx
    ├── App.jsx           { componente principal con tabs }
    ├── components/
    │   ├── MiniTest.jsx  { componente de mini-test con opciones }
    │   └── Ejercicio.jsx { editor + pista + reto + solución }
    ├── data/             { VACÍO - hay que crear curriculum.js y plan.js }
    ├── lib/
    │   ├── supabaseClient.js  { cliente con detección de config }
    │   └── storage.js         { loadProgress/saveProgress con fallback }
    └── styles/
        └── index.css     { tema oscuro, JetBrains Mono + Fraunces }
```

### Schema SQL para Supabase (ejecutar en el SQL Editor)
```sql
create table if not exists progress (
  device_id text primary key,
  data      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- politica para acceso publico anonimo (sin login)
alter table progress enable row level security;
create policy "acceso anonimo" on progress
  for all using (true) with check (true);
```

---

## Lo que falta construir (tarea para Claude Code)

### PRIORIDAD 1: Contenido pedagógico
Crear `src/data/curriculum.js` con:

**5 subhabilidades**, cada una con:
- `id`, `titulo`, `objetivo`
- `microbloques[]`: teoría en puntos, ejemplo Pascal completo, notas de la cátedra
- `miniTest[]`: 2-3 preguntas con opciones y correcta

Las 5 subhabilidades son:
1. `arreglos-base` — dim física/lógica, agregar, insertar, eliminar
2. `arreglos-busquedas` — desordenada, mejorada, dicotómica
3. `punteros` — new/dispose/nil, sizeof, cálculo de memoria
4. `listas-base` — creación, recorrido, agregar adelante, agregar al final
5. `listas-avanzado` — buscar, eliminar (3 casos), insertar ordenado (4 casos)

**Plan de estudio** en `src/data/plan.js` — día por día desde 29/05 hasta 13/06.

**Ejercicios** (`EJERCICIOS` array en curriculum.js) — al menos 2 por subhabilidad, nivel 1 a 3, con pista, reto y solución. Los ejercicios deben estar tomados o inspirados en el estilo de la Práctica 5 de la cátedra (ver ejemplos abajo).

### PRIORIDAD 2: Feedback con IA (paso 6)
Agregar en `Ejercicio.jsx` un botón "Analizar mi código" que llame a la API de Anthropic con el código del alumno y devuelva feedback específico en Pascal. El endpoint ya está disponible: `https://api.anthropic.com/v1/messages` (sin API key en el frontend, la maneja el proxy).

### PRIORIDAD 3: README con setup
Crear `README.md` con:
- `npm install` y `npm run dev`
- Cómo crear proyecto en Supabase (gratis)
- Dónde pegar las credenciales (`.env`)
- Cómo ejecutar el SQL del schema

---

## Ejercicios de práctica reales (estilo cátedra UNLP)

### Arreglos
```
1. Dado un vector de 10 enteros (max), cargarlo y determinar si un valor leído se encuentra.
   Usar función buscar con bandera.

2. Dado un vector ordenado de 10 enteros (max), leer un número e insertarlo manteniendo el orden.
   Usar búsqueda mejorada para encontrar la posición y procedure insertar.

3. Dado un vector de enteros, eliminar todas las apariciones de un valor leído.
   Combina búsqueda + eliminar en un ciclo.
```

### Punteros
```
1. Dado el siguiente programa, indicar memoria estática y dinámica en cada punto marcado:
   Program uno;
   Type puntero = ^real;
   Var p: puntero; x: integer;
   Begin
     new(p);          { punto A }
     p^ := 3.14;
     dispose(p);      { punto B }
     p := nil;        { punto C }
   End.

2. Explicar qué imprime y por qué:
   new(pc); pc^ := 'texto'; dispose(pc); writeln(pc^);  { error clasico }
```

### Listas
```
1. Crear una lista cargando N enteros con agregarAdelante.
   Recorrerla e imprimir todos los elementos.

2. Crear una lista ordenada usando insertar.
   Luego eliminar un elemento leído por teclado.
   Mostrar la lista resultante.

3. Proyecto integrador: cargar una lista de nombres ordenada alfabéticamente.
   Buscar un nombre. Si existe, eliminarlo. Si no, insertarlo en orden.
```

---

## Notas importantes para Claude Code

1. **La tabla de bytes cambia según el enunciado.** El tutor debe advertir esto siempre. En los ejercicios de práctica usar la tabla de Práctica 5 (integer=2, real=4). En los teóricos usar la de clase (integer=6, real=8). Esto genera confusión en los alumnos y la cátedra lo explota en los parciales.

2. **El orden de condiciones en el while de búsqueda es crítico.** Siempre `(pos <= dL) and (a[pos] <> valor)`, nunca al revés. La cátedra lo muestra explícitamente como error común.

3. **`dispose` vs `nil`:** dispose libera memoria dinámica. `nil` solo pierde la referencia (memory leak). Esto aparece en parciales.

4. **En insertar ordenado de listas**, los casos 3 y 4 se unifican: `anterior^.sig := nuevo; nuevo^.sig := actual`. En caso 4 `actual = nil`, que es el `.sig` correcto para el último nodo. La cátedra muestra las tres versiones del if y llega a esta simplificación.

5. **Los módulos de arreglos siempre reciben `var a`, `var dL`, `var pude`** (por referencia). El tamaño físico se accede como la constante `fisica` (global), no se pasa como parámetro.

6. **Estilo visual del proyecto:** tema oscuro, fuente `JetBrains Mono` para código y `Fraunces` para textos. Variables CSS ya definidas en `index.css`. Mantener la paleta: `--accent: #ffb347`, `--accent-2: #4fd1c5`, `--green: #6ee7a8`.

7. **El parcial es el 13 de junio de 2026.** El roadmap debe reflejar esto con los días exactos desde hoy (28 de mayo).
