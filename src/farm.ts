import { Land, LandState } from './land';

export class Farm extends Phaser.GameObjects.GameObject {
  readonly dimensionX: number = 10;
  readonly dimensionY: number = 10;
  readonly tileSize: number = 32;

  farm: Land[][];

  empty: Phaser.GameObjects.Group;
  plowed: Phaser.GameObjects.Group;
  planted: Phaser.GameObjects.Group;
  ready: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene) {
    super(scene, 'farm');

    const xPos = -this.dimensionX * this.tileSize - (this.tileSize / 2);
    const yPos = -this.dimensionY * this.tileSize - (this.tileSize / 2);
    const width = this.dimensionX * 2 * this.tileSize;
    const height = this.dimensionY * 2 * this.tileSize;

    this.scene.physics.world.setBounds(xPos, yPos, width, height);

    this.empty = scene.add.group();
    this.plowed = scene.add.group();
    this.planted = scene.add.group();
    this.ready = scene.add.group();

    this.farm = [];

    for (var x = -this.dimensionX; x < this.dimensionX; x++) {
      this.farm[x + this.dimensionX] = [];
      for (var y = -this.dimensionY; y < this.dimensionY; y++) {
        const offsetX = x * this.tileSize;
        const offsetY = y * this.tileSize;

        const tile = new Land(scene, offsetX, offsetY);
        // if (x === 0 && y === 0) tile.land = LandState.PLOWED;
        this.empty.add(tile);
        this.farm[x + this.dimensionX][y + this.dimensionY] = tile;
      }
    }

    const grid = new Phaser.GameObjects.Grid(scene, -this.tileSize / 2, -this.tileSize / 2, width, height, this.tileSize, this.tileSize, 0x000000, 0, 0xffffff, 0.1);
    scene.add.existing(grid);
  }

  update(time: number, delta: number): void {
    for (var x = 0; x < this.farm.length; x++) {
      for (var y = 0; y < this.farm[x].length; y++) {
        const tile = this.farm[x][y];
        tile.update(time, delta);

        this.empty.remove(tile);
        this.plowed.remove(tile);
        this.planted.remove(tile);
        this.ready.remove(tile);
        
        switch(tile.land) {
          case LandState.EMPTY:
            this.empty.add(tile);
            break;
          case LandState.PLOWED:
            this.plowed.add(tile);
            break;
          case LandState.PLANTED:
            this.planted.add(tile);
            break;
          case LandState.READY:
            this.ready.add(tile);
            break;
        }
      }
    }
  }
}