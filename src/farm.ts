import { Land, LandState } from './land';

export class Farm extends Phaser.GameObjects.GameObject {
  readonly dimensionX: number = 10;
  readonly dimensionY: number = 10;
  readonly tileSize: number = 32;

  farm: Land[][];

  empty: Phaser.Structs.Set<Land>;
  plowed: Phaser.Structs.Set<Land>;
  planted: Phaser.Structs.Set<Land>;
  ready: Phaser.Structs.Set<Land>;

  constructor(scene: Phaser.Scene) {
    super(scene, 'farm');

    const xPos = -this.dimensionX * this.tileSize - (this.tileSize / 2);
    const yPos = -this.dimensionY * this.tileSize - (this.tileSize / 2);
    const width = this.dimensionX * 2 * this.tileSize;
    const height = this.dimensionY * 2 * this.tileSize;

    this.scene.physics.world.setBounds(xPos, yPos, width, height);

    this.empty = new Phaser.Structs.Set<Land>();
    this.plowed = new Phaser.Structs.Set<Land>();
    this.planted = new Phaser.Structs.Set<Land>();
    this.ready = new Phaser.Structs.Set<Land>();

    this.farm = [];

    for (var x = -this.dimensionX; x < this.dimensionX; x++) {
      this.farm[x + this.dimensionX] = [];
      for (var y = -this.dimensionY; y < this.dimensionY; y++) {
        const offsetX = x * this.tileSize;
        const offsetY = y * this.tileSize;

        const tile = new Land(scene, offsetX, offsetY);
        // if (x === 0 && y === 0) tile.land = LandState.PLOWED;
        this.empty.set(tile);
        this.farm[x + this.dimensionX][y + this.dimensionY] = tile;
      }
    }

    // const grid = new Phaser.GameObjects.Grid(scene, -this.tileSize / 2, -this.tileSize / 2, width, height, this.tileSize, this.tileSize, 0x000000, 0, 0xffffff, 0.1);
    // scene.add.existing(grid);

    // scene.events.addListener('tileUpdate', (tile: Land) => this.tileUpdated.bind(this, tile));
    scene.events.addListener('tileUpdate', (tile: Land) => this.tileUpdated(tile));
  }

  tileUpdated(tile: Land) {
    console.log(tile);

    this.empty.delete(tile);
    this.plowed.delete(tile);
    this.planted.delete(tile);
    this.ready.delete(tile);

    switch(tile.land) {
      case LandState.EMPTY:
        this.empty.set(tile);
        break;
      case LandState.PLOWED:
        this.plowed.set(tile);
        break;
      case LandState.PLANTED:
        this.planted.set(tile);
        break;
      case LandState.READY:
        this.ready.set(tile);
        break;
    }

    this.scene.game.events.emit('planted', this.planted.size + this.ready.size);
  }

  update(time: number, delta: number): void {
    this.plowed.entries.forEach(t => t.update(time, delta));
    this.planted.entries.forEach(t => t.update(time, delta));
    this.ready.entries.forEach(t => t.update(time, delta));
  }
}