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
    subtitle: 'Equilibrado',
    description: 'Ideal para aprender la torre.',
    speed: 235,
    jump: 455,
    tint: 0xffffff,
  },
  killa: {
    id: 'killa',
    name: 'Killa',
    subtitle: 'Más rápida',
    description: 'Buena para esquivar murciélagos.',
    speed: 270,
    jump: 430,
    tint: 0xffe6a7,
  },
  rumi: {
    id: 'rumi',
    name: 'Rumi',
    subtitle: 'Salto alto',
    description: 'Útil para plataformas altas.',
    speed: 215,
    jump: 500,
    tint: 0xc7f9ff,
  },
};

export const LEVELS = [
  { id: 1, name: 'Nivel 1: Entrada de la torre', bg: 'fondo_nivel1', enemies: ['guardian'], time: 160 },
  { id: 2, name: 'Nivel 2: Cámara de antorchas', bg: 'fondo_nivel2', enemies: ['bat', 'guardian'], time: 170 },
  { id: 3, name: 'Nivel 3: Cima del cóndor', bg: 'fondo_nivel3', enemies: ['bat', 'condor'], time: 180 },
  { id: 4, name: 'Boss final: Kunturax', bg: 'fondo_boss', enemies: ['boss'], time: 210 },
];

export const SAVE_KEY = 'torre-condor-save-slots-v2';
export const SETTINGS_KEY = 'torre-condor-settings-v2';
export const LEADERBOARD_KEY = 'torre-condor-leaderboard-v2';
