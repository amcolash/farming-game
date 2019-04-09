import { Land, LandState } from './land';

export class Farm extends Phaser.GameObjects.GameObject {
  readonly dimensionX: number = 10;
  readonly dimensionY: number = 10;
  readonly tileSize: number = 32;

  constructor(scene: Phaser.Scene) {
    super(scene, 'farm');

    const xPos = -this.dimensionX * this.tileSize - (this.tileSize / 2);
    const yPos = -this.dimensionY * this.tileSize - (this.tileSize / 2);
    const width = this.dimensionX * 2 * this.tileSize;
    const height = this.dimensionY * 2 * this.tileSize;

    this.scene.physics.world.setBounds(xPos, yPos, width, height);

    const farm = scene.add.group();

    for (var x = -this.dimensionX; x < this.dimensionX; x++) {
      for (var y = -this.dimensionY; y < this.dimensionY; y++) {
        const offsetX = x * this.tileSize;
        const offsetY = y * this.tileSize;

        const tile = new Land(scene, offsetX, offsetY);
        if (x === 0 && y === 0) tile.land = LandState.PLOWED;
        farm.add(tile);
      }
    }

    const grid = new Phaser.GameObjects.Grid(scene, -this.tileSize / 2, -this.tileSize / 2, width, height, this.tileSize, this.tileSize, 0x000000, 0, 0xffffff, 0.1);
    farm.add(grid, true);
  }
}