import { Land, LandState } from './land';
import { Util } from './util';
import { FarmScene } from './farmScene';

export class Tooltip extends Phaser.GameObjects.Container {
  current: Land;
  info: Phaser.GameObjects.Container;
  text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);
    this.alpha = 0;

    this.info = new Phaser.GameObjects.Container(this.scene, -16, -32);
    this.add(this.info);

    this.text = new Phaser.GameObjects.Text(this.scene, 0, 12, '', { fontSize: 12 }).setOrigin(0, 1);
    this.text.setBackgroundColor('rgba(0,0,0,0.5)');
    this.text.setPadding(4, 6, 4, 6);
    this.info.add(this.text);

    scene.events.on('hover', tile => this.showTooltip(tile));
    scene.events.on('hoverFarmer', this.hideTooltip.bind(this));
    scene.game.events.on('clearHover', this.hideTooltip.bind(this));
  }

  showTooltip(tile: Land) {
    this.current = tile;
    this.setPosition(tile.sprite.x, tile.sprite.y);
  }

  hideTooltip() {
    this.current = null;
  }

  update() {
    if (this.current && this.current.land != LandState.EMPTY ) {
      var t = 'State: ' + LandState[this.current.land];
      if (this.current.crop) {
        t += '\nCrop: ' + this.current.crop.name;
        if (this.current.life > 0) t += '\nTo Ripe: ' + this.current.life.toFixed(0) + 's';
        if (this.current.life < 0) t += '\nTo Death: ' + (this.current.crop.timeToDeath + this.current.life).toFixed(0) + 's';
      }
      this.text.setText(Util.titleCase(t));
      
      this.alpha = 1;
    } else {
      this.alpha = 0;
    }
  }
}