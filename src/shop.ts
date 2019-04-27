import { Crops } from './crops';
import { HUDScene } from './hudScene';
import { TextButton } from './textButton';
import { Farmer } from './farmer';
import { FarmScene } from './farmScene';
import { Util } from './util';
import { Farmers, FarmerType } from './farmerData';

export class Shop extends Phaser.GameObjects.GameObject {
  crops: Phaser.GameObjects.Container;
  farmers: Phaser.GameObjects.Container;

  cropsButton: TextButton;
  farmersButton: TextButton;

  constructor(scene: Phaser.Scene) {
    super(scene, 'shop');

    this.crops = scene.add.container(0, 0);
    this.farmers = scene.add.container(0, 0).setAlpha(0);

    this.generateCrops();
    this.generateFarmers();

    this.cropsButton = new TextButton(scene, 30, 60, 'Crops', () => this.selectCrops()).setOrigin(0.5, 0.5).setAngle(270);
    this.farmersButton = new TextButton(scene, 30, 180, 'Farmers', () => this.selectFarmers()).setOrigin(0.5, 0.5).setAngle(270);

    this.cropsButton.setSelected(true);
  }

  selectCrop(index: number) {
    this.scene.game.registry.set('currentCrop', index);
    (this.scene.game.scene.getScene('HUDScene') as HUDScene).toggleShop();
  }

  selectFarmer(type: FarmerType, cost: number) {
    const farmScene = this.scene.game.scene.getScene('FarmScene') as FarmScene;
    const farmer = new Farmer(farmScene, 0, 0, farmScene.farm, type);
    farmScene.farmers.push(farmer);
    (this.scene.game.scene.getScene('HUDScene') as HUDScene).toggleShop();
    this.scene.game.events.emit('farmerUpdate');
  }

  selectCrops(): void {
    this.cropsButton.setSelected(true);
    this.farmersButton.setSelected(false);

    this.crops.setAlpha(1);
    this.farmers.setAlpha(0);
  }

  selectFarmers(): void {
    this.cropsButton.setSelected(false);
    this.farmersButton.setSelected(true);

    this.generateFarmers();
    this.crops.setAlpha(0);
    this.farmers.setAlpha(1);
  }

  generateCrops(): void {
    for (var i = 0; i < Crops.length; i++) {
      const index = i;
      const crop = Crops[index];

      const sprite = new Phaser.GameObjects.Sprite(this.scene, 120, i * 100 + 50, 'crops', crop.frame);
      sprite.setScale(2.5);
      this.crops.add(sprite);
      
      const data = crop.name + '(' + crop.timeToRipe + ' days)' + '\ncost: $' + crop.cost.toString() + '\nrevenue: $' + crop.revenue.toString();
      const text = new Phaser.GameObjects.Text(this.scene, 200, i * 100 + 20, data, { fontSize: 24 });
      this.crops.add(text);

      sprite.setInteractive({ useHandCursor: true })
        .on('pointerup', () => this.selectCrop(index));
      text.setInteractive({ useHandCursor: true })
        .on('pointerup', () => this.selectCrop(index));
    }
  }

  generateFarmers(): void {
    this.farmers.removeAll();
    const money = this.scene.game.registry.get('money');

    for (var i = 0; i < Farmers.length; i++) {
      const farmer = Farmers[i];
      const sprite = new Phaser.GameObjects.Sprite(this.scene, 120, i * 130 + 60, Farmer.getSprite(farmer.type));
      sprite.setScale(2);
      if (money < farmer.cost) sprite.setPipeline('grayscale');
      this.farmers.add(sprite);

      const text = new Phaser.GameObjects.Text(this.scene, 200, i * 130 + 20, farmer.text, { fontSize: 20, wordWrap: { width: 280 } });
      this.farmers.add(text);

      const cost = 'Cost: $' + Util.numberWithCommas(farmer.cost);
      const price = new Phaser.GameObjects.Text(this.scene, 200, i * 130 + 90, cost, { fontSize: 20, color: money >= farmer.cost ? 'white' : 'red' });
      this.farmers.add(price);

      if (money >= farmer.cost) {
        sprite.setInteractive({ useHandCursor: true })
          .on('pointerup', () => this.selectFarmer(farmer.type, farmer.cost));
        text.setInteractive({ useHandCursor: true })
          .on('pointerup', () => this.selectFarmer(farmer.type, farmer.cost));
      }
    }
  }
}