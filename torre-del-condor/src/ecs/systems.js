import Phaser from 'phaser';
import { Components } from './components.js';

export function runPatrolAndAISystem(scene, ecs, players = []) {
  const alivePlayers = players.filter((p) => p?.active && p?.sprite?.active);

  for (const { comps } of ecs.query(Components.Sprite, Components.Patrol, Components.EnemyAI, Components.Health)) {
    const sprite = comps.get(Components.Sprite);
    const patrol = comps.get(Components.Patrol);
    const ai = comps.get(Components.EnemyAI);
    const health = comps.get(Components.Health);
    if (!sprite?.active || health.hp <= 0) continue;

    if (!alivePlayers.length) {
      sprite.setVelocityX(0);
      continue;
    }

    let target = alivePlayers[0];
    let bestDistance = Phaser.Math.Distance.Between(sprite.x, sprite.y, target.sprite.x, target.sprite.y);
    alivePlayers.slice(1).forEach((candidate) => {
      const d = Phaser.Math.Distance.Between(sprite.x, sprite.y, candidate.sprite.x, candidate.sprite.y);
      if (d < bestDistance) { target = candidate; bestDistance = d; }
    });

    if (bestDistance < ai.detectionRadius) {
      const direction = Math.sign(target.sprite.x - sprite.x) || patrol.direction || 1;
      sprite.setVelocityX(direction * ai.chaseSpeed);
    } else {
      if (sprite.x <= patrol.minX) patrol.direction = 1;
      if (sprite.x >= patrol.maxX) patrol.direction = -1;
      sprite.setVelocityX(patrol.direction * patrol.speed);
    }

    if (sprite.body?.velocity?.x) sprite.setFlipX(sprite.body.velocity.x < 0);
  }
}
