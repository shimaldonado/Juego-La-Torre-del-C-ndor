# La Torre del Cóndor

Videojuego 2D de aventura andina desarrollado con **Phaser 3 + Vite**. El jugador debe subir una torre ancestral, recolectar plumas y cristales, evitar trampas, superar enemigos y derrotar al boss final **Kunturax**.

## Características incluidas

- Menú inicial dinámico y visual andino.
- Selección de personaje.
- 3 niveles jugables + boss final.
- Multiplayer local simple: P1 y P2 en el mismo teclado.
- Leaderboard local y simulación online con API externa.
- PWA instalable con `manifest.webmanifest` y `sw.js`.
- IA de enemigos con patrullaje y persecución.
- Generación procedural determinística de plataformas, objetos y enemigos.
- Efectos visuales tipo shader/PostFX cuando el navegador lo permite.
- Minimap en pantalla.
- Inventario de plumas y cristales.
- Guardado múltiple en 3 ranuras usando `localStorage`.
- Arquitectura ECS simple para enemigos y componentes.
- Integración con API externa para mensaje informativo y leaderboard.
- Assets de imágenes corregidos para evitar cuadros/fondos raros.
- Sonidos integrados: salto, moneda, golpe, checkpoint, victoria y música.

## Controles

| Acción | Jugador 1 | Jugador 2 |
|---|---|---|
| Moverse | A / D | Flechas izquierda / derecha |
| Subir o bajar escalera | W / S | Flechas arriba / abajo |
| Saltar | Espacio | Enter |
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
    audio/
    images/
  manifest.webmanifest
  sw.js
src/
  config/
  ecs/
  managers/
  scenes/
  main.js
```

## Notas para subir a GitHub

No subas `node_modules`. Ya está ignorado en `.gitignore`. Para subir cambios:

```bash
git add .
git commit -m "Mejora juego La Torre del Condor"
git push origin main
```
