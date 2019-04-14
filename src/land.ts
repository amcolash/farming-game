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
    scene.sys.updateList.add(this);
    
    this.registry = scene.game.registry;
    this.world = scene.physics.world;

    this.crop = null;
    this.land = LandState.EMPTY;
    this.id = x.toString() + y.toString();

    this.sprite = scene.add.sprite(x, y, 'crops');
    // this.sprite.setInteractive({ useHandCursor: true });
    // this.sprite.on('pointerdown', this.handleClick.bind(this));

    this.bar = scene.add.rectangle(x - 16, y - 16, 0, 2, 0x00ee00);
  }

  preUpdate(time: number, delta: number) {
    if (this.crop != null) {
      this.life -= (delta / 1000) * (1 / this.world.timeScale);
      if (this.life < -this.crop.timeToDeath) {
        this.crop = null;
        this.land = LandState.EMPTY;
      } else {
        if (this.life > 0) {
          this.bar.fillColor = 0x00ee00;
          this.bar.width = (1 - (this.life / this.crop.timeToRipe)) * 32;
        } else {
          this.land = LandState.READY;
          this.bar.fillColor = 0xee0000;
          this.bar.width = (1 - (-this.life / this.crop.timeToDeath)) * 32;
        }
      }
    } else {
      this.bar.width = 0;
    }

    this.updateImage();
  }

  updateImage() {
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
      this.crop = null;
      this.land = LandState.EMPTY;
      return;
    }

    const money = this.registry.get('money');
    
    switch(this.land) {
      case LandState.EMPTY:
      if (money - 5 >= 0) {
        this.registry.set('money', money - 5);
        this.land = LandState.PLOWED;
      }
      break;
      case LandState.PLOWED:
        const crop = Crops[this.registry.get('currentCrop')];
        if (money - crop.cost >= 0) {
          this.registry.set('money', money - crop.cost);
          this.crop = crop;
          this.life = crop.timeToRipe;
          this.land = LandState.PLANTED;
        }
        break;
      case LandState.PLANTED:
        break;
      case LandState.READY:
        this.registry.set('money', money + this.crop.revenue);
        this.registry.set('profit', this.registry.get('profit') + this.crop.revenue - this.crop.cost - 5);
        this.registry.values.stats[this.crop.frame]++;
        this.crop = null;
        this.land = LandState.EMPTY;
        break;
    }
  }
}