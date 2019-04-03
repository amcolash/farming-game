import { Crop, Crops } from './crops';

enum LandState {
  EMPTY,
  PLOWED,
  PLANTED
}

export class Land extends Phaser.GameObjects.Sprite {
  state: LandState;
  life: number;
  crop: Crop;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'crops');
    this.setScale(2.5);

    this.setInteractive({ useHandCursor: true });
    this.on('pointerdown', this.handleClick);

    this.crop = null;
    this.state = LandState.EMPTY;
  }

  preUpdate(time: number, delta: number) {
      if (this.crop != null) {
        this.life -= (delta / 1000);
        if (this.life < -this.crop.time_to_death) {
          this.crop = null;
          this.state = LandState.EMPTY;
        }
      }

      this.updateImage();
  }

  updateImage() {
    let frame;
    switch(this.state) {
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

    this.setFrame(frame);
  }

  handleClick() {
    const money = this.scene.game.registry.get('money');
    const crop = Crops[this.scene.game.registry.get('currentCrop')];

    switch(this.state) {
      case LandState.EMPTY:
        if (money - 5 >= 0) {
          this.scene.game.registry.set('money', money - 5);
          this.state = LandState.PLOWED;
        }
        break;
      case LandState.PLOWED:
        if (money - crop.cost >= 0) {
          this.scene.game.registry.set('money', money - crop.cost);
          this.crop = crop;
          this.life = crop.time_to_ripe;
          this.state = LandState.PLANTED;
        }
        break;
      case LandState.PLANTED:
        if (this.life < 0) {
          this.scene.game.registry.set('money', money + this.crop.revenue);
          this.crop = null;
          this.state = LandState.EMPTY;
        }
        break;
    }
  }
}