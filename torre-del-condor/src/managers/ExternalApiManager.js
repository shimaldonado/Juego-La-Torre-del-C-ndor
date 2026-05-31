export class ExternalApiManager {
  static async getDailyTip() {
    try {
      const response = await fetch('https://api.github.com/repos/phaserjs/phaser', { cache: 'no-store' });
      const data = await response.json();
      const stars = Number(data.stargazers_count || 0).toLocaleString('es-EC');
      return `API externa activa: Phaser tiene ${stars} estrellas en GitHub.`;
    } catch {
      return 'API externa sin conexión: se usa modo offline con guardado local.';
    }
  }
}
