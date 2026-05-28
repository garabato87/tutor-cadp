export const SUBHABILIDADES = [
  {
    id: 'arreglos-base',
    titulo: 'Arreglos — Base',
    descripcion: 'Dimensión física/lógica, agregar, insertar, eliminar',
    icono: '📦',
    color: '#ffb347',
    microbloques: [
      {
        id: 'mb-arr-1',
        titulo: '1. Dimensión física vs. lógica',
        teoria: [
          'La dimensión FÍSICA (fisica) es el tamaño máximo del array — se declara como constante y nunca cambia.',
          'La dimensión LÓGICA (dimL) es cuántos elementos tiene el vector ahora — empieza en 0 y varía.',
          'Los módulos recorren siempre hasta dimL, nunca hasta fisica.',
          'El vector y dimL siempre se pasan por referencia (var) porque los módulos los modifican.',
        ],
        ejemplo: `const fisica = 10;
type numeros = array[1..fisica] of integer;
var VN: numeros;
    dimL: integer; { dimension logica, empieza en 0 }

begin
  dimL := 0;   { vector vacio al inicio }
  { ... cargar elementos ... }
end.`,
        notasCatedra: 'Usar SIEMPRE la constante fisica como límite del array — nunca el número literal 10. Los módulos acceden a fisica como global, no se pasa como parámetro.',
      },
      {
        id: 'mb-arr-2',
        titulo: '2. Agregar al final',
        teoria: [
          'Solo se puede agregar si hay espacio: (dL + 1) <= fisica.',
          'Se incrementa dimL y se asigna en la nueva última posición: a[dL] := num.',
          'Si no hay espacio, pude := false y el vector no se modifica.',
          'La bandera pude permite que el llamador sepa si la operación tuvo éxito.',
        ],
        ejemplo: `procedure agregar(var a: numeros; var dL: integer;
                  var pude: boolean; num: integer);
begin
  pude := false;
  if ((dL + 1) <= fisica) then begin
    pude := true;
    dL := dL + 1;
    a[dL] := num;
  end;
end;`,
        notasCatedra: 'La cátedra SIEMPRE usa el flag pude: boolean. El vector y dL van por var. La constante fisica es global.',
      },
      {
        id: 'mb-arr-3',
        titulo: '3. Insertar en posición',
        teoria: [
          'Condiciones: (a) hay espacio (dL+1 <= fisica), (b) pos >= 1, (c) pos <= dL.',
          'Se desplazan elementos hacia la DERECHA con for i := dL downto pos → a[i+1] := a[i].',
          'El for va DOWNTO para no pisar valores: si fuera to, sobreescribiría el siguiente antes de moverlo.',
          'Luego: a[pos] := num y dL := dL + 1.',
        ],
        ejemplo: `procedure insertar(var a: numeros; var dL: integer;
                   var pude: boolean; num: integer; pos: integer);
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
end;`,
        notasCatedra: 'El for DOWNTO (derecha a izquierda) es la clave. Ejemplo: para insertar en pos 3 con vector [1,2,4,5]: mover a[4]→a[5], a[3]→a[4], luego a[3]:=nuevo. Si fuera to: a[3]→a[4] sobreescribiría el 4.',
      },
      {
        id: 'mb-arr-4',
        titulo: '4. Eliminar de posición',
        teoria: [
          'Condiciones: pos >= 1 y pos <= dL.',
          'Se desplazan elementos hacia la IZQUIERDA con for i := pos to (dL-1) → a[i] := a[i+1].',
          'El for va TO (izquierda a derecha) porque se copia el de la derecha al de la izquierda.',
          'Al final: dL := dL - 1. El elemento en la posición dL+1 ya no existe lógicamente.',
        ],
        ejemplo: `procedure eliminar(var a: numeros; var dL: integer;
                  var pude: boolean; pos: integer);
var i: integer;
begin
  pude := false;
  if (pos >= 1) and (pos <= dL) then begin
    for i := pos to (dL - 1) do
      a[i] := a[i+1];
    pude := true;
    dL := dL - 1;
  end;
end;`,
        notasCatedra: 'El for llega hasta dL-1 (no hasta dL) porque el último elemento ya fue copiado al anterior. Después de eliminar, el valor "viejo" en a[dL+1] queda ahí pero es irrelevante porque dimL ya se decrementó.',
      },
      {
        id: 'mb-arr-5',
        titulo: '5. Recorrer y procesar (sumar, contar, máximo)',
        teoria: [
          'Para procesar todo el vector se usa un for i := 1 to dL (NUNCA to fisica — habría basura).',
          'Sumar/promediar: acumular en una variable que arranca en 0; el promedio es suma / dL (cuidado con dL = 0).',
          'Contar bajo condición: incrementar un contador solo cuando se cumple el if dentro del for.',
          'Máximo/mínimo: inicializar el candidato con a[1] (el primer elemento), NO con 0 — si todos son negativos, 0 daría mal.',
          'Estos recorridos van por VALOR (sin var) porque solo LEEN el vector, no lo modifican.',
        ],
        ejemplo: `function sumar(a: numeros; dL: integer): integer;
var i, suma: integer;
begin
  suma := 0;
  for i := 1 to dL do
    suma := suma + a[i];
  sumar := suma;
end;

function maximo(a: numeros; dL: integer): integer;
var i, may: integer;
begin
  may := a[1];                 { candidato inicial: el primero }
  for i := 2 to dL do          { comparar desde el segundo }
    if (a[i] > may) then may := a[i];
  maximo := may;
end;`,
        notasCatedra: 'Inicializar el máximo con a[1], no con 0. El for del máximo empieza en 2 (el 1 ya es el candidato). Para contar pares: if (a[i] mod 2 = 0) then cont := cont + 1. Siempre recorrer hasta dL, nunca hasta fisica.',
      },
    ],
    miniTest: [
      {
        id: 'mt-arr-1',
        pregunta: '¿Cuál es el valor inicial correcto de dimL al comenzar el programa?',
        opciones: ['0', '1', 'fisica', 'indefinido — no importa'],
        correcta: 0,
        explicacion: 'dimL empieza en 0 porque el vector está lógicamente vacío. Se inicializa en el programa principal antes de cargar datos: dimL := 0.',
      },
      {
        id: 'mt-arr-2',
        pregunta: 'En el procedure insertar, ¿por qué el for es "downto" y no "to"?',
        opciones: [
          'Para no pisar valores al desplazar hacia la derecha',
          'Porque Pascal no permite "to" en este contexto',
          'Para ir más rápido',
          'No importa el orden — el resultado es el mismo',
        ],
        correcta: 0,
        explicacion: 'Con "to" (izquierda a derecha), al copiar a[pos+1] := a[pos] se sobreescribe el siguiente antes de moverlo. Con "downto" se mueve primero el elemento más a la derecha, preservando todos los valores.',
      },
      {
        id: 'mt-arr-3',
        pregunta: '¿Cuál condición verifica que hay espacio para agregar un elemento?',
        opciones: [
          '(dL + 1) <= fisica',
          'dL <= fisica',
          'dL < fisica',
          'dL + 1 < fisica',
        ],
        correcta: 0,
        explicacion: '(dL + 1) <= fisica verifica que después de incrementar dimL, la nueva posición sea un índice válido del array. Es la forma explícita que usa la cátedra.',
      },
      {
        id: 'mt-arr-4',
        pregunta: 'Para buscar el máximo de un vector de enteros, ¿con qué valor conviene inicializar la variable "may"?',
        opciones: [
          'Con a[1] (el primer elemento del vector)',
          'Con 0',
          'Con fisica',
          'Con el número más grande posible (maxint)',
        ],
        correcta: 0,
        explicacion: 'Se inicializa con a[1] y se recorre desde i := 2. Inicializar con 0 falla si todos los elementos son negativos (devolvería 0, que no está en el vector). Inicializar con maxint sirve para el mínimo, no para el máximo.',
      },
      {
        id: 'mt-arr-5',
        pregunta: 'Al recorrer un vector con for, ¿hasta qué límite hay que iterar?',
        opciones: [
          'Hasta dL (la dimensión lógica)',
          'Hasta fisica (la dimensión física)',
          'Hasta fisica - 1',
          'Hasta dL + 1',
        ],
        correcta: 0,
        explicacion: 'Siempre hasta dL. Iterar hasta fisica leería posiciones que todavía no tienen datos cargados (basura de memoria), porque dimL marca cuántos elementos hay realmente.',
      },
    ],
  },

  {
    id: 'arreglos-busquedas',
    titulo: 'Arreglos — Búsquedas',
    descripcion: 'Desordenada, mejorada y dicotómica',
    icono: '🔍',
    color: '#4fd1c5',
    microbloques: [
      {
        id: 'mb-bsq-1',
        titulo: '1. Búsqueda desordenada (con bandera)',
        teoria: [
          'Recorre el vector elemento por elemento hasta encontrar el valor o llegar al final.',
          'Variables: pos (posición actual) y esta (bandera boolean, empieza en false).',
          'CRÍTICO: el while es (pos <= dL) AND (NOT esta). NUNCA al revés.',
          '¿Por qué ese orden? Pascal evalúa de izquierda a derecha con short-circuit: si pos > dL, no evalúa a[pos].',
          'Si se invierte, Pascal evaluaría a[pos] cuando pos ya está fuera del rango → error de acceso a memoria.',
        ],
        ejemplo: `{ ORDEN CORRECTO: }
while (pos <= dL) and (not esta) do
  if (a[pos] = valor) then esta := true
  else pos := pos + 1;

{ ORDEN INCORRECTO (ERROR CLASICO): }
{ while (not esta) and (pos <= dL) do  <- no hacer esto }
{ En Pascal NO hay garantia de short-circuit con ese orden }`,
        notasCatedra: '⚠ ERROR CLASICO DE PARCIAL: invertir el orden del while. La cátedra lo muestra explícitamente. Primero SIEMPRE (pos <= dL) para no acceder fuera del arreglo.',
      },
      {
        id: 'mb-bsq-2',
        titulo: '2. Búsqueda mejorada (vector ordenado ascendente)',
        teoria: [
          'Si el vector está ordenado, podemos parar antes si a[pos] > valor (ya no puede estar).',
          'El while avanza mientras a[pos] < valor: si a[pos] >= valor, el valor o está ahí o no está.',
          'Después del while: verificar (pos <= dL) AND (a[pos] = valor).',
          'Requiere que el vector esté ordenado ASCENDENTE.',
        ],
        ejemplo: `function existe(a: numeros; dL: integer; valor: integer): boolean;
var pos: integer;
begin
  pos := 1;
  while (pos <= dL) and (a[pos] < valor) do
    pos := pos + 1;
  if (pos <= dL) and (a[pos] = valor) then existe := true
  else existe := false;
end;`,
        notasCatedra: 'El if final también debe verificar pos <= dL antes de acceder a a[pos]. Si el while llegó al final (pos > dL), el if no evalúa a[pos] gracias al short-circuit.',
      },
      {
        id: 'mb-bsq-3',
        titulo: '3. Búsqueda dicotómica (binaria)',
        teoria: [
          'Divide el rango de búsqueda a la mitad en cada paso — muy eficiente en vectores grandes.',
          'Variables: pri (inicio del rango), ult (fin), medio (posición central del rango).',
          'Si valor < a[medio] → buscar en la mitad izquierda: ult := medio - 1.',
          'Si valor > a[medio] → buscar en la mitad derecha: pri := medio + 1.',
          'El while termina cuando pri > ult (no encontrado) o valor = a[medio] (encontrado).',
          'IMPORTANTE: recalcular medio := (pri + ult) div 2 al final de cada iteración.',
        ],
        ejemplo: `function dicotomica(a: numeros; dL: integer; valor: integer): boolean;
var pri, ult, medio: integer; ok: boolean;
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
end;`,
        notasCatedra: 'REQUIERE vector ordenado. El div es división entera. Recalcular medio DENTRO del while después de actualizar pri o ult. La condición final verifica tanto que el rango sea válido como que el valor coincida.',
      },
      {
        id: 'mb-bsq-4',
        titulo: '4. Buscar y retornar la posición (no solo true/false)',
        teoria: [
          'A veces la cátedra pide la POSICIÓN del elemento, no un boolean. La estructura del while es idéntica.',
          'Convención: si el valor NO está, la función retorna -1 (o 0). Si está, retorna pos.',
          'Esto es muy útil antes de eliminar: primero buscás la posición, después llamás a eliminar(a, dL, pude, pos).',
          'El while sigue siendo (pos <= dL) and (not esta) — el orden importa igual que siempre.',
          'Sirve también para CONTAR ocurrencias: en vez de parar al encontrar, seguir y sumar un contador.',
        ],
        ejemplo: `function posicion(a: numeros; dL: integer; valor: integer): integer;
var pos: integer; esta: boolean;
begin
  esta := false;
  pos := 1;
  while (pos <= dL) and (not esta) do
    if (a[pos] = valor) then esta := true
    else pos := pos + 1;
  if esta then posicion := pos
  else posicion := -1;        { convencion: -1 = no encontrado }
end;

{ Contar cuantas veces aparece un valor: }
function contar(a: numeros; dL: integer; valor: integer): integer;
var i, cont: integer;
begin
  cont := 0;
  for i := 1 to dL do
    if (a[i] = valor) then cont := cont + 1;
  contar := cont;
end;`,
        notasCatedra: 'Buscar la posición es el paso previo típico para eliminar o modificar. Para CONTAR no se usa bandera: se recorre TODO el vector con un for, porque puede haber varias ocurrencias.',
      },
    ],
    miniTest: [
      {
        id: 'mt-bsq-1',
        pregunta: '¿En qué orden deben estar las condiciones del while en la búsqueda desordenada?',
        opciones: [
          'Primero (pos <= dL) y después (not esta)',
          'Primero (not esta) y después (pos <= dL)',
          'El orden no importa en Pascal',
          'Solo se necesita (not esta)',
        ],
        correcta: 0,
        explicacion: 'Primero (pos <= dL) porque Pascal evalúa izquierda a derecha. Si pos > dL, el short-circuit evita evaluar a[pos] que estaría fuera del rango. Al revés, se accedería a memoria inválida.',
      },
      {
        id: 'mt-bsq-2',
        pregunta: 'En la búsqueda dicotómica, si valor < a[medio], ¿qué se hace?',
        opciones: [
          'ult := medio - 1 (descarta la mitad derecha)',
          'pri := medio + 1 (descarta la mitad izquierda)',
          'medio := medio - 1',
          'Se retorna false inmediatamente',
        ],
        correcta: 0,
        explicacion: 'Si valor < a[medio], el valor buscado está en la mitad izquierda (el vector está ordenado ascendente). Se mueve ult hacia medio-1 para descartar la parte derecha del rango.',
      },
      {
        id: 'mt-bsq-3',
        pregunta: '¿Cuál o cuáles búsquedas requieren que el vector esté ordenado?',
        opciones: [
          'Mejorada y dicotómica',
          'Solo la dicotómica',
          'Solo la mejorada',
          'Las tres búsquedas',
        ],
        correcta: 0,
        explicacion: 'La búsqueda con bandera (desordenada) funciona en cualquier vector. La mejorada y la dicotómica REQUIEREN orden ascendente para funcionar correctamente.',
      },
      {
        id: 'mt-bsq-4',
        pregunta: 'Si una función de búsqueda debe retornar la POSICIÓN y el valor no está, ¿qué se suele retornar?',
        opciones: [
          '-1 (un valor imposible como posición, indica "no encontrado")',
          'dL + 1',
          '0 siempre es una posición válida',
          'Se produce un error de ejecución',
        ],
        correcta: 0,
        explicacion: 'Por convención se retorna -1 (o 0 si el array empieza en 1) porque nunca es un índice válido. Así el llamador sabe que no se encontró y no intenta acceder a a[-1].',
      },
      {
        id: 'mt-bsq-5',
        pregunta: 'Para CONTAR cuántas veces aparece un valor en un vector desordenado, ¿qué estructura conviene?',
        opciones: [
          'Un for que recorre TODO el vector sumando un contador',
          'Un while con bandera que para al encontrar la primera ocurrencia',
          'Una búsqueda dicotómica',
          'Una búsqueda mejorada que para cuando a[pos] > valor',
        ],
        correcta: 0,
        explicacion: 'Para contar hay que mirar TODOS los elementos, así que se usa un for de 1 a dL sin bandera. La bandera sirve para detenerse en la primera coincidencia, lo cual no sirve si querés contar todas.',
      },
    ],
  },

  {
    id: 'punteros',
    titulo: 'Punteros',
    descripcion: 'new, dispose, nil — sizeof — cálculo de memoria',
    icono: '📍',
    color: '#c084fc',
    microbloques: [
      {
        id: 'mb-ptr-1',
        titulo: '1. Declaración y operaciones básicas',
        teoria: [
          'Un puntero guarda la DIRECCIÓN de memoria de otra variable — no el valor en sí.',
          'Se declara con ^ antes del tipo: puntero = ^real.',
          'new(p): reserva memoria dinámica del tipo apuntado y guarda la dirección en p.',
          'dispose(p): LIBERA la memoria dinámica reservada por new. No asigna nil.',
          'p := nil: solo pierde la referencia. La memoria dinámica NO se libera (memory leak).',
          'p^ accede al CONTENIDO (el valor apuntado). p sin ^ es la dirección.',
        ],
        ejemplo: `type puntero = ^real;
var p: puntero;
begin
  new(p);         { reserva 4 bytes dinamicos para un real }
  p^ := 3.14;     { asigna valor al espacio reservado }
  writeln(p^);    { imprime: 3.14 }
  dispose(p);     { LIBERA los 4 bytes dinamicos del heap }
  p := nil;       { buena practica: evitar acceso accidental }
  { dispose(p) != p := nil }
end.`,
        notasCatedra: '⚠ ERROR CLASICO: confundir dispose(p) con p := nil. dispose libera memoria. p := nil solo "olvida" la dirección — la memoria sigue ocupada, se pierde (memory leak). La cátedra pregunta esto en parciales.',
      },
      {
        id: 'mb-ptr-2',
        titulo: '2. sizeof — el puntero siempre 4 bytes',
        teoria: [
          'sizeof(p) = SIEMPRE 4 bytes, sin importar el tipo apuntado. El puntero solo guarda una dirección.',
          'sizeof(p^) = tamaño del tipo apuntado (real, record, array, etc.).',
          'sizeof NO cambia al asignar valores — depende del TIPO declarado, no del contenido.',
          'TABLA P5: integer=2, real=4, char=1, boolean=1, puntero=4, string[n]=n+1, record=suma de campos.',
        ],
        ejemplo: `{ Tabla Practica 5 (usar en parcial si el enunciado la da): }
{ integer: 2 bytes    real: 4 bytes     char: 1 byte }
{ boolean: 1 byte     puntero: 4 bytes               }
{ string[n]: n+1 bytes                               }
{ record: suma de todos los campos                   }

type cadena = string[50]; { 51 bytes }
     puntero_cadena = ^cadena;
var pc: puntero_cadena;
begin
  writeln(sizeof(pc));    { 4  -- siempre 4, es el puntero }
  new(pc);
  writeln(sizeof(pc));    { 4  -- sigue siendo el puntero }
  pc^ := 'hola';
  writeln(sizeof(pc^));   { 51 -- cadena = string[50] = 51 bytes }
  pc^ := 'texto mas largo que el anterior';
  writeln(sizeof(pc^));   { 51 -- no cambia, depende del TIPO }
end.`,
        notasCatedra: '⚠ LA TABLA DE BYTES CAMBIA SEGÚN EL ENUNCIADO. En los teóricos de clase: integer=6, real=8. En la Práctica 5 y ejercicios prácticos: integer=2, real=4. SIEMPRE leer la tabla que da el enunciado.',
      },
      {
        id: 'mb-ptr-3',
        titulo: '3. Cálculo de memoria estática y dinámica',
        teoria: [
          'Memoria ESTÁTICA: variables declaradas en var. Se reserva al iniciar el programa y se libera al final.',
          'Memoria DINÁMICA: reservada con new(). Se libera con dispose(). Viene del "heap" (montículo).',
          'new(p): la memoria disponible disminuye en sizeof(p^) bytes.',
          'dispose(p): la memoria disponible aumenta en sizeof(p^) bytes (vuelven al heap).',
          'Readln, writeln, asignaciones: NO cambian la memoria disponible.',
          'Pasar puntero por valor: el módulo recibe copia de la dirección. Puede cambiar p^, no p.',
          'Pasar puntero por var: el módulo puede cambiar p en el llamador (por ejemplo, hacer new dentro).',
        ],
        ejemplo: `{ Ejemplo: TEmpleado = char(1)+string[25](26)+string[40](41)+real(4) = 72 bytes }
{ alguien: TEmpleado = 72 bytes (estatico)  }
{ PtrEmpleado: ^TEmpleado = 4 bytes (solo el puntero, estatico) }
{ ESTATICO TOTAL = 76 bytes }

Begin
  { (I) Inicio: 400.000 - 76 = 399.924 bytes libres }
  Readln(alguien.apellido);
  { (II) 399.924 -- Readln no cambia memoria }
  New(PtrEmpleado);
  { (III) 399.924 - 72 = 399.852 -- new reserva sizeof(TEmpleado)=72 bytes }
  Dispose(PtrEmpleado);
  { (IV) 399.852 + 72 = 399.924 -- dispose devuelve los 72 bytes al heap }
End.`,
        notasCatedra: 'En los ejercicios de la cátedra siempre hay que: (1) calcular bytes estáticos de cada var, (2) calcular bytes dinámicos de cada new, (3) rastrear cómo cambia la memoria en cada punto marcado del programa.',
      },
      {
        id: 'mb-ptr-4',
        titulo: '4. Errores clásicos con punteros',
        teoria: [
          'ERROR 1 — usar p^ ANTES de new(p): p no apunta a memoria válida → error de ejecución (no de compilación).',
          'ERROR 2 — usar p^ DESPUÉS de dispose(p): la memoria fue liberada, p queda "colgado" (dangling pointer).',
          'ERROR 3 — perder la referencia sin dispose: p := nil o p := otro sin liberar antes = memory leak.',
          'ERROR 4 — comparar p^ cuando p = nil: nil^ no existe. Siempre verificar if (p <> nil) antes de p^.',
          'BUENA PRÁCTICA: el ciclo de vida correcto es new(p) → usar p^ → dispose(p) → p := nil.',
        ],
        ejemplo: `var p: ^integer;
begin
  { MAL: p^ := 5;        <- p todavia no apunta a nada (basura) }
  new(p);                { reserva memoria }
  p^ := 5;               { OK: ahora si se puede usar p^ }
  writeln(p^);           { imprime 5 }
  dispose(p);            { libera la memoria }
  { MAL: writeln(p^);    <- p quedo colgado, la memoria ya no es valida }
  p := nil;              { buena practica: marca que no apunta a nada }
  { MAL: writeln(p^);    <- nil^ no existe, error }
end.`,
        notasCatedra: '⚠ La cátedra adora el ejemplo: new(pc); pc^ := texto; dispose(pc); writeln(pc^). Es ERROR EN EJECUCIÓN (no compila mal): se accede a memoria ya liberada. Compila bien porque la sintaxis es correcta; falla al correr.',
      },
    ],
    miniTest: [
      {
        id: 'mt-ptr-1',
        pregunta: '¿Cuántos bytes ocupa un puntero, sin importar a qué tipo apunta?',
        opciones: [
          '4 bytes siempre',
          'Depende del tipo apuntado',
          '8 bytes en sistemas de 64 bits',
          '2 bytes',
        ],
        correcta: 0,
        explicacion: 'Un puntero SIEMPRE ocupa 4 bytes según la tabla de la cátedra. Solo guarda una dirección de memoria. sizeof(p) = 4 siempre. sizeof(p^) varía según el tipo.',
      },
      {
        id: 'mt-ptr-2',
        pregunta: '¿Qué hace p := nil?',
        opciones: [
          'Solo pierde la referencia, NO libera memoria dinámica (memory leak)',
          'Libera la memoria dinámica — es equivalente a dispose(p)',
          'Reserva nueva memoria dinámica',
          'Es un error de compilación',
        ],
        correcta: 0,
        explicacion: 'p := nil solo hace que p apunte a "ningún lado". Si había memoria reservada con new(p), esa memoria queda sin liberar (memory leak). Para liberar hay que usar dispose(p) ANTES de perder la referencia.',
      },
      {
        id: 'mt-ptr-3',
        pregunta: 'Con la tabla de la P5 (integer=2, real=4), ¿cuánto ocupa este record?\nrecord codigo: integer; nombre: string[20]; precio: real end',
        opciones: [
          '27 bytes (2 + 21 + 4)',
          '26 bytes',
          '4 bytes (es un record, siempre 4)',
          '25 bytes',
        ],
        correcta: 0,
        explicacion: 'codigo: integer = 2 bytes. nombre: string[20] = 20+1 = 21 bytes. precio: real = 4 bytes. Total = 2 + 21 + 4 = 27 bytes. Un record ocupa la SUMA de sus campos.',
      },
      {
        id: 'mt-ptr-4',
        pregunta: '¿Qué tipo de error es: new(pc); pc^ := \'hola\'; dispose(pc); writeln(pc^); ?',
        opciones: [
          'Error de EJECUCIÓN: se accede a memoria ya liberada (compila bien)',
          'Error de COMPILACIÓN: la sintaxis es inválida',
          'No es un error, imprime "hola" igual',
          'Error de compilación porque falta el new',
        ],
        correcta: 0,
        explicacion: 'La sintaxis es correcta, así que COMPILA. Pero al ejecutar, writeln(pc^) accede a memoria que dispose ya liberó (puntero colgado). Es un error de ejecución, no de compilación.',
      },
      {
        id: 'mt-ptr-5',
        pregunta: 'Antes de acceder a p^, ¿qué conviene verificar para evitar un error?',
        opciones: [
          'Que p <> nil (que p apunte a memoria válida)',
          'Que sizeof(p) sea 4',
          'Que p^ no esté vacío',
          'Nada, p^ siempre es seguro',
        ],
        correcta: 0,
        explicacion: 'Acceder a nil^ (cuando p = nil) o a un puntero sin new produce un error de ejecución. La defensa es if (p <> nil) then ... antes de tocar p^.',
      },
    ],
  },

  {
    id: 'listas-base',
    titulo: 'Listas — Base',
    descripcion: 'Creación, recorrido, agregar adelante y al final',
    icono: '🔗',
    color: '#6ee7a8',
    microbloques: [
      {
        id: 'mb-lst-1',
        titulo: '1. Declaración del tipo nodo y puntero',
        teoria: [
          'Una lista enlazada es una cadena de nodos donde cada nodo apunta al siguiente.',
          'Si pri = nil, la lista está vacía.',
          'Cada nodo tiene: el dato (elem) y un puntero al siguiente nodo (sig).',
          'El último nodo tiene sig = nil.',
          'La declaración es SIEMPRE la misma en la cátedra.',
        ],
        ejemplo: `type
  listaE = ^datosEnteros;     { puntero al tipo nodo }
  datosEnteros = record
    elem: integer;            { el dato }
    sig: listaE;              { puntero al siguiente nodo }
  end;
var pri: listaE;              { puntero al primer nodo }

procedure crear(var pI: listaE);
begin
  pI := nil;   { lista vacia }
end;`,
        notasCatedra: 'Esta declaración es la PLANTILLA de la cátedra — siempre igual. La variable del programa principal se llama pri. Inicializar SIEMPRE con pri := nil.',
      },
      {
        id: 'mb-lst-2',
        titulo: '2. Recorrido con auxiliar',
        teoria: [
          'NUNCA avanzar con pri directamente — se perdería el inicio de la lista.',
          'Crear una copia: aux := pI. Avanzar con aux := aux^.sig.',
          'El while avanza mientras aux <> nil.',
          'El recorrido va por VALOR (sin var) porque no modifica la lista.',
        ],
        ejemplo: `procedure recorrer(pI: listaE);
var aux: listaE;
begin
  aux := pI;               { copia la direccion del primero }
  while (aux <> nil) do begin
    writeln(aux^.elem);    { procesar nodo actual }
    aux := aux^.sig;       { avanzar al siguiente }
  end;
end;`,
        notasCatedra: 'Si se pasara pri por var y se avanzara con él (pI := pI^.sig), se perdería el inicio de la lista para siempre. Siempre usar un auxiliar para recorrer.',
      },
      {
        id: 'mb-lst-3',
        titulo: '3. Agregar adelante',
        teoria: [
          'Crear nuevo nodo con new(nuevo), asignar elem y sig := nil.',
          'Si lista vacía (pI = nil): pI := nuevo.',
          'Si lista no vacía: nuevo^.sig := pI; pI := nuevo.',
          'Resultado: los elementos quedan en ORDEN INVERSO al de ingreso.',
        ],
        ejemplo: `procedure agregarAdelante(var pI: listaE; num: integer);
var nuevo: listaE;
begin
  new(nuevo);
  nuevo^.elem := num;
  nuevo^.sig := nil;
  if (pI = nil) then
    pI := nuevo
  else begin
    nuevo^.sig := pI;
    pI := nuevo;
  end;
end;`,
        notasCatedra: 'Agregar adelante INVIERTE el orden. Si ingresás 1, 2, 3, la lista queda 3→2→1. Para mantener el orden hay que agregar al final.',
      },
      {
        id: 'mb-lst-4',
        titulo: '4. Agregar al final — opción 1 y opción 2',
        teoria: [
          'OPCIÓN 1: Recorre con aux hasta aux^.sig = nil (último nodo), luego aux^.sig := nuevo.',
          'OPCIÓN 2: Mantiene puntero pU al último nodo. Al agregar: pU^.sig := nuevo; pU := nuevo.',
          'Ambas manejan el caso lista vacía por separado.',
          'Opción 2 es más eficiente (O(1) vs O(n)) pero requiere gestionar dos punteros.',
        ],
        ejemplo: `{ OPCION 1 — recorre hasta el final }
procedure agregarAlFinal(var pI: listaE; num: integer);
var nuevo, aux: listaE;
begin
  new(nuevo); nuevo^.elem := num; nuevo^.sig := nil;
  if (pI = nil) then pI := nuevo
  else begin
    aux := pI;
    while (aux^.sig <> nil) do aux := aux^.sig;
    aux^.sig := nuevo;
  end;
end;

{ OPCION 2 — mantiene puntero al ultimo }
procedure agregarAlFinal2(var pI, pU: listaE; num: integer);
var nuevo: listaE;
begin
  new(nuevo); nuevo^.elem := num; nuevo^.sig := nil;
  if (pI = nil) then begin pI := nuevo; pU := nuevo; end
  else begin pU^.sig := nuevo; pU := nuevo; end;
end;`,
        notasCatedra: 'La cátedra pide conocer AMBAS opciones. La condición del while en opción 1 es aux^.sig <> nil (no aux <> nil) — así aux queda EN el último nodo, no después.',
      },
      {
        id: 'mb-lst-5',
        titulo: '5. Buscar, contar y procesar nodos',
        teoria: [
          'Buscar en lista: recorrer con aux y bandera, while (aux <> nil) and (not esta). Igual que en arreglos pero avanzando con aux^.sig.',
          'Para buscar se retorna boolean (o el puntero al nodo). La lista NO necesita estar ordenada.',
          'Contar nodos: recorrer toda la lista con aux sumando 1 por nodo (no hay "dimL" en listas).',
          'Sumar/promediar: acumular aux^.elem en cada paso del recorrido.',
          'Estos módulos van por VALOR (sin var): solo leen, no cambian la estructura de la lista.',
        ],
        ejemplo: `function buscar(pI: listaE; valor: integer): boolean;
var aux: listaE; esta: boolean;
begin
  aux := pI; esta := false;
  while (aux <> nil) and (not esta) do
    if (aux^.elem = valor) then esta := true
    else aux := aux^.sig;
  buscar := esta;
end;

function contar(pI: listaE): integer;
var aux: listaE; cont: integer;
begin
  aux := pI; cont := 0;
  while (aux <> nil) do begin
    cont := cont + 1;
    aux := aux^.sig;
  end;
  contar := cont;
end;`,
        notasCatedra: 'En el buscar con bandera, OJO: el avance aux := aux^.sig va en el else, igual que en arreglos. Si encontraste (esta := true), no avanzás, porque querés quedarte en ese nodo. El orden del while también importa: (aux <> nil) primero.',
      },
    ],
    miniTest: [
      {
        id: 'mt-lst-1',
        pregunta: '¿Por qué se usa un puntero auxiliar para recorrer la lista?',
        opciones: [
          'Para no perder el inicio de la lista al avanzar',
          'Porque Pascal lo exige sintácticamente',
          'Para ahorrar memoria dinámica',
          'Es lo mismo usar pri o aux — no hay diferencia',
        ],
        correcta: 0,
        explicacion: 'Si se avanzara con pri (pri := pri^.sig), se perdería la referencia al primer nodo y no podría recuperarse. El auxiliar es una copia de la dirección que se puede mover libremente.',
      },
      {
        id: 'mt-lst-2',
        pregunta: 'Si se ingresan los números 5, 3, 7 con agregarAdelante, ¿cómo queda la lista?',
        opciones: ['7→3→5→nil', '5→3→7→nil', '3→5→7→nil', '7→5→3→nil'],
        correcta: 0,
        explicacion: 'agregarAdelante pone cada nuevo elemento al principio. Insertar 5: lista=5. Insertar 3: lista=3→5. Insertar 7: lista=7→3→5. El último ingresado queda primero.',
      },
      {
        id: 'mt-lst-3',
        pregunta: 'En agregarAlFinal opción 1, ¿cuál es la condición del while para llegar al último nodo?',
        opciones: [
          'aux^.sig <> nil (aux queda EN el último)',
          'aux <> nil (aux quedaría DESPUÉS del último)',
          'aux^.elem <> nil',
          'aux^.sig = nil',
        ],
        correcta: 0,
        explicacion: 'La condición aux^.sig <> nil hace que aux se detenga EN el último nodo (cuyo .sig = nil). Si fuera aux <> nil, aux avanzaría hasta nil y no podría hacer aux^.sig := nuevo (nil^.sig es un error).',
      },
      {
        id: 'mt-lst-4',
        pregunta: 'Para contar la cantidad de nodos de una lista, ¿cómo se recorre?',
        opciones: [
          'while (aux <> nil): sumar 1 y avanzar aux := aux^.sig',
          'for i := 1 to dL (la lista tiene dimL como los arreglos)',
          'while (aux^.sig <> nil): contar hasta el anteúltimo',
          'Se usa sizeof(pI) que da la cantidad de nodos',
        ],
        correcta: 0,
        explicacion: 'Las listas no tienen dimensión lógica como los arreglos: hay que recorrer nodo por nodo con aux hasta nil, sumando 1 cada vez. sizeof(pI) da 4 (es un puntero), no la cantidad de nodos.',
      },
      {
        id: 'mt-lst-5',
        pregunta: 'En la función buscar de una lista, ¿dónde va el avance aux := aux^.sig?',
        opciones: [
          'En el else (solo se avanza si NO se encontró)',
          'Siempre, antes del if',
          'Después de poner esta := true',
          'No hace falta avanzar',
        ],
        correcta: 0,
        explicacion: 'El avance va en el else: si encontraste el valor (esta := true) no querés avanzar, querés quedarte en ese nodo. Es la misma estructura que la búsqueda con bandera en arreglos.',
      },
    ],
  },

  {
    id: 'listas-avanzado',
    titulo: 'Listas — Avanzado',
    descripcion: 'Eliminar (3 casos) e insertar ordenado (4→2 casos)',
    icono: '⚙️',
    color: '#f87171',
    microbloques: [
      {
        id: 'mb-lsta-1',
        titulo: '1. Eliminar un elemento (3 casos unificados)',
        teoria: [
          'Buscar con DOS punteros: actual avanza buscando el valor, ant lo sigue un paso atrás.',
          'CASO 1: No está (actual = nil al terminar el while) → no hacer nada.',
          'CASO 2: Es el primero (actual = pI) → pI := pI^.sig.',
          'CASO 3: No es el primero → ant^.sig := actual^.sig.',
          'En casos 2 y 3: dispose(actual) para liberar la memoria dinámica.',
          'NOMBRES: la cátedra usa actual y ant (no anterior, no prev).',
        ],
        ejemplo: `procedure eliminar(var pI: listaE; valor: integer);
var actual, ant: listaE;
begin
  actual := pI;
  while (actual <> nil) and (actual^.elem <> valor) do begin
    ant := actual;
    actual := actual^.sig;
  end;
  if (actual <> nil) then begin
    if (actual = pI) then
      pI := pI^.sig            { caso 2: es el primero }
    else
      ant^.sig := actual^.sig; { caso 3: no es el primero }
    dispose(actual);
  end;
  { caso 1 (actual=nil): no estaba, no se hace nada }
end;`,
        notasCatedra: '⚠ Usar los nombres actual y ant (es la notación de la cátedra). El dispose va DENTRO del if (actual <> nil). ant no se inicializa — solo se usa si actual <> pI, lo que significa que el while avanzó al menos una vez.',
      },
      {
        id: 'mb-lsta-2',
        titulo: '2. Insertar ordenado (4 casos → 2)',
        teoria: [
          'CASO 1: Lista vacía (pI = nil) → pI := nuevo.',
          'CASO 2: Va al principio (nuevo^.elem < primer elemento) → nuevo^.sig := pI; pI := nuevo.',
          'CASO 3: Va en el medio → anterior^.sig := nuevo; nuevo^.sig := actual.',
          'CASO 4: Va al final (actual llega a nil) → MISMO CÓDIGO que caso 3.',
          'Los casos 3 y 4 se UNIFICAN: en caso 4, actual = nil y nuevo^.sig := nil es correcto para el último nodo.',
          'El while avanza mientras actual^.elem < nuevo^.elem (busca dónde insertar).',
        ],
        ejemplo: `procedure insertar(var pI: listaE; valor: integer);
var actual, anterior, nuevo: listaE;
begin
  new(nuevo); nuevo^.elem := valor; nuevo^.sig := nil;
  if (pI = nil) then
    pI := nuevo                      { caso 1: lista vacia }
  else begin
    actual := pI; anterior := pI;
    while (actual <> nil) and (actual^.elem < nuevo^.elem) do begin
      anterior := actual;
      actual := actual^.sig;
    end;
    if (actual = pI) then begin      { caso 2: va al principio }
      nuevo^.sig := pI;
      pI := nuevo;
    end else begin                   { casos 3 y 4 unificados }
      anterior^.sig := nuevo;
      nuevo^.sig := actual;
      { caso 4: actual=nil, nuevo^.sig=nil = correcto para ultimo }
    end;
  end;
end;`,
        notasCatedra: 'La UNIFICACIÓN de casos 3 y 4 es la elegancia que muestra la cátedra. En caso 4, actual = nil, y hacer nuevo^.sig := nil es exactamente lo correcto para el último nodo de la lista.',
      },
      {
        id: 'mb-lsta-3',
        titulo: '3. Eliminar TODAS las ocurrencias + máximo de la lista',
        teoria: [
          'Eliminar TODAS las apariciones: cuando se elimina un nodo, actual ya quedó "fuera"; NO hay que avanzar actual, porque ant^.sig ahora apunta al siguiente.',
          'Truco: usar un puntero aux para el dispose y mover actual al siguiente ANTES de liberar.',
          'Máximo de la lista: inicializar may := pI^.elem (el primero) y recorrer con aux desde el segundo nodo.',
          'CUIDADO: si la lista está vacía (pI = nil), no se puede acceder a pI^.elem. Verificar primero.',
          'Toda operación que cambia la ESTRUCTURA (eliminar) recibe la lista por var; las que solo leen, por valor.',
        ],
        ejemplo: `procedure eliminarTodos(var pI: listaE; valor: integer);
var actual, ant, aux: listaE;
begin
  while (pI <> nil) and (pI^.elem = valor) do begin  { saca del frente }
    aux := pI; pI := pI^.sig; dispose(aux);
  end;
  actual := pI; ant := pI;
  while (actual <> nil) do begin
    if (actual^.elem = valor) then begin
      ant^.sig := actual^.sig;       { desconecta }
      aux := actual;
      actual := actual^.sig;         { avanza ANTES de liberar }
      dispose(aux);
    end else begin
      ant := actual;
      actual := actual^.sig;
    end;
  end;
end;`,
        notasCatedra: 'Eliminar todas las ocurrencias combina dos partes: (1) sacar del frente todos los nodos iguales al valor, (2) recorrer el resto con actual/ant. La clave es NO avanzar actual cuando se elimina, salvo que se guarde aux y se avance antes del dispose.',
      },
    ],
    miniTest: [
      {
        id: 'mt-lsta-1',
        pregunta: 'Al eliminar, ¿cómo se detecta que el elemento NO está en la lista?',
        opciones: [
          'actual = nil (el while terminó sin encontrarlo)',
          'ant = nil después del while',
          'actual = pI después del while',
          'actual^.sig = nil',
        ],
        correcta: 0,
        explicacion: 'Si el while termina con actual = nil, significa que se recorrió toda la lista sin encontrar el valor. El if (actual <> nil) cubre el caso: si actual es nil, no se hace nada (caso 1).',
      },
      {
        id: 'mt-lsta-2',
        pregunta: 'En insertar ordenado, ¿por qué los casos 3 y 4 se pueden unificar en el mismo código?',
        opciones: [
          'Porque en el caso 4, actual = nil y nuevo^.sig := nil es correcto para el último nodo',
          'Porque el caso 4 nunca ocurre en la práctica',
          'Porque anterior siempre apunta al último nodo',
          'No se pueden unificar — hay que escribirlos por separado',
        ],
        correcta: 0,
        explicacion: 'En el caso 4 (insertar al final), el while terminó porque actual llegó a nil. El código anterior^.sig := nuevo; nuevo^.sig := actual; hace nuevo^.sig := nil, que es exactamente correcto para el último nodo.',
      },
      {
        id: 'mt-lsta-3',
        pregunta: '¿Qué hace dispose(actual) dentro del procedimiento eliminar?',
        opciones: [
          'Libera la memoria dinámica del nodo — devuelve bytes al heap',
          'Hace actual := nil automáticamente',
          'Desconecta el nodo de la lista enlazada',
          'Solo libera si el nodo es el primero',
        ],
        correcta: 0,
        explicacion: 'dispose(actual) libera los bytes de memoria dinámica reservados con new() al crear ese nodo. La desconexión de la lista (modificar .sig) ya se hizo ANTES del dispose. Son dos cosas distintas.',
      },
      {
        id: 'mt-lsta-4',
        pregunta: 'Al eliminar TODAS las ocurrencias de un valor, ¿por qué NO se avanza actual cuando se elimina un nodo?',
        opciones: [
          'Porque tras desconectar, ant^.sig ya apunta al siguiente que hay que revisar',
          'Porque actual queda en nil automáticamente',
          'Porque siempre hay una sola ocurrencia',
          'Sí se avanza siempre, en todos los casos',
        ],
        correcta: 0,
        explicacion: 'Al hacer ant^.sig := actual^.sig se "saltea" el nodo eliminado. El siguiente nodo a revisar es ese al que ahora apunta ant^.sig. Si avanzaras actual igual, te saltearías un nodo que podría también tener el valor.',
      },
      {
        id: 'mt-lsta-5',
        pregunta: 'Para calcular el máximo de una lista, ¿con qué se inicializa "may" y qué hay que cuidar?',
        opciones: [
          'Con pI^.elem, cuidando que la lista no esté vacía (pI <> nil)',
          'Con 0, sin más cuidados',
          'Con nil',
          'Con el último nodo de la lista',
        ],
        correcta: 0,
        explicacion: 'Se inicializa con el primer elemento (pI^.elem) y se recorre el resto. Pero si pI = nil (lista vacía), acceder a pI^.elem es un error: hay que verificar antes. Inicializar con 0 falla con valores negativos.',
      },
    ],
  },
]

