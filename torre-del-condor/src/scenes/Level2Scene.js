import { BaseLevelScene } from './BaseLevelScene.js';

const platforms = [
  { x: 480, y: 1970, width: 960 },
  { x: 180, y: 1830, width: 230 },
  { x: 520, y: 1705, width: 260 },
  { x: 820, y: 1585, width: 240 },
  { x: 545, y: 1465, width: 250 },
  { x: 245, y: 1345, width: 240 },
  { x: 650, y: 1228, width: 260 },
  { x: 430, y: 1098, width: 230 },
  { x: 820, y: 975, width: 230 },
  { x: 560, y: 850, width: 250 },
  { x: 220, y: 730, width: 250 },
  { x: 590, y: 610, width: 240 },
  { x: 820, y: 490, width: 230 },
  { x: 500, y: 360, width: 300 },
  { x: 180, y: 240, width: 240 }
];

export class Level2Scene extends BaseLevelScene {
  constructor() {
    super('Level2Scene', {
      title: 'Nivel 2: Interior de la Torre',
      theme: 'interior',
      backgroundKey: 'bg-level2',
      cameraColor: '#0b1020',
      worldHeight: 2050,
      timeLimit: 170,
      spawn: { x: 90, y: 1880 },
      platforms,
      platformKey: 'platform-stone',
      collectibleKey: 'feather',
      ladders: [
        { x: 320, y: 1768, height: 140 },
        { x: 705, y: 1528, height: 135 },
        { x: 245, y: 1285, height: 130 },
        { x: 770, y: 914, height: 140 },
        { x: 415, y: 670, height: 130 },
        { x: 650, y: 425, height: 135 }
      ],
      coins: [
        { x: 180, y: 1780 }, { x: 520, y: 1655 }, { x: 820, y: 1535 },
        { x: 545, y: 1415 }, { x: 245, y: 1295 }, { x: 650, y: 1178 },
        { x: 430, y: 1048 }, { x: 820, y: 925 }, { x: 560, y: 800 },
        { x: 220, y: 680 }, { x: 590, y: 560 }, { x: 820, y: 440 }, { x: 500, y: 310 }
      ],
      crystals: [{ x: 180, y: 194, scale: 0.8 }, { x: 820, y: 438, scale: 0.65 }],
      checkpoints: [{ x: 430, y: 1048 }],
      obstacles: [
        { x: 390, y: 1943, type: 'spike-long', scale: 0.85 },
        { x: 630, y: 1943, type: 'spike-long', scale: 0.85 },
        { x: 535, y: 1440, type: 'fire', scale: 0.7 },
        { x: 325, y: 1320, type: 'spikes', scale: 0.8 },
        { x: 665, y: 825, type: 'fire', scale: 0.75 },
        { x: 720, y: 585, type: 'spikes', scale: 0.78 }
      ],
      decorations: [
        { type: 'torch', x: 95, y: 1864, scale: 0.85 },
        { type: 'torch', x: 890, y: 1560, scale: 0.85 },
        { type: 'torch', x: 325, y: 1320, scale: 0.75 },
        { type: 'torch', x: 890, y: 465, scale: 0.75 },
        { type: 'symbol', x: 480, y: 1560, scale: 1.2 },
        { type: 'symbol', x: 160, y: 940, scale: 1.0 },
        { type: 'symbol', x: 810, y: 710, scale: 1.0 }
      ],
      goal: { x: 180, y: 164 },
      goalLabel: 'SUBIR',
      goalScale: 1,
      enemyTexture: 'enemy-bat',
      enemyKind: 'flying',
      enemyAnimation: 'enemy-bat-fly-anim',
      enemyScale: 0.16,
      enemyBodyWidth: 48,
      enemyBodyHeight: 34,
      barrelDelay: 3300,
      barrelSpeed: 145,
      barrelSpawns: [
        { x: 860, y: 1510, texture: 'enemy-bat', kind: 'flying', animation: 'enemy-bat-fly-anim', scale: 0.16, speed: 135, bodyWidth: 90, bodyHeight: 120 },
        { x: 90, y: 1190, texture: 'enemy-bat', kind: 'flying', animation: 'enemy-bat-fly-anim', scale: 0.16, speed: 150, bodyWidth: 90, bodyHeight: 120 },
        { x: 880, y: 780, texture: 'enemy-bat', kind: 'flying', animation: 'enemy-bat-fly-anim', scale: 0.16, speed: 150, bodyWidth: 90, bodyHeight: 120 },
        { x: 110, y: 520, texture: 'enemy-bat', kind: 'flying', animation: 'enemy-bat-fly-anim', scale: 0.15, speed: 165, bodyWidth: 90, bodyHeight: 120 }
      ],
      unlocks: 3,
      nextScene: 'Level3Scene'
    });
  }
}
