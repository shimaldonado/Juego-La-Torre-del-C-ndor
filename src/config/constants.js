export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const COLORS = {
  navy: 0x111827,
  night: 0x1f1235,
  purple: 0x3b1973,
  gold: 0xffcc5c,
  goldDark: 0xb7832f,
  cream: 0xfff3bf,
  danger: 0xef4444,
  green: 0x22c55e,
  cyan: 0x67e8f9,
  stone: 0x4b5563,
};

export const CHARACTERS = {
  auki: {
    id: 'auki',
    name: 'Auki',
    subtitle: 'Equilibrado · Poder: Remolino Dorado',
    description: 'Ideal para aprender la torre.',
    speed: 235,
    jump: 455,
    tint: 0xffffff,
    powerName: '🌀 Remolino Dorado',
    powerDesc: 'Lanza un proyectil dorado hacia adelante',
    powerKey: 'Q',
  },
  killa: {
    id: 'killa',
    name: 'Killa',
    subtitle: 'Más rápida · Poder: Zorro lunar',
    description: 'Su zorro mascota ataca a todos los enemigos cercanos.',
    speed: 270,
    jump: 430,
    tint: 0xffe6a7,
    powerName: '🦊 Zorro Lunar',
    powerDesc: 'El zorro ataca en área (radio 220px)',
    powerKey: 'Q',
  },
  rumi: {
    id: 'rumi',
    name: 'Rumi',
    subtitle: 'Salto alto · Poder: Puño de piedra',
    description: 'Golpe de tierra que aturde a todos los enemigos.',
    speed: 215,
    jump: 500,
    tint: 0xc7f9ff,
    powerName: '🪨 Puño de Piedra',
    powerDesc: 'Golpe de tierra en área + 2s de escudo',
    powerKey: 'Q',
  },
};

export const LEVELS = [
  { id: 1, name: 'Nivel 1: Entrada de la torre', bg: 'fondo_nivel1', enemies: ['guardian'], time: 160 },
  { id: 2, name: 'Nivel 2: Cámara de antorchas', bg: 'fondo_nivel2', enemies: ['bat', 'guardian'], time: 170 },
  { id: 3, name: 'Nivel 3: Cima del cóndor', bg: 'fondo_nivel3', enemies: ['bat', 'condor'], time: 180 },
  { id: 4, name: 'Boss final: Kunturax', bg: 'fondo_boss', enemies: ['boss'], time: 210 },
];

export const STORY = {
  title: 'El Corazón de la Torre',
  premise: [
    'Hace siglos, la Torre del Cóndor guardaba una llama dorada que protegía los valles.',
    'Kunturax, un espíritu de sombra, encerró esa llama detrás de puertas vivas y despertó guardianes de piedra.',
    'Auki, Killa y Rumi suben la torre para reunir plumas, cristales y placas sagradas antes de enfrentar al espíritu final.',
  ],
  chapters: [
    {
      visual: 'flame',
      text: 'En el valle de Qhapaq ardía el Corazón Solar, una llama que mantenía despiertos los ríos, las cosechas y el vuelo del cóndor.',
    },
    {
      visual: 'shadow',
      text: 'Una noche, Kunturax bajó desde la cima. Robó la llama, cerró las puertas vivas de la torre y sembró guardianes de piedra en cada sala.',
    },
    {
      visual: 'heroes',
      text: 'Auki, Killa y Rumi escucharon el llamado. Para subir deberán reunir plumas, cristales y placas sagradas sin caer ante las sombras.',
    },
    {
      visual: 'attack',
      text: 'Cada puerta se abrirá solo cuando los monstruos sean vencidos. Arriba espera Kunturax, y el primer golpe de luz ya está listo.',
    },
  ],
  levelBriefings: {
    1: 'La entrada está sellada. Derrota guardianes hasta que la puerta reconozca tu valor.',
    2: 'Las antorchas ocultan murciélagos y trampas. Avanza sin perder las placas del cóndor.',
    3: 'En la cima sopla el viento antiguo. Los cóndores de sombra protegen el último sello.',
    4: 'Kunturax despertó. Golpea entre sus ataques y libera la llama dorada de la torre.',
  },
  victory: 'La llama vuelve a encenderse sobre los Andes. La torre queda libre y tu nombre entra en la memoria del cóndor.',
};

export const SETTINGS_KEY = 'torre-condor-settings-v2';
