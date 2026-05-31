import Phaser from 'phaser';
import { Components } from './components.js';

export function runPatrolAndAISystem(scene, ecs, players) {
  const mainPlayer = players.find((p) => p.active) || players[0];
  for (const { comps } of ecs.query(Components.Sprite, Components.Patrol, Components.EnemyAI, Components.Health)) {
    const sprite = comps.get(Components.Sprite);
    const patrol = comps.get(Components.Patrol);
    const ai = comps.get(Components.EnemyAI);
    const health = comps.get(Components.Health);
    if (!sprite?.active || health.hp <= 0) continue;

    const distance = Phaser.Math.Distance.Between(sprite.x, sprite.y, mainPlayer.sprite.x, mainPlayer.sprite.y);
    if (distance < ai.detectionRadius) {
      const direction = Math.sign(mainPlayer.sprite.x - sprite.x) || 1;
      sprite.setVelocityX(direction * ai.chaseSpeed);
    } else {
      if (sprite.x <= patrol.minX) patrol.direction = 1;
      if (sprite.x >= patrol.maxX) patrol.direction = -1;
      sprite.setVelocityX(patrol.direction * patrol.speed);
    }
    if (sprite.body?.velocity?.x) sprite.setFlipX(sprite.body.velocity.x < 0);
  }
}
