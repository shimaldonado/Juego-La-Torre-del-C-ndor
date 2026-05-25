export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const COLORS = {
  backgroundTop: 0x10182f,
  backgroundBottom: 0x2c1744,
  gold: 0xffc857,
  danger: 0xff4d4d,
  success: 0x63d471,
  sky: 0x4ecdc4,
  text: '#fff3c4',
  darkText: '#1d1d2c'
};

export const PLAYER_STATS = {
  inti: {
    label: 'Auki',
    texture: 'hero-idle',
    runTexture: 'hero-run',
    runAnimation: 'hero-run-anim',
    speed: 220,
    jump: 480,
    scale: 0.55,
    actionScale: 0.13,
    previewScale: 0.72,
    body: { width: 34, height: 72, offsetX: 47, offsetY: 63 },
    description: 'Equilibrado: ideal para aprender la entrada de la torre.'
  },
  quilla: {
    label: 'Killa',
    texture: 'hero-idle',
    runTexture: 'hero-run',
    runAnimation: 'hero-run-anim',
    speed: 250,
    jump: 455,
    scale: 0.55,
    actionScale: 0.13,
    previewScale: 0.72,
    tint: 0xdbeafe,
    body: { width: 34, height: 72, offsetX: 47, offsetY: 63 },
    description: 'Más rápida: buena para esquivar murciélagos y trampas.'
  },
  rumi: {
    label: 'Rumi',
    texture: 'hero-idle',
    runTexture: 'hero-run',
    runAnimation: 'hero-run-anim',
    speed: 190,
    jump: 520,
    scale: 0.55,
    actionScale: 0.13,
    previewScale: 0.72,
    tint: 0xfff3c4,
    body: { width: 34, height: 72, offsetX: 47, offsetY: 63 },
    description: 'Salto alto: útil para plataformas internas y cima.'
  }
};

export const DEFAULT_SAVE = {
  selectedCharacter: 'inti',
  bestScore: 0,
  musicEnabled: true,
  sfxEnabled: true,
  musicVolume: 0.25,
  sfxVolume: 0.6,
  unlockedLevel: 1
};
