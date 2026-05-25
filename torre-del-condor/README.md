# La Torre del Cóndor

Juego 2D de plataformas verticales hecho con **JavaScript avanzado**, **Phaser.js** y **Vite**.
La idea es subir una torre, esquivar barriles, recoger monedas/cristales y derrotar al jefe final **Kunturax**.

Este ZIP fue reforzado para cumplir mejor la guía del proyecto: ahora incluye controles táctiles, selector de niveles, progreso guardado, botón visible de mute, estructura organizada y documentación de ejecución.

## Requisitos

- Node.js instalado
- Navegador web moderno
- VS Code recomendado

## Cómo ejecutar

Abre una terminal dentro de la carpeta del proyecto y ejecuta:

```bash
npm install
npm run dev
```

Luego abre el enlace que aparece en la terminal, normalmente:

```text
http://localhost:5173
```

## Controles de teclado

| Tecla | Acción |
|---|---|
| Flechas / A D | Moverse |
| Espacio | Saltar |
| W / Flecha arriba | Subir escaleras |
| S / Flecha abajo | Bajar escaleras |
| E | Interactuar con palancas del jefe |
| ESC | Pausar |
| M | Silenciar o activar música |

## Controles táctiles

El juego también trae botones dibujados con Phaser para probarlo en celular, tablet o con mouse:

- Izquierda / derecha
- Subir / bajar escaleras
- Saltar
- Interactuar en el jefe final
- Pausa
- Mute

## Funcionalidades incluidas

- Pantalla de carga
- Menú principal
- Historia inicial
- Selección de personaje
- Selección de nivel con niveles bloqueados/desbloqueados
- Ajustes de música, efectos, pantalla completa y reinicio de récord
- Pausa, continuar, reiniciar y volver al menú
- Tres niveles jugables
- Jefe final con palancas
- Barriles, monedas, cristales, trampas y plataformas
- Sistema de vidas, puntos y tiempo
- Progreso y récord guardados con `localStorage`
- Pantallas de Game Over, Victoria y Créditos
- Código modular con escenas, entidades, managers y utilidades

## Estructura del proyecto

```text
src/
├── assets/      # Carpeta reservada para imágenes/audio externos
├── audio/       # Documentación del sistema de audio
├── config/      # Configuración general del juego
├── entities/    # Player, Barrel y Boss
├── managers/    # SaveManager y AudioManager
├── objects/     # Carpeta de apoyo para estructura solicitada
├── physics/     # Documentación de físicas y colisiones
├── scenes/      # Menús, niveles, pausa, victoria, etc.
├── ui/          # Controles táctiles y botón mute
├── utils/       # Funciones reutilizables de interfaz
└── main.js
```

## Archivos principales modificados

- `src/ui/TouchControls.js`: controles táctiles reutilizables.
- `src/ui/MuteButton.js`: botón visible para activar/desactivar música.
- `src/scenes/LevelSelectScene.js`: selección de niveles con progreso.
- `src/scenes/MainMenuScene.js`: menú mejorado con Nueva partida y Seleccionar nivel.
- `src/scenes/BaseLevelScene.js`: integración de controles táctiles y mute en niveles.
- `src/scenes/BossScene.js`: integración de controles táctiles, interactuar y mute.
- `src/entities/Player.js`: soporte de teclado + controles táctiles.

## Nota sobre assets

Los sprites y gráficos principales se generan por código desde `PreloadScene.js`, por eso el juego puede ejecutarse sin imágenes externas.
Si el profesor exige archivos de assets reales, se pueden agregar imágenes en `src/assets/images` y audio en `src/assets/audio`, y luego cargarlos desde `PreloadScene.js`.

## Mejoras agregadas: Torre del Cóndor andina

Este paquete incluye una versión más completa del juego con personajes reales, enemigos temáticos y escenarios progresivos:

1. Nivel 1: Entrada de la Torre, con montañas, ruinas y guardianes de piedra.
2. Nivel 2: Interior de la Torre, con piedra, antorchas, símbolos y murciélagos.
3. Nivel 3: Cima del Cóndor, con altar, cielo dramático y enemigos voladores.
4. Jefe final: Kunturax, derrotado al activar tres palancas sagradas.

Para saber exactamente dónde colocar nuevas imágenes y cómo editar cada nivel, revisa el archivo `GUIA_ESCENARIOS_Y_ASSETS.md`.
