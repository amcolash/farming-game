import { Shop } from './shop';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('ShopScene');
  }

  preload(): void {
    this.load.spritesheet('crops', 'assets/images/crops.png', { frameWidth: 32, frameHeight: 32 });
  }

  create(): void {
    new Shop(this);
  }
}