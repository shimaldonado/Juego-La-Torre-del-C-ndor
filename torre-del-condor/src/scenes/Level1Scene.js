import { BaseLevelScene } from './BaseLevelScene.js';

const platforms = [
  { x: 480, y: 1765, width: 960 },
  { x: 250, y: 1620, width: 300 },
  { x: 720, y: 1490, width: 300 },
  { x: 430, y: 1360, width: 260 },
  { x: 170, y: 1225, width: 260 },
  { x: 590, y: 1110, width: 320 },
  { x: 810, y: 980, width: 220 },
  { x: 480, y: 850, width: 300 },
  { x: 175, y: 725, width: 260 },
  { x: 620, y: 610, width: 300 },
  { x: 820, y: 480, width: 210 },
  { x: 485, y: 360, width: 320 },
  { x: 250, y: 240, width: 260 }
];

export class Level1Scene extends BaseLevelScene {
  constructor() {
    super('Level1Scene', {
      title: 'Nivel 1: Entrada de la Torre',
      theme: 'entrada',
      backgroundKey: 'bg-level1',
      cameraColor: '#16213e',
      worldHeight: 1850,
      timeLimit: 150,
      spawn: { x: 90, y: 1680 },
      platforms,
      platformKey: 'platform-stone',
      collectibleKey: 'feather',
      ladders: [
        { x: 430, y: 1548, height: 145 },
        { x: 195, y: 1290, height: 145 },
        { x: 620, y: 1045, height: 145 },
        { x: 500, y: 780, height: 150 },
        { x: 790, y: 545, height: 140 }
      ],
      coins: [
        { x: 250, y: 1570 }, { x: 720, y: 1440 }, { x: 430, y: 1310 },
        { x: 170, y: 1175 }, { x: 590, y: 1060 }, { x: 810, y: 930 },
        { x: 480, y: 800 }, { x: 175, y: 675 }, { x: 620, y: 560 },
        { x: 820, y: 430 }, { x: 485, y: 310 }
      ],
      crystals: [{ x: 250, y: 194, scale: 0.78 }],
      checkpoints: [{ x: 500, y: 795 }],
      obstacles: [
        { x: 500, y: 1738, type: 'spikes', scale: 1.1 },
        { x: 660, y: 1738, type: 'spikes', scale: 1.1 },
        { x: 330, y: 1332, type: 'spike-long', scale: 0.8 },
        { x: 705, y: 582, type: 'spikes', scale: 0.8 }
      ],
      decorations: [
        { type: 'ruin', x: 145, y: 1710, scale: 1.1 },
        { type: 'ruin', x: 850, y: 1710, scale: 0.95 },
        { type: 'rock', x: 780, y: 1728, scale: 1.25 },
        { type: 'symbol', x: 735, y: 1395, scale: 1.1 },
        { type: 'torch', x: 235, y: 1186, scale: 0.8 },
        { type: 'torch', x: 543, y: 320, scale: 0.8 }
      ],
      goal: { x: 250, y: 164 },
      goalLabel: 'ENTRAR',
      goalScale: 1,
      enemyTexture: 'enemy-golem',
      enemyKind: 'walker',
      enemyAnimation: 'enemy-golem-walk-anim',
      enemyScale: 0.18,
      enemyBodyWidth: 58,
      enemyBodyHeight: 58,
      barrelDelay: 4400,
      barrelSpeed: 100,
      barrelSpawns: [
        { x: 840, y: 1430, texture: 'enemy-golem', kind: 'walker', animation: 'enemy-golem-walk-anim', scale: 0.18, speed: 95, bodyWidth: 100, bodyHeight: 260 },
        { x: 200, y: 1160, texture: 'enemy-golem', kind: 'walker', animation: 'enemy-golem-walk-anim', scale: 0.18, speed: 110, bodyWidth: 100, bodyHeight: 260 },
        { x: 650, y: 560, texture: 'enemy-golem', kind: 'walker', animation: 'enemy-golem-walk-anim', scale: 0.17, speed: 105, bodyWidth: 100, bodyHeight: 260 }
      ],
      unlocks: 2,
      nextScene: 'Level2Scene'
    });
  }
}
