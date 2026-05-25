# Guía para reemplazar imágenes y completar los escenarios

Este proyecto ya queda funcional con imágenes reales de personajes y enemigos. Los fondos y plataformas están construidos por código para que el juego funcione aunque todavía no tengas todos los assets finales.

## 1. Dónde colocar las imágenes

Mantén estos nombres si quieres reemplazar imágenes sin tocar código:

```txt
src/assets/images/personajes/heroe_idle.png
src/assets/images/personajes/heroe_correr_sheet.png
src/assets/images/enemigos/condor_ancestral.png
src/assets/images/enemigos/guardian_piedra.png
src/assets/images/enemigos/murcielago_mistico.png
src/assets/images/enemigos/kunturax_jefe.png
```

Si generas fondos completos, puedes crear esta carpeta:

```txt
src/assets/images/fondos/
```

Y guardar:

```txt
nivel1_entrada_torre.png
nivel2_interior_torre.png
nivel3_cima_condor.png
```

Por ahora no es obligatorio, porque los escenarios ya se dibujan desde código.

## 2. Cómo debe verse cada nivel

### Nivel 1: Entrada de la Torre

Debe sentirse como la parte inicial del viaje. Es más claro, abierto y con elementos de montaña.

Incluye:
- cielo andino;
- montañas al fondo;
- pasto seco y tierra;
- ruinas pequeñas de piedra;
- rocas decorativas;
- entrada o portal antiguo de la torre;
- guardianes de piedra como primeros enemigos.

Prompt recomendado:

```txt
Escenario para videojuego 2D de aventura, entrada de una torre ancestral andina en medio de montañas ecuatorianas, ruinas de piedra, cielo dramático, ambiente místico, estilo semi-realista, vista lateral, fondo para plataformas, alta calidad, sin personajes
```

### Nivel 2: Interior de la Torre

Debe sentirse más oscuro y misterioso. Aquí el jugador ya entró a la torre.

Incluye:
- paredes de piedra antiguas;
- antorchas;
- símbolos dorados;
- plataformas internas;
- trampas;
- murciélagos místicos.

Prompt recomendado:

```txt
Interior de una torre ancestral andina para videojuego 2D de aventura, paredes de piedra antiguas, antorchas, símbolos dorados místicos, ambiente oscuro, plataformas de piedra, estilo semi-realista, vista lateral, alta calidad, sin personajes
```

### Nivel 3: Cima del Cóndor

Debe sentirse como la preparación para el jefe final. Es más épico y peligroso.

Incluye:
- cima de la torre;
- cielo dramático con nubes;
- viento y partículas;
- símbolos dorados;
- altar ancestral;
- enemigos tipo cóndor/murciélago;
- portal hacia el jefe final.

Prompt recomendado:

```txt
Cima de una torre ancestral andina para videojuego 2D, cielo dramático con nubes, altar del cóndor, símbolos dorados, ambiente místico y épico, plataformas de piedra, estilo semi-realista, vista lateral, alta calidad, sin personajes
```

## 3. Elementos que conviene generar como assets separados

Lo mejor no es tener solo una imagen de fondo. Conviene tener piezas reutilizables:

```txt
plataforma_piedra.png
roca_andina.png
antorcha.png
pinchos_piedra.png
pluma_dorada.png
cristal_mistico.png
checkpoint_condor.png
portal_torre.png
altar_condor.png
```

Así puedes armar varios niveles con el mismo estilo sin generar una imagen gigante para todo.

## 4. Dónde se editan los niveles

Los niveles están en:

```txt
src/scenes/Level1Scene.js
src/scenes/Level2Scene.js
src/scenes/Level3Scene.js
src/scenes/BossScene.js
```

En cada archivo puedes cambiar:

- `platforms`: ubicación de plataformas;
- `coins`: ubicación de plumas doradas;
- `crystals`: cristales/vidas extras;
- `obstacles`: pinchos, fuego o trampas;
- `barrelSpawns`: enemigos que aparecen;
- `decorations`: ruinas, rocas, antorchas, símbolos y altar;
- `goal`: puerta o altar final del nivel.

## 5. Cómo ejecutar

Primero instala dependencias:

```bash
npm install
```

Luego ejecuta:

```bash
npm run dev
```

Abre el enlace que aparece en la terminal, normalmente:

```txt
http://localhost:5173
```

## 6. Si quieres verlo desde otra computadora

Conecta las computadoras a la misma red Wi-Fi. En la computadora donde corre el juego ejecuta:

```bash
npm run dev
```

Busca la IP de esa computadora con:

```bash
ipconfig
```

Luego desde la otra computadora abre:

```txt
http://IP_DE_TU_PC:5173
```

Ejemplo:

```txt
http://192.168.1.20:5173
```

## 7. Qué ya se mejoró en este ZIP

- Se reemplazaron los personajes base por el explorador andino.
- Se agregó sprite sheet de correr para el héroe.
- Se agregaron enemigos visuales: guardián de piedra, murciélago, cóndor y jefe final.
- Se rediseñaron los 3 niveles con temática progresiva: entrada, interior y cima.
- Se agregaron checkpoints, decoración andina, obstáculos, plumas doradas y portales.
- El jefe final ahora usa el asset de Kunturax y se derrota activando palancas.
