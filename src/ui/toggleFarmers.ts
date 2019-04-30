import { ToggleContainer } from "./toggleContainer";
import { FarmScene } from "../scenes/farmScene";
import { CursorMode } from "../farm/farm";
import { Farmer } from "../farm/farmer";
import { Util } from "../game/util";
import { FarmerType } from "../data/farmerData";

export class ToggleFarmers extends ToggleContainer {
  farmerList: Phaser.GameObjects.Container;
  farmListTarget: number;
  farmScene: FarmScene;

  constructor(scene: Phaser.Scene, width:number, height: number, clickHandler: () => void) {
    super(scene, width, width - 175, height - 102);

    this.farmScene = scene.game.scene.getScene('FarmScene') as FarmScene;
    this.farmerList = scene.add.container(0, -height + 102);
    this.farmListTarget = this.width;

    const farmerToggle = new Phaser.GameObjects.Rectangle(scene, -42, 0, 42, 44, 0x000000, 0.5).setOrigin(0, 1);
    farmerToggle.setInteractive({ useHandCursor: true });
    farmerToggle.on('pointerdown', clickHandler);
    farmerToggle.on('pointerover', () => scene.game.events.emit('clearHover'));
    
    const rectangle = new Phaser.GameObjects.Rectangle(scene, 0, 0, 175, height - 102, 0x000000, 0.5).setOrigin(0, 1);
    rectangle.setInteractive();
    rectangle.on('pointerover', () => scene.game.events.emit('clearHover'));
    
    this.add(rectangle);
    this.add(this.farmerList);
    this.add(farmerToggle);
    this.add(new Phaser.GameObjects.Sprite(scene, -36, -40, 'farmer_a', 0).setOrigin(0).setAlpha(0.85));
    
    this.getFarmers();
    scene.game.events.on('farmerUpdate', this.getFarmers.bind(this));
  }

  getFarmers(): void {
    this.farmerList.removeAll();
    for (var i = 0; i < this.farmScene.farmers.length; i++) {
      const farmer = this.farmScene.farmers[i];
      const sprite = new Phaser.GameObjects.Sprite(this.scene, 10, 10 + i * 60, Farmer.getSprite(farmer.farmerType), 0).setOrigin(0);
      const text = new Phaser.GameObjects.Text(this.scene, 46, 10 + i * 60, farmer.stats.name + '\n(' + Util.titleCase(FarmerType[farmer.farmerType]) + ')', { fontSize: 18 }).setOrigin(0);
      this.farmerList.add(sprite);
      this.farmerList.add(text);

      sprite.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.scene.game.events.emit('hoverFarmer', farmer))
        .on('pointerout', () => { if (this.farmScene.farm.cursorMode != CursorMode.FARMER) this.scene.game.events.emit('hoverFarmer', null); })
        .on('pointerdown', this.selectFarmer.bind(this, farmer));

      text.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.scene.game.events.emit('hoverFarmer', farmer))
        .on('pointerout', () => { if (this.farmScene.farm.cursorMode != CursorMode.FARMER) this.scene.game.events.emit('hoverFarmer', null); })
        .on('pointerdown', this.selectFarmer.bind(this, farmer));
    }
  }

  selectFarmer(farmer: Farmer): void {
    this.close();
    this.farmScene.farm.setCursorMode(CursorMode.FARMER, farmer);
  }
}