export const EJERCICIOS = [
  // ─── ARREGLOS BASE ───────────────────────────────────────────────
  {
    id: 'ej-arr-1',
    subhabilidadId: 'arreglos-base',
    nivel: 1,
    titulo: 'P4.1 — Análisis del programa sumador',
    enunciado: `Del siguiente programa, responder:
a) ¿Qué valores tiene "numeros" al finalizar el primer bloque for?
b) ¿Qué valores tiene "numeros" al terminar el programa completo?

program sumador;
type vnums = array [1..10] of integer;
var numeros: vnums; i: integer;
begin
  for i:=1 to 10 do        {primer bloque for}
    numeros[i] := i;
  for i := 2 to 10 do      {segundo bloque for}
    numeros[i] := numeros[i] + numeros[i-1]
end.`,
    pista: 'El primer for asigna i en cada posición (1,2,...,10). El segundo for acumula: numeros[2] = 2+1 = 3, numeros[3] = 3+3 = 6. Es la suma de prefijos (suma acumulada).',
    solucion: `{ RESPUESTA: }

{ a) Después del primer for: }
{ numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }

{ b) El segundo for calcula sumas acumuladas (prefijos): }
{ numeros[2] := 2 + numeros[1] = 2 + 1 = 3 }
{ numeros[3] := 3 + numeros[2] = 3 + 3 = 6 }
{ numeros[4] := 4 + numeros[3] = 4 + 6 = 10 }
{ numeros[5] := 5 + numeros[4] = 5 + 10 = 15 }
{ numeros[6] := 6 + numeros[5] = 6 + 15 = 21 }
{ numeros[7] := 7 + numeros[6] = 7 + 21 = 28 }
{ numeros[8] := 8 + numeros[7] = 8 + 28 = 36 }
{ numeros[9] := 9 + numeros[8] = 9 + 36 = 45 }
{ numeros[10] := 10 + numeros[9] = 10 + 45 = 55 }

{ Resultado final: numeros = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55] }`,
    retoExtra: 'Si el segundo for fuera "for i := 9 downto 1 do numeros[i] := numeros[i] + numeros[i+1]", ¿qué valores tendría numeros al terminar?',
  },
  {
    id: 'ej-arr-2',
    subhabilidadId: 'arreglos-base',
    nivel: 2,
    titulo: 'P4.1 — Completar cargarVector y mostrar',
    enunciado: `Completar los módulos del siguiente esqueleto.
- cargarVector: lee reales hasta que se ingresa 0 (no procesar el 0)
  o se llena el vector. Retorna el vector y su dimensión lógica.
- mostrar: imprime todos los elementos del vector.

const fisica = 150;
type vdatos = array[1..fisica] of real;

procedure cargarVector(var v: vdatos; var dimL: integer);
{ ... completar ... }

procedure mostrar(v: vdatos; dimL: integer);
{ ... completar ... }

var datos: vdatos; dim: integer;
begin
  dim := 0;
  cargarVector(datos, dim);
  mostrar(datos, dim);
end.`,
    pista: 'En cargarVector: leer el primer valor antes del while. Condición del while: (num <> 0) AND (dimL < fisica). Dentro del while: agregar el valor y leer el siguiente.',
    solucion: `const fisica = 150;
type vdatos = array[1..fisica] of real;

procedure cargarVector(var v: vdatos; var dimL: integer);
var num: real;
begin
  dimL := 0;
  readln(num);
  while (num <> 0) and (dimL < fisica) do begin
    dimL := dimL + 1;
    v[dimL] := num;
    readln(num);
  end;
end;

procedure mostrar(v: vdatos; dimL: integer);
var i: integer;
begin
  for i := 1 to dimL do
    writeln(v[i]);
end;

var datos: vdatos; dim: integer;
begin
  dim := 0;
  cargarVector(datos, dim);
  mostrar(datos, dim);
end.`,
    retoExtra: 'Agregar un módulo modificarYSumar(var v: vdatos; dimL: integer; n: real; var suma: real) que incremente cada elemento en n y devuelva la suma total.',
  },
  {
    id: 'ej-arr-3',
    subhabilidadId: 'arreglos-base',
    nivel: 3,
    titulo: 'P4.2 ej2 — CRUD de nombres en vector',
    enunciado: `Dado un vector de nombres (máx 500):
a) Cargar nombres hasta leer 'ZZZ' (no procesarlo)
b) Leer un nombre y ELIMINAR su primera ocurrencia del vector
c) Leer un nombre e INSERTAR en la posición 4 del vector

Usar los procedimientos insertar y eliminar de la cátedra.
Validar con la bandera pude. Informar si la operación tuvo éxito.`,
    pista: 'Para eliminar: primero buscar la posición con búsqueda lineal (retorna -1 si no está), luego llamar a eliminar(v, dimL, pude, pos). Para insertar en pos 4: verificar que pos=4 sea válida (dimL >= 3).',
    solucion: `const fisica = 500;
type vnombres = array[1..fisica] of string[50];

procedure cargar(var v: vnombres; var dL: integer);
var s: string;
begin
  dL := 0;
  readln(s);
  while (s <> 'ZZZ') and (dL < fisica) do begin
    dL := dL + 1; v[dL] := s; readln(s);
  end;
end;

function buscarPos(v: vnombres; dL: integer; nombre: string): integer;
var pos: integer; esta: boolean;
begin
  esta := false; pos := 1;
  while (pos <= dL) and (not esta) do
    if (v[pos] = nombre) then esta := true
    else pos := pos + 1;
  if esta then buscarPos := pos
  else buscarPos := -1;
end;

procedure eliminar(var a: vnombres; var dL: integer;
                   var pude: boolean; pos: integer);
var i: integer;
begin
  pude := false;
  if (pos >= 1) and (pos <= dL) then begin
    for i := pos to (dL - 1) do a[i] := a[i+1];
    pude := true; dL := dL - 1;
  end;
end;

procedure insertar(var a: vnombres; var dL: integer;
                   var pude: boolean; s: string; pos: integer);
var i: integer;
begin
  pude := false;
  if ((dL+1) <= fisica) and (pos >= 1) and (pos <= dL) then begin
    for i := dL downto pos do a[i+1] := a[i];
    pude := true; a[pos] := s; dL := dL + 1;
  end;
end;

var v: vnombres; dL, pos: integer; nombre: string; pude: boolean;
begin
  cargar(v, dL);
  readln(nombre);
  pos := buscarPos(v, dL, nombre);
  if pos = -1 then writeln('No encontrado')
  else begin
    eliminar(v, dL, pude, pos);
    if pude then writeln('Eliminado OK') else writeln('Error al eliminar');
  end;
  readln(nombre);
  insertar(v, dL, pude, nombre, 4);
  if pude then writeln('Insertado en pos 4')
  else writeln('No se pudo insertar (posicion invalida o sin espacio)');
end.`,
    retoExtra: 'Modificar el programa para que, en vez de insertar en posición 4, inserte el nombre en orden alfabético ascendente usando la plantilla de insertar ordenado.',
  },

  {
    id: 'ej-arr-4',
    subhabilidadId: 'arreglos-base',
    nivel: 1,
    titulo: 'Recorrer: suma, promedio y máximo',
    enunciado: `Dado un vector de enteros ya cargado (con su dimL), implementar
TRES módulos que solo LEEN el vector (por valor):

a) sumarTodos(v, dL): integer  -> suma de todos los elementos
b) promedio(v, dL): real       -> promedio (cuidado si dL = 0)
c) maximo(v, dL): integer      -> el mayor elemento

const fisica = 100;
type vent = array[1..fisica] of integer;

{ ... completar los tres módulos ... }`,
    pista: 'Suma: acumulador en 0 y for de 1 a dL. Promedio: suma / dL, pero si dL = 0 retornar 0 para no dividir por cero. Máximo: inicializar may := v[1] y comparar desde i := 2.',
    solucion: `const fisica = 100;
type vent = array[1..fisica] of integer;

function sumarTodos(v: vent; dL: integer): integer;
var i, s: integer;
begin
  s := 0;
  for i := 1 to dL do
    s := s + v[i];
  sumarTodos := s;
end;

function promedio(v: vent; dL: integer): real;
begin
  if (dL = 0) then promedio := 0
  else promedio := sumarTodos(v, dL) / dL;
end;

function maximo(v: vent; dL: integer): integer;
var i, may: integer;
begin
  may := v[1];
  for i := 2 to dL do
    if (v[i] > may) then may := v[i];
  maximo := may;
end;`,
    retoExtra: 'Agregar contarPares(v, dL): integer que cuente cuántos elementos son pares. Pista: if (v[i] mod 2 = 0).',
  },

  // ─── ARREGLOS BÚSQUEDAS ──────────────────────────────────────────
  {
    id: 'ej-bsq-1',
    subhabilidadId: 'arreglos-busquedas',
    nivel: 1,
    titulo: 'P4.2 ej1a — Búsqueda con bandera (desordenado)',
    enunciado: `Dado un vector de enteros (máx 500), implementar una función
que reciba el vector, su dimL y un valor n, y retorne
true si n se encuentra en el vector, false si no.

Usar la búsqueda con bandera.
CRÍTICO: el orden de condiciones en el while importa.

const fisica = 500;
type venteros = array[1..fisica] of integer;

function buscar(a: venteros; dL: integer; valor: integer): boolean;
{ ... completar ... }`,
    pista: 'El while debe ser: (pos <= dL) and (not esta). Primero verificar que pos no salió del rango, LUEGO verificar si encontraste. Si pos > dL, el short-circuit evita evaluar a[pos].',
    solucion: `const fisica = 500;
type venteros = array[1..fisica] of integer;

function buscar(a: venteros; dL: integer; valor: integer): boolean;
var pos: integer; esta: boolean;
begin
  esta := false;
  pos := 1;
  while (pos <= dL) and (not esta) do
    if (a[pos] = valor) then esta := true
    else pos := pos + 1;
  buscar := esta;
end;

{ Uso en el programa principal: }
var v: venteros; dL, n: integer;
begin
  { ... cargar v y dL ... }
  readln(n);
  if buscar(v, dL, n) then writeln(n, ' SI esta en el vector')
  else writeln(n, ' NO esta en el vector');
end.`,
    retoExtra: 'Modificar buscar para que en vez de boolean retorne la POSICIÓN del elemento (o -1 si no está). Renombrala a "posicion".',
  },
  {
    id: 'ej-bsq-2',
    subhabilidadId: 'arreglos-busquedas',
    nivel: 2,
    titulo: 'P4.2 ej1b — Búsqueda mejorada (ordenado)',
    enunciado: `Modificar la función de búsqueda para que funcione
con un vector ordenado de manera ASCENDENTE.
Usar búsqueda mejorada (puede parar antes de llegar al final).

Ventaja: si a[pos] > valor, el valor no puede estar más adelante.

function existeOrdenado(a: venteros; dL: integer; valor: integer): boolean;
{ ... completar ... }`,
    pista: 'El while avanza mientras (pos <= dL) AND (a[pos] < valor). Cuando para, verificar: (pos <= dL) AND (a[pos] = valor). Necesita las dos condiciones en el if para no acceder fuera del rango.',
    solucion: `function existeOrdenado(a: venteros; dL: integer; valor: integer): boolean;
var pos: integer;
begin
  pos := 1;
  while (pos <= dL) and (a[pos] < valor) do
    pos := pos + 1;
  if (pos <= dL) and (a[pos] = valor) then
    existeOrdenado := true
  else
    existeOrdenado := false;
end;`,
    retoExtra: 'Comparar en papel cuántas iteraciones hacen buscar (desordenada) vs existeOrdenado para buscar el valor 99 en el vector [10, 20, 30, ..., 100] (10 elementos).',
  },
  {
    id: 'ej-bsq-3',
    subhabilidadId: 'arreglos-busquedas',
    nivel: 3,
    titulo: 'Búsqueda dicotómica completa',
    enunciado: `Implementar la búsqueda dicotómica para un vector ordenado ascendente.

Recibe: vector a, dimL, valor buscado.
Retorna: true si el valor está, false si no.

Variables a usar: pri, ult, medio, ok.

function dicotomica(a: venteros; dL: integer; valor: integer): boolean;
{ ... completar ... }`,
    pista: 'Calcular medio := (pri + ult) div 2 ANTES del while y también AL FINAL de cada iteración del while. El while termina cuando pri > ult (rango vacío) o valor = a[medio] (encontrado).',
    solucion: `function dicotomica(a: venteros; dL: integer; valor: integer): boolean;
var pri, ult, medio: integer; ok: boolean;
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
end;`,
    retoExtra: 'Trazar en papel la búsqueda del valor 7 en el vector [1, 3, 5, 7, 9, 11, 13]. Indicar los valores de pri, ult y medio en cada iteración.',
  },

  {
    id: 'ej-bsq-4',
    subhabilidadId: 'arreglos-busquedas',
    nivel: 2,
    titulo: 'Buscar posición y eliminar esa ocurrencia',
    enunciado: `Dado un vector de enteros y un valor leído por teclado:
1. Buscar la POSICIÓN del valor (función que retorna -1 si no está).
2. Si está, eliminarlo usando el procedure eliminar de la cátedra.
3. Informar el resultado.

Combina búsqueda con bandera + eliminar (con desplazamiento "to").

const fisica = 500;
type vent = array[1..fisica] of integer;

{ completar: posicion(...) : integer  y  el programa principal }`,
    pista: 'posicion usa while (pos <= dL) and (not esta), retorna pos o -1. Luego: si pos <> -1, llamar eliminar(v, dL, pude, pos). Recordá que eliminar desplaza con for i := pos to dL-1.',
    solucion: `const fisica = 500;
type vent = array[1..fisica] of integer;

function posicion(a: vent; dL: integer; valor: integer): integer;
var pos: integer; esta: boolean;
begin
  esta := false; pos := 1;
  while (pos <= dL) and (not esta) do
    if (a[pos] = valor) then esta := true
    else pos := pos + 1;
  if esta then posicion := pos else posicion := -1;
end;

procedure eliminar(var a: vent; var dL: integer;
                   var pude: boolean; pos: integer);
var i: integer;
begin
  pude := false;
  if (pos >= 1) and (pos <= dL) then begin
    for i := pos to (dL - 1) do a[i] := a[i+1];
    pude := true; dL := dL - 1;
  end;
end;

var v: vent; dL, valor, pos: integer; pude: boolean;
begin
  { ... cargar v y dL ... }
  readln(valor);
  pos := posicion(v, dL, valor);
  if (pos = -1) then
    writeln('El valor no esta en el vector')
  else begin
    eliminar(v, dL, pude, pos);
    if pude then writeln('Eliminado de la posicion ', pos)
    else writeln('No se pudo eliminar');
  end;
end.`,
    retoExtra: 'Modificar para eliminar TODAS las ocurrencias del valor (no solo la primera). Pista: repetir buscar+eliminar mientras posicion() distinto de -1.',
  },

  // ─── PUNTEROS ────────────────────────────────────────────────────
  {
    id: 'ej-ptr-1',
    subhabilidadId: 'punteros',
    nivel: 1,
    titulo: 'P5 ej1 — sizeof con string (prueba de escritorio)',
    enunciado: `¿Qué imprime cada writeln? Justificar cada línea.
Usar tabla P5: integer=2, real=4, char=1, puntero=4, string[n]=n+1.

program punteros;
type
  cadena = string[50];
  puntero_cadena = ^cadena;
var pc: puntero_cadena;
begin
  writeln(sizeof(pc));       { linea A }
  new(pc);
  writeln(sizeof(pc));       { linea B }
  pc^:= 'un nuevo nombre';
  writeln(sizeof(pc));       { linea C }
  writeln(sizeof(pc^));      { linea D }
  pc^:= 'otro nuevo nombre distinto al anterior';
  writeln(sizeof(pc^));      { linea E }
end.

Completar con las respuestas en formato Pascal (como comentarios):
{ A: ? bytes  -- porque ... }
{ B: ? bytes  -- porque ... }
{ ... }`,
    pista: 'sizeof(puntero) = siempre 4. sizeof(pc^) = sizeof(cadena) = sizeof(string[50]) = 51. El tamaño NO cambia con el contenido — depende del TIPO declarado.',
    solucion: `{ A: 4 bytes  -- pc es de tipo puntero_cadena = ^cadena = puntero. Un puntero SIEMPRE ocupa 4 bytes. }
{ B: 4 bytes  -- new(pc) reserva memoria dinamica pero sizeof(pc) sigue siendo el puntero = 4 bytes. }
{ C: 4 bytes  -- asignar a pc^ no cambia el tamaño de pc (el puntero). sizeof(pc) = 4. }
{ D: 51 bytes -- pc^ es de tipo cadena = string[50]. sizeof(string[50]) = 50+1 = 51 bytes. }
{ E: 51 bytes -- pc^ sigue siendo del tipo cadena = string[50] = 51 bytes. }
{              El CONTENIDO cambio pero el TIPO no. sizeof depende del tipo, no del contenido. }`,
    retoExtra: '¿Qué pasa si se agrega "dispose(pc); writeln(pc^);" al final? Explicar qué tipo de error ocurre y en qué momento (compilación o ejecución).',
  },
  {
    id: 'ej-ptr-2',
    subhabilidadId: 'punteros',
    nivel: 2,
    titulo: 'P5 ej5 — Cálculo de memoria disponible',
    enunciado: `Calcular la memoria disponible en cada punto marcado.
Se empieza con 400.000 bytes libres.
Tabla P5: integer=2, real=4, char=1, boolean=1, puntero=4, string[n]=n+1.

Program Alocacion_Dinamica;
Type
  TEmpleado = record
    sucursal: char;            { ? bytes }
    apellido: string[25];      { ? bytes }
    correoElectronico: string[40]; { ? bytes }
    sueldo: real;              { ? bytes }
  end;
Var
  alguien: TEmpleado;          { var estatica }
  PtrEmpleado: ^TEmpleado;     { var estatica: solo el puntero }
Begin
  { (I) inicio del programa, variables ya declaradas }
  Readln(alguien.apellido);
  { (II) despues del Readln }
  New(PtrEmpleado);
  { (III) despues del New }
  Readln(PtrEmpleado^.apellido);
  { (IV) despues del segundo Readln }
  Dispose(PtrEmpleado);
  { (V) despues del Dispose }
End.`,
    pista: 'Primero calcular sizeof(TEmpleado) sumando cada campo. Luego calcular total estático (alguien + PtrEmpleado). New descuenta sizeof(TEmpleado) del heap. Dispose los devuelve. Readln no cambia memoria.',
    solucion: `{ CALCULO DE TIPOS: }
{ TEmpleado: }
{   sucursal: char = 1 byte }
{   apellido: string[25] = 26 bytes }
{   correoElectronico: string[40] = 41 bytes }
{   sueldo: real = 4 bytes }
{   TOTAL TEmpleado = 1 + 26 + 41 + 4 = 72 bytes }

{ Variables estaticas del programa: }
{   alguien: TEmpleado = 72 bytes }
{   PtrEmpleado: ^TEmpleado = puntero = 4 bytes }
{   TOTAL ESTATICO = 76 bytes }

{ (I) Inicio del programa (variables ya declaradas): }
{     400.000 - 76 = 399.924 bytes libres }

{ (II) Despues de Readln(alguien.apellido): }
{     399.924 bytes libres (Readln NO reserva/libera memoria) }

{ (III) Despues de New(PtrEmpleado): }
{     399.924 - 72 = 399.852 bytes libres }
{     (New reserva sizeof(TEmpleado) = 72 bytes del heap) }

{ (IV) Despues del segundo Readln: }
{     399.852 bytes libres (Readln no cambia memoria) }

{ (V) Despues de Dispose(PtrEmpleado): }
{     399.852 + 72 = 399.924 bytes libres }
{     (Dispose devuelve los 72 bytes dinamicos al heap) }`,
    retoExtra: 'Si se agrega un procedure con una variable local "aux: TEmpleado", ¿cuántos bytes más se descontarían durante la ejecución de ese procedure? ¿Son estáticos o dinámicos?',
  },
  {
    id: 'ej-ptr-3',
    subhabilidadId: 'punteros',
    nivel: 3,
    titulo: 'P5 ej4c/d — Puntero por valor vs por var',
    enunciado: `Analizar qué imprime cada programa y explicar por qué.

{ PROGRAMA C: puntero pasado por VALOR }
type cadena = string[50]; puntero_cadena = ^cadena;
procedure cambiarTexto(pun: puntero_cadena);
begin pun^:= 'Otro texto'; end;
var pc: puntero_cadena;
begin
  new(pc); pc^:='Un texto';
  writeln(pc^);       { imprime: ??? }
  cambiarTexto(pc);
  writeln(pc^);       { imprime: ??? }
end.

{ PROGRAMA D: new dentro del modulo, puntero por VALOR }
procedure cambiarTexto(pun: puntero_cadena);
begin new(pun); pun^:= 'Otro texto'; end;
var pc: puntero_cadena;
begin
  new(pc); pc^:='Un texto';
  writeln(pc^);       { imprime: ??? }
  cambiarTexto(pc);
  writeln(pc^);       { imprime: ??? }
end.`,
    pista: 'En C: pun es copia de la dirección, pero APUNTAN AL MISMO LUGAR. Cambiar pun^ cambia el contenido. En D: new(pun) hace que pun apunte a un NUEVO lugar — pero pun es copia, pc en el llamador no cambia.',
    solucion: `{ PROGRAMA C — Salida: }
{ Un texto }
{ Otro texto }
{ Por que: pun recibe una COPIA de la direccion de pc. }
{ Ambos (pun y pc) apuntan al MISMO string en memoria. }
{ pun^:='Otro texto' modifica ESE string. }
{ Al volver al main, pc sigue apuntando al mismo lugar, que ahora tiene 'Otro texto'. }

{ PROGRAMA D — Salida: }
{ Un texto }
{ Un texto }
{ Por que: new(pun) crea un NUEVO espacio de memoria y hace que pun apunte ahi. }
{ Pero pun es una COPIA por valor -- pc en el llamador NO cambia. }
{ pc sigue apuntando al string original 'Un texto'. }
{ La nueva memoria creada con new(pun) dentro del modulo se pierde (memory leak). }

{ CONCLUSION: }
{ - Pasar puntero por VALOR: puede modificar p^ (el contenido) pero NO p (la direccion). }
{ - Para que new() dentro de un modulo afecte al llamador, }
{   el puntero debe ir por VAR: procedure cambiarTexto(var pun: puntero_cadena) }`,
    retoExtra: 'Reescribir el programa D para que SÍ funcione (que el segundo writeln imprima "Otro texto"). Solo cambiar la firma del procedimiento.',
  },

  {
    id: 'ej-ptr-4',
    subhabilidadId: 'punteros',
    nivel: 1,
    titulo: 'Memoria dinámica en cada punto (A, B, C)',
    enunciado: `Indicar la memoria DINÁMICA reservada en cada punto marcado.
Se arranca con 0 bytes dinámicos en uso.
Tabla: real = 4 bytes, puntero = 4 bytes.

Program uno;
Type puntero = ^real;
Var p, q: puntero;
Begin
  new(p);          { punto A }
  p^ := 3.14;
  new(q);          { punto B }
  dispose(p);      { punto C }
  p := nil;        { punto D }
End.

¿Cuántos bytes DINÁMICOS hay en uso en A, B, C y D?
Justificar especialmente C y D.`,
    pista: 'new(x) suma sizeof(x^) = 4 bytes (real). dispose libera 4. p := nil NO libera (la memoria de q sigue ahí). Las variables p y q son ESTÁTICAS (4+4), no cuentan como dinámicas.',
    solucion: `{ Recordar: sizeof(real) = 4. Cada new de un ^real reserva 4 bytes dinamicos. }

{ punto A: despues de new(p)  -> 4 bytes dinamicos (el real de p) }
{ punto B: despues de new(q)  -> 8 bytes dinamicos (real de p + real de q) }
{ punto C: despues de dispose(p) -> 4 bytes dinamicos }
{          (se liberaron los 4 de p; quedan los 4 de q) }
{ punto D: despues de p := nil -> 4 bytes dinamicos }
{          (p := nil NO libera memoria; la de q sigue ocupada) }

{ OJO: nunca se hizo dispose(q), asi que al terminar el programa }
{ quedan 4 bytes sin liberar = MEMORY LEAK. }
{ Las variables p y q en si son estaticas: 4 + 4 = 8 bytes estaticos. }`,
    retoExtra: '¿Qué línea habría que agregar antes del End para que NO haya memory leak? ¿En qué punto?',
  },

  // ─── LISTAS BASE ─────────────────────────────────────────────────
  {
    id: 'ej-lst-1',
    subhabilidadId: 'listas-base',
    nivel: 1,
    titulo: 'P6 ej1c — Imprimir lista (JugamosConListas)',
    enunciado: `El siguiente programa usa armarNodo (que agrega adelante).
Si se ingresan los números: 10 21 13 48 0

a) ¿Cómo queda conformada la lista?
b) Implementar el módulo que imprime todos los números.

type lista = ^nodo;
nodo = record num: integer; sig: lista; end;

procedure armarNodo(var L: lista; v: integer);  { agrega adelante }

{ Completar: }
procedure imprimir(pI: lista);
{ debe imprimir cada elemento, uno por línea }`,
    pista: 'armarNodo agrega ADELANTE, así que la lista queda invertida: 48→13→21→10. Para imprimir: aux := pI, luego while aux <> nil, writeln(aux^.num), aux := aux^.sig.',
    solucion: `{ a) La lista queda: 48 -> 13 -> 21 -> 10 -> nil }
{ (cada nuevo número se agrega AL FRENTE) }

procedure imprimir(pI: lista);
var aux: lista;
begin
  aux := pI;
  while (aux <> nil) do begin
    writeln(aux^.num);
    aux := aux^.sig;
  end;
end;

{ Imprime: 48, 13, 21, 10 (en ese orden — invertido al de ingreso) }`,
    retoExtra: 'Implementar un módulo incrementar(pI: lista; n: integer) que sume n a cada elemento. Nota: pI va por VALOR aquí (no var) porque no se cambia la estructura, solo el contenido de los nodos.',
  },
  {
    id: 'ej-lst-2',
    subhabilidadId: 'listas-base',
    nivel: 2,
    titulo: 'P6 ej3a — Agregar al final (opción 1)',
    enunciado: `Modificar el módulo armarNodo para que los elementos
se guarden EN EL MISMO ORDEN en que fueron ingresados.

Si se ingresan: 10 21 13 48 0
La lista debe quedar: 10 -> 21 -> 13 -> 48 -> nil

Implementar agregarAlFinal usando la OPCIÓN 1
(recorrer hasta el último nodo con un auxiliar).

procedure agregarAlFinal(var pI: lista; num: integer);
{ ... completar ... }`,
    pista: 'Crear nuevo nodo con sig := nil. Si pI = nil: pI := nuevo. Sino: aux := pI, while aux^.sig <> nil do aux := aux^.sig, luego aux^.sig := nuevo. La condición es aux^.sig <> nil para quedar EN el último.',
    solucion: `procedure agregarAlFinal(var pI: lista; num: integer);
var nuevo, aux: lista;
begin
  new(nuevo);
  nuevo^.num := num;
  nuevo^.sig := nil;
  if (pI = nil) then
    pI := nuevo
  else begin
    aux := pI;
    while (aux^.sig <> nil) do
      aux := aux^.sig;
    aux^.sig := nuevo;
  end;
end;

{ Con los numeros 10 21 13 48: }
{ La lista queda: 10 -> 21 -> 13 -> 48 -> nil }
{ (mismo orden que fueron ingresados) }`,
    retoExtra: 'Implementar la opción 2 (con puntero al último). La firma sería: procedure agregarAlFinal2(var pI, pU: lista; num: integer). ¿Por qué la opción 2 es más eficiente?',
  },

  {
    id: 'ej-lst-3',
    subhabilidadId: 'listas-base',
    nivel: 1,
    titulo: 'Contar nodos y sumar elementos',
    enunciado: `Dada una lista de enteros ya armada (pri), implementar:

a) contar(pI): integer  -> cantidad de nodos de la lista
b) sumar(pI): integer   -> suma de todos los elem

Ambos por VALOR (no modifican la lista).

type listaE = ^datosEnteros;
     datosEnteros = record elem: integer; sig: listaE; end;

{ ... completar ... }`,
    pista: 'Recorrer con aux := pI y while (aux <> nil). En contar sumar 1 por nodo; en sumar acumular aux^.elem. Avanzar siempre con aux := aux^.sig. Una lista vacía (pI = nil) da 0 en ambos.',
    solucion: `function contar(pI: listaE): integer;
var aux: listaE; cont: integer;
begin
  aux := pI; cont := 0;
  while (aux <> nil) do begin
    cont := cont + 1;
    aux := aux^.sig;
  end;
  contar := cont;
end;

function sumar(pI: listaE): integer;
var aux: listaE; s: integer;
begin
  aux := pI; s := 0;
  while (aux <> nil) do begin
    s := s + aux^.elem;
    aux := aux^.sig;
  end;
  sumar := s;
end;`,
    retoExtra: 'Implementar promedio(pI): real reutilizando contar y sumar. Cuidar el caso lista vacía (no dividir por 0).',
  },
  {
    id: 'ej-lst-4',
    subhabilidadId: 'listas-base',
    nivel: 2,
    titulo: 'Buscar un valor en la lista (con bandera)',
    enunciado: `Implementar una función que indique si un valor está en la lista.
La lista NO está ordenada.

function buscar(pI: listaE; valor: integer): boolean;

CRÍTICO: el orden del while y dónde va el avance aux := aux^.sig.

{ ... completar ... }`,
    pista: 'while (aux <> nil) and (not esta). El avance va en el ELSE: si encontraste, no avanzás. Igual estructura que la búsqueda con bandera de arreglos, pero con punteros.',
    solucion: `function buscar(pI: listaE; valor: integer): boolean;
var aux: listaE; esta: boolean;
begin
  aux := pI;
  esta := false;
  while (aux <> nil) and (not esta) do
    if (aux^.elem = valor) then
      esta := true
    else
      aux := aux^.sig;
  buscar := esta;
end;

{ El orden (aux <> nil) primero evita evaluar aux^.elem cuando aux = nil. }`,
    retoExtra: 'Modificar para que retorne el puntero al nodo encontrado (o nil si no está). Firma: function buscarNodo(pI: listaE; valor: integer): listaE.',
  },

  // ─── LISTAS AVANZADO ─────────────────────────────────────────────
  {
    id: 'ej-lsta-1',
    subhabilidadId: 'listas-avanzado',
    nivel: 2,
    titulo: 'P6 ej9b — Eliminar de lista (3 casos)',
    enunciado: `Implementar el módulo Eliminar que recibe la lista y un valor,
y elimina ese valor de la lista si existe.
La lista puede no estar ordenada.

3 casos a manejar:
1. El elemento no está en la lista
2. El elemento es el primero (actual = pI)
3. El elemento no es el primero

Usar los nombres actual y ant (notación de la cátedra).

procedure eliminar(var pI: listaE; valor: integer);
{ ... completar ... }`,
    pista: 'Buscar con while (actual <> nil) and (actual^.elem <> valor), avanzando ant := actual antes de actual := actual^.sig. Después: si actual <> nil, verificar si actual = pI (caso 2) o no (caso 3). Hacer dispose.',
    solucion: `procedure eliminar(var pI: listaE; valor: integer);
var actual, ant: listaE;
begin
  actual := pI;
  while (actual <> nil) and (actual^.elem <> valor) do begin
    ant := actual;
    actual := actual^.sig;
  end;
  if (actual <> nil) then begin
    if (actual = pI) then
      pI := pI^.sig            { caso 2: era el primero }
    else
      ant^.sig := actual^.sig; { caso 3: no era el primero }
    dispose(actual);
  end;
  { caso 1: actual = nil, no estaba en la lista, no se hace nada }
end;`,
    retoExtra: 'Modificar para eliminar TODAS las ocurrencias del valor. Pista: cuando se elimina un nodo, actual ya apunta al siguiente (actual^.sig antes de dispose). No avanzar actual si se eliminó.',
  },
  {
    id: 'ej-lsta-2',
    subhabilidadId: 'listas-avanzado',
    nivel: 3,
    titulo: 'P6 ej8 — Insertar ordenado ascendente (4→2 casos)',
    enunciado: `Implementar insertar que agrega un valor a la lista
manteniendo el orden ASCENDENTE.

4 casos:
1. Lista vacía
2. Va al principio (nuevo^.elem < primer elemento)
3. Va en el medio
4. Va al final (actual llega a nil)

Los casos 3 y 4 se unifican. Explicar por qué en un comentario.

procedure insertar(var pI: listaE; valor: integer);
{ ... completar ... }`,
    pista: 'Avanzar mientras actual^.elem < nuevo^.elem. Caso 2: actual = pI después del while (el valor va antes del primero). Casos 3/4: anterior^.sig := nuevo; nuevo^.sig := actual. En caso 4, actual = nil que es lo correcto.',
    solucion: `procedure insertar(var pI: listaE; valor: integer);
var actual, anterior, nuevo: listaE;
begin
  new(nuevo); nuevo^.elem := valor; nuevo^.sig := nil;
  if (pI = nil) then
    pI := nuevo                      { caso 1: lista vacia }
  else begin
    actual := pI; anterior := pI;
    while (actual <> nil) and (actual^.elem < nuevo^.elem) do begin
      anterior := actual;
      actual := actual^.sig;
    end;
    if (actual = pI) then begin      { caso 2: va al principio }
      nuevo^.sig := pI;
      pI := nuevo;
    end else begin                   { casos 3 y 4 UNIFICADOS: }
      anterior^.sig := nuevo;
      nuevo^.sig := actual;
      { caso 4: actual=nil => nuevo^.sig=nil = correcto para el ultimo nodo }
    end;
  end;
end;`,
    retoExtra: 'Trazar en papel la insercion ordenada de los valores 5, 2, 8, 1, 3 (en ese orden). Dibujar la lista despues de cada insercion.',
  },
  {
    id: 'ej-lsta-3',
    subhabilidadId: 'listas-avanzado',
    nivel: 3,
    titulo: 'Eliminar TODAS las ocurrencias de un valor',
    enunciado: `Implementar un módulo que elimine TODAS las apariciones
de un valor en la lista (puede haber repetidos, lista desordenada).
Liberar la memoria de cada nodo eliminado con dispose.

procedure eliminarTodos(var pI: listaE; valor: integer);

OJO: cuando eliminás un nodo NO debés avanzar actual,
porque ant^.sig ya apunta al siguiente a revisar.

{ ... completar ... }`,
    pista: 'Primero sacá del FRENTE todos los nodos iguales al valor (while pI <> nil y pI^.elem = valor). Después recorré con actual/ant: si coincide, guardá aux, avanzá actual y dispose(aux); si no, avanzá ant y actual normalmente.',
    solucion: `procedure eliminarTodos(var pI: listaE; valor: integer);
var actual, ant, aux: listaE;
begin
  { 1) eliminar los del frente }
  while (pI <> nil) and (pI^.elem = valor) do begin
    aux := pI;
    pI := pI^.sig;
    dispose(aux);
  end;
  { 2) recorrer el resto }
  actual := pI;
  ant := pI;
  while (actual <> nil) do begin
    if (actual^.elem = valor) then begin
      ant^.sig := actual^.sig;   { desconectar }
      aux := actual;
      actual := actual^.sig;     { avanzar ANTES de liberar }
      dispose(aux);
    end else begin
      ant := actual;
      actual := actual^.sig;
    end;
  end;
end;`,
    retoExtra: 'Trazar en papel sobre la lista 4→2→4→4→7→4 eliminando el valor 4. ¿Cómo queda? (debe quedar 2→7).',
  },
  {
    id: 'ej-lsta-4',
    subhabilidadId: 'listas-avanzado',
    nivel: 3,
    titulo: 'Proyecto integrador — agenda de nombres ordenada',
    enunciado: `Programa que combina TODO lo de listas:
1. Cargar una lista de nombres en ORDEN ALFABÉTICO ascendente
   (insertar ordenado), leyendo hasta 'ZZZ'.
2. Leer un nombre: si EXISTE, eliminarlo; si NO existe, insertarlo en orden.
3. Mostrar la lista final.

Reutilizar: insertar (ordenado), buscar (bandera) y eliminar (3 casos).

type lista = ^nodo;
     nodo = record nombre: string[30]; sig: lista; end;

{ ... armar el programa principal usando los módulos ... }`,
    pista: 'El paso 2 es: si buscar(L, n) entonces eliminar(L, n), sino insertar(L, n). Los módulos insertar/eliminar/buscar son los mismos de la teoría pero con string en vez de integer. Comparar strings con <, =, > funciona alfabéticamente en Pascal.',
    solucion: `type lista = ^nodo;
     nodo = record nombre: string[30]; sig: lista; end;

procedure insertar(var pI: lista; valor: string);
var actual, anterior, nuevo: lista;
begin
  new(nuevo); nuevo^.nombre := valor; nuevo^.sig := nil;
  if (pI = nil) then pI := nuevo
  else begin
    actual := pI; anterior := pI;
    while (actual <> nil) and (actual^.nombre < nuevo^.nombre) do begin
      anterior := actual;
      actual := actual^.sig;
    end;
    if (actual = pI) then begin
      nuevo^.sig := pI; pI := nuevo;
    end else begin
      anterior^.sig := nuevo; nuevo^.sig := actual;
    end;
  end;
end;

function buscar(pI: lista; valor: string): boolean;
var aux: lista; esta: boolean;
begin
  aux := pI; esta := false;
  while (aux <> nil) and (not esta) do
    if (aux^.nombre = valor) then esta := true
    else aux := aux^.sig;
  buscar := esta;
end;

procedure eliminar(var pI: lista; valor: string);
var actual, ant: lista;
begin
  actual := pI;
  while (actual <> nil) and (actual^.nombre <> valor) do begin
    ant := actual; actual := actual^.sig;
  end;
  if (actual <> nil) then begin
    if (actual = pI) then pI := pI^.sig
    else ant^.sig := actual^.sig;
    dispose(actual);
  end;
end;

procedure mostrar(pI: lista);
var aux: lista;
begin
  aux := pI;
  while (aux <> nil) do begin
    writeln(aux^.nombre); aux := aux^.sig;
  end;
end;

var L: lista; s, n: string;
begin
  L := nil;
  readln(s);
  while (s <> 'ZZZ') do begin
    insertar(L, s); readln(s);
  end;
  readln(n);
  if buscar(L, n) then eliminar(L, n)
  else insertar(L, n);
  mostrar(L);
end.`,
    retoExtra: 'Agregar un contador de cuántos nombres tiene la lista al final y mostrarlo. Reutilizar la función contar recorriendo con aux.',
  },
]
