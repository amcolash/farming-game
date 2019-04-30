import { Land, LandState } from './land';
import { Farmer } from './farmer';

export enum CursorMode {
  CROP,
  FARMER
}

export class Farm extends Phaser.GameObjects.GameObject {
  static readonly dimensionX: number = 10;
  static readonly dimensionY: number = 10;
  static readonly tileSize: number = 32;

  farm: Land[][];

  empty: Phaser.Structs.Set<Land>;
  plowed: Phaser.Structs.Set<Land>;
  planted: Phaser.Structs.Set<Land>;
  ready: Phaser.Structs.Set<Land>;

  cursorMode: CursorMode = CursorMode.CROP;
  hover: Phaser.GameObjects.Rectangle;
  glass: Phaser.GameObjects.Rectangle;
  selectedFarmer: Farmer;

  constructor(scene: Phaser.Scene) {
    super(scene, 'farm');

    const xPos = -Farm.dimensionX * Farm.tileSize - (Farm.tileSize / 2);
    const yPos = -Farm.dimensionY * Farm.tileSize - (Farm.tileSize / 2);
    const width = Farm.dimensionX * 2 * Farm.tileSize;
    const height = Farm.dimensionY * 2 * Farm.tileSize;

    this.scene.physics.world.setBounds(xPos, yPos, width, height);

    this.empty = new Phaser.Structs.Set<Land>();
    this.plowed = new Phaser.Structs.Set<Land>();
    this.planted = new Phaser.Structs.Set<Land>();
    this.ready = new Phaser.Structs.Set<Land>();

    this.farm = [];

    for (var x = -Farm.dimensionX; x < Farm.dimensionX; x++) {
      this.farm[x + Farm.dimensionX] = [];
      for (var y = -Farm.dimensionY; y < Farm.dimensionY; y++) {
        const offsetX = x * Farm.tileSize;
        const offsetY = y * Farm.tileSize;

        const tile = new Land(scene, offsetX, offsetY);
        this.empty.set(tile);
        this.farm[x + Farm.dimensionX][y + Farm.dimensionY] = tile;
      }
    }

    this.hover = scene.add.rectangle(0, 0, 32, 32, 0x00ddbb).setAlpha(0);
    this.glass = scene.add.rectangle(xPos, yPos, width, height).setOrigin(0).setInteractive({ cursor: 'crosshair' });
    this.glass.input.enabled = false;
    this.glass.on('pointerdown', this.glassDown.bind(this));

    scene.add.grid(-Farm.tileSize / 2, -Farm.tileSize / 2, width, height, Farm.tileSize, Farm.tileSize, 0x000000, 0, 0xffffff, 0.05);

    scene.events.addListener('tileUpdate', (tile: Land) => this.tileUpdated(tile));
    scene.events.on('hover', tile => { this.hover.alpha = 0.2; this.hover.setPosition(tile.sprite.x, tile.sprite.y); });
    scene.game.events.on('clearHover', () => this.hover.alpha = 0);
  }

  tileUpdated(tile: Land) {
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
    this.empty.entries.forEach(t => t.update(time, delta));
    this.plowed.entries.forEach(t => t.update(time, delta));
    this.planted.entries.forEach(t => t.update(time, delta));
    this.ready.entries.forEach(t => t.update(time, delta));
  }

  glassDown(event) {
    const x = Math.floor(event.worldX / Farm.tileSize) * Farm.tileSize;
    const y = Math.floor(event.worldY / Farm.tileSize) * Farm.tileSize;
    this.selectedFarmer.updateSpawnLocation(x, y);
    this.glass.input.enabled = false;
    this.setCursorMode(CursorMode.CROP);
    this.scene.game.events.emit('speed', 0);
    this.scene.game.events.emit('hoverFarmer', null);
  }

  setCursorMode(mode: CursorMode, selected?: Farmer) {
    this.cursorMode = mode;
    this.hover.alpha = 0;

    switch(mode) {
      case CursorMode.CROP:
        this.glass.input.enabled = false;
        break;
      case CursorMode.FARMER:
        this.glass.input.enabled = true;
        this.selectedFarmer = selected;
        this.scene.game.events.emit('hoverFarmer', selected);
        this.scene.game.events.emit('speed', 0);
        break;
    }
  }
}