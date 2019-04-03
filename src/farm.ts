import { Land } from './land';

export class Farm extends Phaser.GameObjects.GameObject {
  constructor(scene: Phaser.Scene) {
    super(scene, 'farm');

    var farm = scene.add.group();

    for (var x = 0; x < 5; x++) {
      for (var y = 0; y < 7; y++) {
        var offsetX = x * 85 + 67;
        var offsetY = y * 85 + 64;

        var tile = new Land(scene, offsetX, offsetY);
        farm.add(tile, true);
      }
    }
  }
}