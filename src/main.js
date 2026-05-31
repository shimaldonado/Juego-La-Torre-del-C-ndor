import Phaser from 'phaser';
import './styles/global.css';
import { gameConfig } from './config/gameConfig.js';

new Phaser.Game(gameConfig);

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.__torreCondorInstallPrompt = event;
  window.dispatchEvent(new Event('torre-install-ready'));
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}