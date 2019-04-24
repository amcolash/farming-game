import { Crops } from './crops';
import { TextButton } from './textButton';
import { Farm } from './farm';
import { FarmScene } from './farmScene';
import { Util } from './util';
import { FarmerType, Farmer } from './farmer';

export class HUDScene extends Phaser.Scene {
  registry: Phaser.Data.DataManager;
  isShop: boolean;
  farm: Farm;

  button: TextButton;
  crop: Phaser.GameObjects.Sprite;
  life: Phaser.GameObjects.Text;
  money: Phaser.GameObjects.Text;
  planted: Phaser.GameObjects.Text;
  profit: Phaser.GameObjects.Text;
  speed: Phaser.GameObjects.Text;
  value: Phaser.GameObjects.Text;

  stats: Phaser.GameObjects.Container;
  bars: Phaser.GameObjects.Rectangle[];
  
  farmScene: FarmScene;
  farmers: Phaser.GameObjects.Container;
  farmerList: Phaser.GameObjects.Container;

  constructor() {
    super('HUDScene');
  }

  create() {
    const width: number = Number.parseInt(this.game.config.width.toString());
    const height: number = Number.parseInt(this.game.config.height.toString());

    this.registry = this.game.registry;
    this.isShop = false;

    this.add.rectangle(0, height - 100, width, 100, 0x000000).setInteractive({ cursor: 'default' }).setOrigin(0, 0);
    this.add.rectangle(0, height - 102, width, 2, 0x777777).setOrigin(0, 0);

    this.button = new TextButton(this, 20, height - 28, this.isShop ? 'Back' : 'Shop', () => this.toggleShop());
    this.life = this.add.text(20, height - 90, 'Life: 0');
    this.profit = this.add.text(20, height - 70, 'Profit: $0');
    this.crop = this.add.sprite(width / 2 - 8, height - 35, 'crops', Crops[this.registry.get('currentCrop')].frame);
    this.crop.setScale(1.5);
    
    new TextButton(this, width / 2 - 32, height - 100, "<", () => this.game.events.emit('speed', -1));
    new TextButton(this, width / 2 - 4, height - 100, ">", () => this.game.events.emit('speed', 1));
    new TextButton(this, width / 2 - 32, height - 80, "-", () => this.game.events.emit('zoom', -1));
    new TextButton(this, width / 2 - 4, height - 80, "+", () => this.game.events.emit('zoom', 1));
    
    this.money = this.add.text(width - 20, height - 28, '$0', { fontSize: 24 });
    this.money.setOrigin(1, 0);

    this.planted = this.add.text(width - 20, height - 90, 'Planted: 0');
    this.planted.setOrigin(1, 0);
    this.game.events.addListener('planted', value => this.planted.setText('Planted: ' + value));

    this.speed = this.add.text(width - 20, height - 70, 'Speed: ' + (1 / this.scene.get('FarmScene').physics.world.timeScale).toFixed(0));
    this.speed.setOrigin(1, 0);
    this.game.events.addListener('speedValue', value => this.speed.setText('Speed: ' + value));

    this.stats = this.add.container(20, height - 125);
    this.stats.add(new Phaser.GameObjects.Rectangle(this, -20, 23, 200, 115, 0x000000, 0.35).setOrigin(0, 1));
    
    this.farm = (this.game.scene.getScene('FarmScene') as FarmScene).farm;
    this.value = this.add.text(20, height - 50, 'Farm Value: $0');

    this.bars = [];
    const sorted = Crops.sort((a, b) => { return a.frame - b.frame });
    for (var i = 0; i < sorted.length; i++) {
      const crop = sorted[i];
      
      const sprite = new Phaser.GameObjects.Sprite(this, i * 32, 0, 'crops', crop.frame);
      this.stats.add(sprite);

      const bar = new Phaser.GameObjects.Rectangle(this, i * 32, -50, 8, 50, 0xcccccc);
      bar.setAngle(180);
      this.bars.push(bar);
      this.stats.add(bar);
    }

    this.farmScene = (this.game.scene.getScene('FarmScene') as FarmScene);
    this.farmers = this.add.container(width - 175, 0);
    this.farmerList = this.add.container(0, 0);

    const rectangle = new Phaser.GameObjects.Rectangle(this, 0, 0, 175, height - 100, 0x000000, 0.5).setOrigin(0);
    rectangle.setInteractive();
    rectangle.on('pointerover', () => this.game.events.emit('clearHover'));

    this.farmers.add(rectangle);
    this.farmers.add(this.farmerList);
    this.getFarmers();

    this.game.events.on('farmerUpdate', this.getFarmers.bind(this));
  }

  update(time: number, delta: number): void {
    this.crop.setFrame(Crops[this.registry.get('currentCrop')].frame);
    this.life.setText('Life: ' + Util.getTime(this.registry.get('life')));
    this.money.setText('$' + Util.numberWithCommas(this.registry.get('money')));
    this.profit.setText('Profit: $' + Util.numberWithCommas(this.registry.get('profit')));
    this.value.setText('Farm Value: $' + Util.numberWithCommas(this.getFarmValue()));

    this.stats.visible = !this.isShop;
    this.farmerList.visible = !this.isShop;
    
    if (this.stats.visible) {
      const stats = this.registry.get('stats');
      const total = stats.reduce((a, v) => { return a + v; });
      for (var i = 0; i < Crops.length; i++) {
        if (total === 0) this.bars[i].height = 2;
        else this.bars[i].height = 2 + 47 * (stats[i] / total);
      }
    }
  }

  getFarmers(): void {
    const farmers = this.farmScene.farmers;
    this.farmerList.removeAll();
    for (var i = 0; i < farmers.length; i++) {
      const farmer = farmers[i];
      const sprite = new Phaser.GameObjects.Sprite(this, 10, 10 + i * 60, Farmer.getSprite(farmer.farmerType), 0).setOrigin(0);
      const text = new Phaser.GameObjects.Text(this, 46, 10 + i * 60, farmer.stats.name + '\n(' + Util.titleCase(FarmerType[farmer.farmerType]) + ')', { fontSize: 18 }).setOrigin(0);
      this.farmerList.add(sprite);
      this.farmerList.add(text);

      sprite.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.game.events.emit('hoverFarmer', farmer))
        .on('pointerout', () => this.game.events.emit('hoverFarmer', null));

      text.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.game.events.emit('hoverFarmer', farmer))
        .on('pointerout', () => this.game.events.emit('hoverFarmer', null));
    }
  }

  getFarmValue(): number {
    var value = this.farm.plowed.size * 5;
    this.farm.planted.entries.forEach(t => value += t.crop.revenue);

    return value;
  }

  toggleShop(): void {
    this.scene.sleep(this.isShop ? 'ShopScene' : 'FarmScene');
    this.scene.run(this.isShop ? 'FarmScene' : 'ShopScene');
    this.isShop = !this.isShop;
    this.button.setText(this.isShop ? 'Back' : 'Shop');
  }
}