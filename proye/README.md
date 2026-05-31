# La Torre del Cóndor

Videojuego 2D de aventura andina desarrollado con **Phaser 3 + Vite**. El jugador debe subir una torre ancestral, recolectar plumas y cristales, evitar trampas, superar enemigos y derrotar al boss final **Kunturax**.

## Características incluidas

- Menú inicial dinámico y visual andino.
- Selección de personaje.
- Historia inicial por escenas con sprites antes de iniciar una nueva partida.
- 3 niveles jugables + boss final.
- Multiplayer local simple: P1 y P2 en el mismo teclado.
- PWA instalable con `manifest.webmanifest` y `sw.js`.
- IA de enemigos con patrullaje y persecución.
- Diseño determinístico de niveles mediante planes de plataformas, enemigos, objetos y peligros.
- Efectos visuales tipo shader/PostFX cuando el navegador lo permite.
- Minimap en pantalla.
- Inventario de plumas y cristales.
- Arquitectura ECS simple para enemigos y componentes.
- Integración con API externa para mensaje informativo.
- Assets de imágenes corregidos para evitar cuadros/fondos raros.
- Nuevos efectos visuales de ataque para el héroe y el boss Kunturax.
- Sonidos integrados: salto, moneda, golpe, checkpoint, victoria y música.

## Persistencia local

El juego usa localStorage para guardar:

- High Score.
- Nivel máximo alcanzado.
- Último puntaje.
- Configuración de audio mediante SettingsManager.

La información puede revisarse en el navegador desde:

DevTools > Application > Local Storage.

## PWA

El juego incluye:

- manifest.webmanifest
- service worker
- íconos 192x192 y 512x512
- botón de instalación cuando el navegador lo permite


## Controles

| Acción | Jugador 1 | Jugador 2 |
|---|---|---|
| Moverse | A / D | Flechas izquierda / derecha |
| Subir o bajar escalera | W / S | Flechas arriba / abajo |
| Saltar | Espacio | Shift |
| Atacar / interactuar | E | Enter |
| Inventario | I | I |
| Pausa | ESC o P | ESC o P |
| Silenciar sonido | M | M |

## Instalación

```bash
npm install
npm run dev
```

Luego abre:

```text
http://localhost:5173
```

Para compilar:

```bash
npm run build
npm run preview
```

## Estructura principal

```text
public/
  assets/
    audio/              música y efectos del juego
    images/             fondos, sprites, íconos y objetos
  manifest.webmanifest  configuración para instalar como PWA
  sw.js                 service worker para cache básico

src/
  config/               constantes, niveles y configuración general
  ecs/                  sistema ECS simple para entidades/componentes
  managers/             audio, almacenamiento, configuración y API externa
  scenes/               escenas de Phaser: menú, preload, juego, pausa, etc.
  ui/                   funciones reutilizables para botones, títulos y fondos
  styles/               estilos globales del canvas y la página
  main.js               punto de entrada del juego
```

> Nota: Los assets están en `public/assets` porque Vite los sirve directamente al navegador. Esto facilita que Phaser cargue imágenes y audios con rutas públicas como `/assets/images/...` y `/assets/audio/...`.

## Requisitos académicos cubiertos

- **Modularidad:** el proyecto está separado en escenas, managers, configuración, UI y ECS.
- **Reutilización:** `uiHelpers.js`, `AudioManager`, `StorageManager` y `SettingsManager` se reutilizan en varias escenas.
- **Separación de responsabilidades:** las escenas controlan pantallas del juego, los managers manejan servicios comunes y `config` centraliza datos constantes.
- **Buenas prácticas:** se usan módulos ES, clases, nombres descriptivos e imports claros.
- **Comentarios explicativos:** las escenas principales incluyen comentarios para entender carga de assets, HUD, controles, enemigos y lógica de juego.
- **Organización clara:** la estructura está preparada para mantenimiento y crecimiento del proyecto.

## Rendimiento

El juego está pensado para ejecutarse de forma fluida en navegador:

- Usa **Arcade Physics** de Phaser, adecuado para juegos 2D de plataformas.
- El modo debug de físicas debe mantenerse desactivado para la entrega.
- Los assets se cargan desde `PreloadScene`, evitando cargas improvisadas durante el gameplay.
- Los controles táctiles y el HUD usan elementos simples de Phaser para reducir sobrecarga.
- Se recomienda probar con DevTools cerrado y entregar el ZIP sin `node_modules`.

Para mejorar todavía más el rendimiento, se pueden comprimir los fondos PNG y reducir el peso de la música de boss si el equipo lo considera necesario.
