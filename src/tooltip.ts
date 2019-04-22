import { Land, LandState } from './land';
import { LEFT } from 'phaser';
import { Util } from './util';

export class Tooltip extends Phaser.GameObjects.Container {
  current: Land;
  hover: Phaser.GameObjects.Rectangle;
  info: Phaser.GameObjects.Container;
  text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);
    this.alpha = 0;

    this.hover = new Phaser.GameObjects.Rectangle(scene, 0, 0, 32, 32, 0x00ddbb).setAlpha(0.2);
    this.add(this.hover);

    this.info = new Phaser.GameObjects.Container(scene, -16, -32);
    this.add(this.info);

    this.text = new Phaser.GameObjects.Text(scene, 0, 12, '', { fontSize: 12 }).setOrigin(0, 1);
    this.text.setBackgroundColor('rgba(0,0,0,0.5)');
    this.text.setPadding(4, 6, 4, 6);
    this.info.add(this.text);

    scene.events.on('hover', tile => this.showTooltip(tile));
    scene.events.on('cameraMove', this.hideTooltip.bind(this));
  }

  update() {
    this.updateTooltip();
  }

  showTooltip(tile: Land) {
    this.alpha = 1;
    this.current = tile;

    this.setPosition(tile.sprite.x, tile.sprite.y);
    this.updateTooltip();
  }

  updateTooltip() {
    if (this.current && this.current.land != LandState.EMPTY) {
      var t = 'State: ' + LandState[this.current.land];
      if (this.current.crop) {
        t += '\nCrop: ' + this.current.crop.name;
        if (this.current.life > 0) t += '\nTo Ripe: ' + this.current.life.toFixed(0) + 's';
        if (this.current.life < 0) t += '\nTo Death: ' + (this.current.crop.timeToDeath + this.current.life).toFixed(0) + 's';
      }
      this.text.setText(Util.titleCase(t));
      
      this.info.alpha = 1;
    } else {
      this.info.alpha = 0;
    }
  }

  hideTooltip() {
    this.alpha = 0;
    this.current = null;
  }
}