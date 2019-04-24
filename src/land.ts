import { Crop, Crops } from './crops';

export enum LandState {
  EMPTY,
  PLOWED,
  PLANTED,
  READY
}

export class Land extends Phaser.GameObjects.GameObject {
  registry: Phaser.Data.DataManager;
  world: Phaser.Physics.Arcade.World;

  sprite: Phaser.GameObjects.Sprite;
  id: string;
  bar: Phaser.GameObjects.Rectangle;

  land: LandState;
  life: number;
  crop: Crop;

  // TODO: Make this a container
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, 'land');
    
    this.registry = scene.game.registry;
    this.world = scene.physics.world;

    this.crop = null;
    this.land = LandState.EMPTY;
    this.id = x.toString() + y.toString();

    this.sprite = scene.add.sprite(x, y, 'crops', 19);
    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerdown', this.handleClick.bind(this));
    this.sprite.on('pointerover', () => scene.events.emit('hover', this));

    if (x === 0 && y === 0) scene.add.rectangle(x, y, 32, 32).setStrokeStyle(1, 0xff0000, 0.75);
    this.bar = scene.add.rectangle(x - 16, y - 16, 0, 2, 0x00ee00);
  }

  update(time: number, delta: number) {
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
    this.registry.set('money', money + this.crop.revenue);
    this.registry.set('profit', this.registry.get('profit') + this.crop.revenue - this.crop.cost - 5);
    this.registry.values.stats[this.crop.frame]++;
    this.crop = null;
    this.land = LandState.EMPTY;
    this.bar.alpha = 0;
    this.updateTile();
  }
}