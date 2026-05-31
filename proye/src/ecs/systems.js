import Phaser from 'phaser';
import { Components } from './components.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function runPatrolAndAISystem(scene, ecs, players = []) {
  const alivePlayers = players.filter((p) => p?.active && p?.sprite?.active);
  const now = scene.time.now;

  for (const { comps } of ecs.query(Components.Sprite, Components.Patrol, Components.EnemyAI, Components.Health)) {
    const sprite = comps.get(Components.Sprite);
    const patrol = comps.get(Components.Patrol);
    const ai = comps.get(Components.EnemyAI);
    const health = comps.get(Components.Health);
    if (!sprite?.active || health.hp <= 0 || sprite.getData?.('defeated')) continue;

    // Evita el temblor visual justo después de recibir daño.
    if (now < Number(sprite.getData?.('hitstunUntil') || 0)) continue;

    const isFlying = sprite.getData?.('flying') === true || sprite.body?.allowGravity === false;
    const minX = Number.isFinite(patrol.minX) ? patrol.minX : 0;
    const maxX = Number.isFinite(patrol.maxX) ? patrol.maxX : scene.worldWidth;

    // Seguridad: si un guardián terrestre se sale de su plataforma o cae por empuje,
    // regresa a su zona de patrulla para que no desaparezca del nivel.
    if (!isFlying && sprite.y > (scene.worldHeight || 720) + 70) {
      const spawnX = sprite.getData?.('spawnX') ?? Phaser.Math.Clamp(sprite.x, minX + 20, maxX - 20);
      const spawnY = sprite.getData?.('spawnY') ?? sprite.y;
      sprite.setPosition(Phaser.Math.Clamp(spawnX, minX + 20, maxX - 20), spawnY);
      sprite.setVelocity(0, 0);
      patrol.direction = sprite.x < (minX + maxX) / 2 ? 1 : -1;
    }

    if (isFlying && sprite.body) {
      sprite.body.allowGravity = false;
      const originY = Number(sprite.getData?.('originY') || sprite.y);
      const hoverY = originY + Math.sin(now / 420 + sprite.x * 0.015) * 10;
      sprite.y = Phaser.Math.Linear(sprite.y, hoverY, 0.08);
      sprite.setVelocityY(0);
    }

    if (!alivePlayers.length) {
      sprite.setVelocityX(0);
      continue;
    }

    let target = alivePlayers[0];
    let bestDistance = Phaser.Math.Distance.Between(sprite.x, sprite.y, target.sprite.x, target.sprite.y);
    alivePlayers.slice(1).forEach((candidate) => {
      const d = Phaser.Math.Distance.Between(sprite.x, sprite.y, candidate.sprite.x, candidate.sprite.y);
      if (d < bestDistance) {
        target = candidate;
        bestDistance = d;
      }
    });

    const dx = target.sprite.x - sprite.x;
    const dy = target.sprite.y - sprite.y;
    const detection = isFlying ? Math.max(ai.detectionRadius, 330) : ai.detectionRadius;
    const verticalTolerance = isFlying ? 190 : 95;
    const targetInsidePatrolLane = target.sprite.x >= minX - 90 && target.sprite.x <= maxX + 90;
    const targetInSameLane = Math.abs(dy) <= verticalTolerance;
    const canChase = bestDistance < detection && targetInsidePatrolLane && targetInSameLane;
    const attackRange = isFlying ? 92 : 74;
    const attackVerticalTolerance = isFlying ? 145 : 82;
    const canAttack = bestDistance < attackRange && targetInsidePatrolLane && Math.abs(dy) <= attackVerticalTolerance;
    sprite.setData?.('attacking', canAttack);

    if (canAttack) {
      // Cuando está atacando no lo dejamos oscilar izquierda/derecha,
      // que era una causa del temblor cuando el jugador estaba arriba o abajo.
      sprite.setVelocityX(0);
      if (Math.abs(dx) > 6) patrol.direction = Math.sign(dx) || patrol.direction || 1;
    } else if (canChase) {
      if (Math.abs(dx) < 20) {
        sprite.setVelocityX(0);
      } else {
        const speed = isFlying ? Math.max(ai.chaseSpeed, patrol.speed * 1.15) : ai.chaseSpeed;
        const direction = Math.sign(dx) || patrol.direction || 1;
        sprite.setVelocityX(direction * speed);
        patrol.direction = direction;
      }
    } else {
      if (sprite.x <= minX + 8) patrol.direction = 1;
      if (sprite.x >= maxX - 8) patrol.direction = -1;
      sprite.setVelocityX((patrol.direction || 1) * patrol.speed);
    }

    // Nunca permitas que el enemigo se vaya demasiado más allá de su plataforma.
    if (sprite.x <= minX - 35) {
      sprite.x = minX - 35;
      patrol.direction = 1;
      sprite.setVelocityX(Math.abs(patrol.speed));
    } else if (sprite.x >= maxX + 35) {
      sprite.x = maxX + 35;
      patrol.direction = -1;
      sprite.setVelocityX(-Math.abs(patrol.speed));
    }

    const vx = sprite.body?.velocity?.x || 0;
    if (Math.abs(vx) > 3) sprite.setFlipX(vx < 0);
    else if (Math.abs(dx) > 6) sprite.setFlipX(dx < 0);

    const attackAnim = sprite.getData?.('attackAnim');
    const walkAnim = sprite.getData?.('walkAnim');
    if (sprite.getData?.('attacking') && attackAnim && scene.anims?.exists(attackAnim)) {
      if (sprite.anims?.currentAnim?.key !== attackAnim) sprite.play(attackAnim, true);
      if (sprite.anims) sprite.anims.timeScale = 1;
      if (sprite.getData?.('type') === 'bat') sprite.setTint(0xffb4a2);
    } else {
      if (walkAnim && scene.anims?.exists(walkAnim) && sprite.anims?.currentAnim?.key !== walkAnim) {
        sprite.play(walkAnim, true);
      }
      if (sprite.getData?.('type') === 'bat') sprite.clearTint();
      if (sprite.anims?.currentAnim) sprite.anims.timeScale = clamp(Math.abs(vx) / 120, 0.75, 1.35);
    }
  }
}
