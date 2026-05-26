import Phaser from 'phaser';
import './styles.css';
import { gameConfig } from './config/gameConfig.js';

new Phaser.Game(gameConfig);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
