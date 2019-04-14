import { Crops } from './crops';
import { HUDScene } from './hudScene';

export class Shop extends Phaser.GameObjects.GameObject {
  constructor(scene: Phaser.Scene) {
    super(scene, 'shop');

    for (var i = 0; i < Crops.length; i++) {
      const index = i;
      const crop = Crops[index];

      const sprite = this.scene.add.sprite(100, i * 100 + 50, 'crops', crop.frame);
      sprite.setScale(2.5);
      
      const data = crop.name + '(' + crop.timeToRipe + ' days)' + '\ncost: $' + crop.cost.toString() + '\nrevenue: $' + crop.revenue.toString();
      const text = this.scene.add.text(180, i * 100 + 20, data, { fontSize: 24 });

      // sprite.setInteractive({ useHandCursor: true })
      //   .on('pointerup', () => this.selectCrop(index));
      // text.setInteractive({ useHandCursor: true })
      //   .on('pointerup', () => this.selectCrop(index));
    }
  }

  selectCrop(index: number) {
    this.scene.game.registry.set('currentCrop', index);
    (this.scene.game.scene.getScene('HUDScene') as HUDScene).toggleShop();
  }
}