import { Crops } from '../data/crops';
import { TextButton } from '../ui/textButton';
import { FarmScene } from './farmScene';
import { Util } from '../game/util';
import { ToggleStats } from '../ui/toggleStats';
import { ToggleFarmers } from '../ui/toggleFarmers';

export class HUDScene extends Phaser.Scene {
  isShop: boolean = false;
  width: number;
  height: number;

  farmScene: FarmScene;
  registry: Phaser.Data.DataManager;

  button: TextButton;
  crop: Phaser.GameObjects.Sprite;
  gameTime: Phaser.GameObjects.Text;
  money: Phaser.GameObjects.Text;
  planted: Phaser.GameObjects.Text;
  profit: Phaser.GameObjects.Text;
  speed: Phaser.GameObjects.Text;
  value: Phaser.GameObjects.Text;

  stats: ToggleStats;
  farmers: ToggleFarmers;

  constructor() {
    super('HUDScene');
  }

  create() {
    this.width = Number.parseInt(this.game.config.width.toString());
    this.height = Number.parseInt(this.game.config.height.toString());

    this.registry = this.game.registry;

    const hudRectangle = this.add.rectangle(0, this.height - 100, this.width, 100, 0x000000).setOrigin(0, 0);
    hudRectangle.setInteractive({ cursor: 'default' }).on('pointerover', () => this.game.events.emit('clearHover'));
    this.add.rectangle(0, this.height - 102, this.width, 2, 0x777777).setOrigin(0, 0);

    this.button = new TextButton(this, 20, this.height - 28, this.isShop ? 'Back' : 'Shop', () => this.toggleShop());
    this.gameTime = this.add.text(20, this.height - 90, '');
    this.profit = this.add.text(20, this.height - 70, 'Profit: $0');
    this.crop = this.add.sprite(this.width / 2 - 8, this.height - 35, 'crops', Crops[this.registry.get('currentCrop')].frame);
    this.crop.setScale(1.5);
    
    new TextButton(this, this.width / 2 - 46, this.height - 95, "⏪", () => this.game.events.emit('speed', -1));
    new TextButton(this, this.width / 2 - 18, this.height - 95, "⏯", () => this.game.events.emit('speed', 0));
    new TextButton(this, this.width / 2 + 6, this.height - 95, "⏩", () => this.game.events.emit('speed', 1));
    new TextButton(this, this.width / 2 - 32, this.height - 70, "-", () => this.game.events.emit('zoom', -1));
    new TextButton(this, this.width / 2 - 4, this.height - 70, "+", () => this.game.events.emit('zoom', 1));
    
    this.money = this.add.text(this.width - 20, this.height - 28, '$0', { fontSize: 24 });
    this.money.setOrigin(1, 0);

    this.planted = this.add.text(this.width - 20, this.height - 90, 'Planted: 0');
    this.planted.setOrigin(1, 0);
    this.game.events.addListener('planted', value => this.planted.setText('Planted: ' + value));

    this.speed = this.add.text(this.width - 20, this.height - 70, 'Speed: ' + (1 / this.scene.get('FarmScene').physics.world.timeScale).toFixed(0));
    this.speed.setOrigin(1, 0);
    this.game.events.addListener('speedValue', value => this.speed.setText('Speed: ' + value));
    this.value = this.add.text(20, this.height - 50, 'Farm Value: $0');

    this.stats = new ToggleStats(this, this.width, this.height, this.toggleStats.bind(this));
    this.farmers = new ToggleFarmers(this, this.width, this.height, this.toggleFarmers.bind(this));
    this.farmScene = this.game.scene.getScene('FarmScene') as FarmScene;
  }

  update(time: number, delta: number): void {
    this.crop.setFrame(Crops[this.registry.get('currentCrop')].frame);
    this.gameTime.setText(Util.getDate(this.registry.get('gameTime')));
    this.money.setText('$' + Util.numberWithCommas(this.registry.get('money')));
    this.profit.setText('Profit: $' + Util.numberWithCommas(this.registry.get('profit')));
    this.value.setText('Farm Value: $' + Util.numberWithCommas(this.getFarmValue()));

    this.stats.visible = !this.isShop;
    this.farmers.visible = !this.isShop;

    if (!this.isShop) {
      this.farmers.update(time, delta);
      this.stats.update(time, delta);
    }
  }

  toggleFarmers(): void {
    this.farmers.toggle();
    this.stats.close();
  }

  toggleStats(): void {
    this.stats.toggle();
    this.farmers.close();
  }

  getFarmValue(): number {
    var value = this.farmScene.farm.plowed.size * 5;
    this.farmScene.farm.planted.entries.forEach(t => value += t.crop.revenue);

    return value;
  }

  toggleShop(): void {
    if (this.isShop) {
      this.scene.run('FarmScene');
      this.scene.run('MinimapScene');
      this.scene.sleep('ShopScene');
    } else {
      this.scene.sleep('FarmScene');
      this.scene.sleep('MinimapScene');
      this.scene.run('ShopScene');
    }
    
    this.isShop = !this.isShop;
    this.button.setText(this.isShop ? 'Back' : 'Shop');
  }
}