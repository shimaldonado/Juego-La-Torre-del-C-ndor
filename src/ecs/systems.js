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

    const minX = Number.isFinite(patrol.minX) ? patrol.minX : 0;
    const maxX = Number.isFinite(patrol.maxX) ? patrol.maxX : scene.worldWidth;

    // Seguridad: si un guardián se sale de su plataforma o cae por empuje/colisión,
    // regresa a su zona de patrulla para que no desaparezca del nivel.
    if (sprite.y > (scene.worldHeight || 720) + 70) {
      const spawnX = sprite.getData?.('spawnX') ?? Phaser.Math.Clamp(sprite.x, minX + 20, maxX - 20);
      const spawnY = sprite.getData?.('spawnY') ?? sprite.y;
      sprite.setPosition(Phaser.Math.Clamp(spawnX, minX + 20, maxX - 20), spawnY);
      sprite.setVelocity(0, 0);
      patrol.direction = sprite.x < (minX + maxX) / 2 ? 1 : -1;
    }

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

    const targetInsidePatrolLane = target.sprite.x >= minX - 35 && target.sprite.x <= maxX + 35;
    const canChase = bestDistance < ai.detectionRadius && targetInsidePatrolLane;

    if (canChase) {
      const direction = Math.sign(target.sprite.x - sprite.x) || patrol.direction || 1;
      sprite.setVelocityX(direction * ai.chaseSpeed);
      patrol.direction = direction;
    } else {
      if (sprite.x <= minX + 8) patrol.direction = 1;
      if (sprite.x >= maxX - 8) patrol.direction = -1;
      sprite.setVelocityX((patrol.direction || 1) * patrol.speed);
    }

    // Nunca permitas que el enemigo se vaya más allá de su plataforma.
    if (sprite.x <= minX) {
      sprite.x = minX;
      patrol.direction = 1;
      sprite.setVelocityX(Math.abs(patrol.speed));
    } else if (sprite.x >= maxX) {
      sprite.x = maxX;
      patrol.direction = -1;
      sprite.setVelocityX(-Math.abs(patrol.speed));
    }

    if (sprite.body?.velocity?.x) sprite.setFlipX(sprite.body.velocity.x < 0);
  }
}
