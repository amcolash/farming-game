import "phaser";
import { FarmScene } from './farmScene';
import { ShopScene } from './shopScene';

const config: GameConfig = {
  title: 'Farming Game',
  width: 480,
  height: 720,
  parent: 'game',
  backgroundColor: '#000000',
  scene: [FarmScene, ShopScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
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