import { BaseLevelScene } from './BaseLevelScene.js';

const platforms = [
  { x: 480, y: 1885, width: 960 },
  { x: 745, y: 1745, width: 260 },
  { x: 430, y: 1620, width: 250 },
  { x: 160, y: 1495, width: 220 },
  { x: 520, y: 1370, width: 250 },
  { x: 820, y: 1242, width: 225 },
  { x: 610, y: 1115, width: 245 },
  { x: 310, y: 990, width: 230 },
  { x: 115, y: 865, width: 210 },
  { x: 465, y: 745, width: 260 },
  { x: 780, y: 620, width: 230 },
  { x: 530, y: 500, width: 240 },
  { x: 250, y: 380, width: 230 },
  { x: 500, y: 245, width: 360 }
];

export class Level3Scene extends BaseLevelScene {
  constructor() {
    super('Level3Scene', {
      title: 'Nivel 3: Cima del Cóndor',
      theme: 'cima',
      backgroundKey: 'bg-level3',
      cameraColor: '#0f172a',
      worldHeight: 1960,
      timeLimit: 180,
      spawn: { x: 85, y: 1795 },
      platforms,
      platformKey: 'platform-stone',
      collectibleKey: 'feather',
      ladders: [
        { x: 610, y: 1680, height: 135 },
        { x: 300, y: 1558, height: 130 },
        { x: 680, y: 1180, height: 140 },
        { x: 230, y: 925, height: 145 },
        { x: 650, y: 560, height: 135 },
        { x: 380, y: 315, height: 125 }
      ],
      coins: [
        { x: 745, y: 1695 }, { x: 430, y: 1570 }, { x: 160, y: 1445 },
        { x: 520, y: 1320 }, { x: 820, y: 1192 }, { x: 610, y: 1065 },
        { x: 310, y: 940 }, { x: 115, y: 815 }, { x: 465, y: 695 },
        { x: 780, y: 570 }, { x: 530, y: 450 }, { x: 250, y: 330 },
        { x: 500, y: 195 }
      ],
      crystals: [{ x: 840, y: 1190, scale: 0.65 }, { x: 500, y: 190, scale: 0.8 }],
      checkpoints: [{ x: 310, y: 940 }],
      obstacles: [
        { x: 485, y: 1860, type: 'spike-long', scale: 0.9 },
        { x: 320, y: 1362, type: 'spikes', scale: 0.86 },
        { x: 705, y: 1215, type: 'fire', scale: 0.72 },
        { x: 550, y: 718, type: 'spikes', scale: 0.76 },
        { x: 330, y: 355, type: 'fire', scale: 0.76 }
      ],
      decorations: [
        { type: 'altar', x: 500, y: 206, scale: 1.0 },
        { type: 'symbol', x: 480, y: 1520, scale: 1.2 },
        { type: 'symbol', x: 830, y: 1090, scale: 1.0 },
        { type: 'rock', x: 850, y: 1845, scale: 1.35 },
        { type: 'torch', x: 570, y: 215, scale: 0.75 },
        { type: 'torch', x: 430, y: 215, scale: 0.75 }
      ],
      goal: { x: 500, y: 155 },
      goalLabel: 'ALTAR',
      goalScale: 1,
      enemyTexture: 'enemy-condor',
      enemyKind: 'flying',
      enemyAnimation: 'enemy-condor-fly-anim',
      enemyScale: 0.18,
      enemyBodyWidth: 54,
      enemyBodyHeight: 42,
      barrelDelay: 2800,
      barrelSpeed: 165,
      barrelSpawns: [
        { x: 860, y: 1710, texture: 'enemy-condor', kind: 'flying', animation: 'enemy-condor-fly-anim', scale: 0.18, speed: 150, bodyWidth: 100, bodyHeight: 140 },
        { x: 90, y: 1280, texture: 'enemy-condor', kind: 'flying', animation: 'enemy-condor-fly-anim', scale: 0.18, speed: 165, bodyWidth: 100, bodyHeight: 140 },
        { x: 880, y: 885, texture: 'enemy-condor', kind: 'flying', animation: 'enemy-condor-fly-anim', scale: 0.18, speed: 170, bodyWidth: 100, bodyHeight: 140 },
        { x: 110, y: 485, texture: 'enemy-bat', kind: 'flying', animation: 'enemy-bat-fly-anim', scale: 0.15, speed: 170, bodyWidth: 90, bodyHeight: 120 }
      ],
      unlocks: 4,
      nextScene: 'BossScene'
    });
  }
}
