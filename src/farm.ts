import { Land } from './land';

export class Farm extends Phaser.GameObjects.GameObject {
  constructor(scene: Phaser.Scene) {
    super(scene, 'farm');

    const farm = scene.add.group();

    for (var x = 0; x < 5; x++) {
      for (var y = 0; y < 7; y++) {
        const offsetX = x * 85 + 67;
        const offsetY = y * 85 + 64;

        const tile = new Land(scene, offsetX, offsetY);
        farm.add(tile);
      }
    }
  }
}