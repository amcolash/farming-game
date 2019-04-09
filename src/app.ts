import "phaser";
import { FarmScene } from './farmScene';
import { HUDScene } from './hudScene';
import { LoadingScene } from './loadingScene';
import { ShopScene } from './shopScene';

const config: GameConfig = {
  title: 'Farming Game',
  width: 480,
  height: 720,
  parent: 'game',
  backgroundColor: '#000000',
  scene: [LoadingScene, FarmScene, HUDScene, ShopScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }
};

export class FarmingGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);

    // Set up game data
    this.registry.set('money', 300);
    this.registry.set('currentCrop', 0);
  }
}

window.onload = () => {
  var game = new FarmingGame(config);
};