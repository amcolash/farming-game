import { Crop, Crops } from '../data/crops';
import * as SimplexNoise from 'simplex-noise';

export enum LandState {
  EMPTY,
  PLOWED,
  PLANTED,
  READY
}

export class Land extends Phaser.GameObjects.GameObject {
  // global id counter such that each tile has a unique id
  static idCounter: number = 0;

  // the number of unique update groups, should update each crop 4x per "simulated second"
  static readonly updateGroups: number = 15;

  // random simplex generator, shared between all land tiles
  static simplex = new SimplexNoise(__DEV__ ? 'bring the noise' : Math.random);

  registry: Phaser.Data.DataManager;
  world: Phaser.Physics.Arcade.World;

  sprite: Phaser.GameObjects.Sprite;
  bar: Phaser.GameObjects.Rectangle;
  
  id: string;
  updateCycle: number;
  land: LandState;
  life: number;
  crop: Crop;
  health: number;

  // TODO: Make this a container
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, 'land');
    
    this.registry = scene.game.registry;
    this.world = scene.physics.world;

    this.crop = null;
    this.land = LandState.EMPTY;
    this.id = x.toString() + y.toString();
    this.updateCycle = (Land.idCounter++ % Land.updateGroups);

    this.sprite = scene.add.sprite(x, y, 'crops', 19);
    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerdown', this.handleClick.bind(this));
    this.sprite.on('pointerover', () => scene.events.emit('hover', this));

    this.health = Land.simplex.noise2D(x / 256, y / 256);
    this.health = (((this.health + 1) / 2) * 0.4) + 0.6;
    this.sprite.setTint(Phaser.Display.Color.GetColor(this.health * 255, this.health * 255, this.health * 255));

    // if (x === 0 && y === 0) scene.add.rectangle(x, y, 32, 32).setStrokeStyle(1, 0xff0000, 0.75);
    this.bar = scene.add.rectangle(x - 16, y - 16, 0, 2, 0x00ee00);
  }

  update(time: number, delta: number) {
    this.updateCycle = (this.updateCycle + 1) % Land.updateGroups;
    if (this.updateCycle !== 0) return;

    delta *= Land.updateGroups;

    if (this.crop != null) {
      this.life -= (delta / 1000) * (1 / this.world.timeScale);
      if (this.life < -this.crop.timeToDeath) {
        this.crop = null;
        this.land = LandState.EMPTY;
        this.bar.alpha = 0;
        this.updateTile();
      } else {
        if (this.life > 0) {
          this.bar.fillColor = 0x00ee00;
          this.bar.width = (1 - (this.life / this.crop.timeToRipe)) * 32;
        } else {
          if (this.land == LandState.PLANTED) {
            this.land = LandState.READY;
            this.updateTile();
          }
          
          this.bar.fillColor = 0xee0000;
          this.bar.width = (1 - (-this.life / this.crop.timeToDeath)) * 32;
        }
      }
    } else {
      this.bar.alpha = 0;

      if (this.land == LandState.PLOWED) {
        if (this.life > 0) {
          this.life -= (delta / 1000) * (1 / this.world.timeScale);
        } else {
          this.land = LandState.EMPTY;
          this.updateTile();
        }
      }
    }

    if (this.land == LandState.EMPTY) {
      this.health = Math.min(1, this.health + (delta / 8000000) * (1 / this.world.timeScale));
    } else {
      this.health = Math.max(0.6, this.health - (delta / 2000000) * (1 / this.world.timeScale));
    }
    this.sprite.setTint(Phaser.Display.Color.GetColor(this.health * 255, this.health * 255, this.health * 255));
  }

  updateTile() {
    this.scene.events.emit('tileUpdate', this);

    let frame;
    switch(this.land) {
      case LandState.PLOWED:
        frame = 18;
        break;
      case LandState.PLANTED:
        frame = this.crop.frame + 6;
        break;
      case LandState.READY:
        frame = this.crop.frame + 12;
        break;
      default:
        frame = 19;
        break;
    }

    this.sprite.setFrame(frame);
  }

  handleClick() {
    if (this.scene.game.input.activePointer.rightButtonDown()) {
      this.clear();
    } else {
      switch(this.land) {
        case LandState.EMPTY:
          this.plow();
          break;
        case LandState.PLOWED:
          const crop = Crops[this.registry.get('currentCrop')];
          this.plant(crop);
          break;
        case LandState.PLANTED:
          break;
        case LandState.READY:
          this.harvest();
          break;
      }
    }

    this.scene.events.emit('hover', this);
  }

  clear(): void {
    this.crop = null;
    this.land = LandState.EMPTY;
    this.bar.width = 0;
    this.bar.alpha = 0;
    this.updateTile();
  }

  plow(): void {
    const money = this.registry.get('money');
    if (money - 5 >= 0) {
      this.registry.set('money', money - 5);
      this.land = LandState.PLOWED;
      this.life = 90;
      this.updateTile();
    }
  }

  plant(crop: Crop): void {
    const money = this.registry.get('money');
    if (money - crop.cost >= 0) {
      this.registry.set('money', money - crop.cost);
      this.crop = crop;
      this.life = crop.timeToRipe;
      this.land = LandState.PLANTED;
      this.bar.alpha = 1;
      this.updateTile();
    }
  }

  harvest(): void {
    const money = this.registry.get('money');
    // You can get up to 115% of a crop value if harvested immediately, at a minimum you get 75% of value as it dies
    let revenue = Math.floor(this.crop.revenue * 0.75 + this.crop.revenue * (1 - (-this.life / this.crop.timeToDeath)) * 0.4);
    // Reduce value of crop based on land health. Health can decrease value by up to 20%
    revenue = (0.8 * revenue) + (0.2 * revenue * this.health);
    this.registry.set('money', money + revenue);
    this.registry.set('profit', this.registry.get('profit') + this.crop.revenue - this.crop.cost - 5);
    this.registry.values.stats[this.crop.frame]++;
    this.crop = null;
    this.land = LandState.EMPTY;
    this.bar.width = 0;
    this.bar.alpha = 0;
    this.updateTile();
  }
}