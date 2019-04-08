import { Crop, Crops } from './crops';

enum LandState {
  EMPTY,
  PLOWED,
  PLANTED
}

export class Land extends Phaser.GameObjects.GameObject {
  sprite: Phaser.GameObjects.Sprite;
  bar: Phaser.GameObjects.Rectangle;

  land: LandState;
  life: number;
  crop: Crop;

  // TODO: Make this a group
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, 'land');
    scene.sys.updateList.add(this);
    
    this.crop = null;
    this.land = LandState.EMPTY;

    this.sprite = scene.add.sprite(x, y, 'crops');
    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerdown', this.handleClick.bind(this));

    this.bar = scene.add.rectangle(x - 16, y - 16, 0, 2, 0x00ee00);
  }

  preUpdate(time: number, delta: number) {
    if (this.crop != null) {
      this.life -= (delta / 1000);
      if (this.life < -this.crop.time_to_death) {
        this.crop = null;
        this.land = LandState.EMPTY;
      } else {
        if (this.life > 0) {
          this.bar.fillColor = 0x00ee00;
          this.bar.width = (1 - (this.life / this.crop.time_to_ripe)) * 32;
        } else {
          this.bar.fillColor = 0xee0000;
          this.bar.width = (1 - (-this.life / this.crop.time_to_death)) * 32;
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
        if (this.life >= 0) frame = this.crop.frame + 6;
        else frame = this.crop.frame + 12;
        break;
      default:
        frame = 19;
        break;
    }

    this.sprite.setFrame(frame);
  }

  handleClick() {
    const money = this.scene.game.registry.get('money');
    const crop = Crops[this.scene.game.registry.get('currentCrop')];

    switch(this.land) {
      case LandState.EMPTY:
        if (money - 5 >= 0) {
          this.scene.game.registry.set('money', money - 5);
          this.land = LandState.PLOWED;
        }
        break;
      case LandState.PLOWED:
        if (money - crop.cost >= 0) {
          this.scene.game.registry.set('money', money - crop.cost);
          this.crop = crop;
          this.life = crop.time_to_ripe;
          this.land = LandState.PLANTED;
        }
        break;
      case LandState.PLANTED:
        if (this.life < 0) {
          this.scene.game.registry.set('money', money + this.crop.revenue);
          this.crop = null;
          this.land = LandState.EMPTY;
        }
        break;
    }
  }
}