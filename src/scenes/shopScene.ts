import { Shop } from '../shop/shop';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('ShopScene');
  }

  create(): void {
    new Shop(this);
  }
}