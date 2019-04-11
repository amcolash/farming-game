import { Crops } from './crops';
import { TextButton } from './textButton';

export class HUDScene extends Phaser.Scene {
  registry: Phaser.Data.DataManager;
  isShop: boolean;

  button: TextButton;
  crop: Phaser.GameObjects.Sprite;
  life: Phaser.GameObjects.Text;
  money: Phaser.GameObjects.Text;
  planted: Phaser.GameObjects.Text;
  profit: Phaser.GameObjects.Text;
  speed: Phaser.GameObjects.Text;

  bars: Phaser.GameObjects.Rectangle[];
  
  constructor() {
    super('HUDScene');
  }

  create() {
    const width: number = Number.parseInt(this.game.config.width.toString());
    const height: number = Number.parseInt(this.game.config.height.toString());

    this.registry = this.game.registry;
    this.isShop = false;

    this.add.rectangle(0, height - 50, width * 3, 100, 0x000000).setInteractive({ cursor: 'default' });
    this.button = new TextButton(this, 60, height - 50, this.isShop ? 'Back' : 'Shop', () => this.toggleShop());
    this.money = this.add.text(width - 120, height - 50, '$0', { fontSize: 24 });
    this.life = this.add.text(20, height - 65, 'Life: 0');
    this.profit = this.add.text(20, height - 80, 'Profit: $0');
    this.crop = this.add.sprite(width / 2 - 8, height - 40, 'crops', Crops[this.registry.get('currentCrop')].frame);
    this.crop.setScale(1.75);

    new TextButton(this, width / 2 - 32, height - 100, "<", () => this.game.events.emit('speed', -1));
    new TextButton(this, width / 2 - 4, height - 100, ">", () => this.game.events.emit('speed', 1));
    new TextButton(this, width / 2 - 32, height - 80, "-", () => this.game.events.emit('zoom', -1));
    new TextButton(this, width / 2 - 4, height - 80, "+", () => this.game.events.emit('zoom', 1));

    this.planted = this.add.text(width - 120, height - 95, 'Planted: \nSpeed: ' + this.registry.get('speed'));
    this.game.events.addListener('planted', value => this.planted.setText('Planted: ' + value));

    this.speed = this.add.text(width - 120, height - 80, 'Speed: ' + (1 / this.scene.get('FarmScene').physics.world.timeScale).toFixed(0));
    this.game.events.addListener('speedValue', value => this.speed.setText('Speed: ' + value));

    this.bars = [];
    const sorted = Crops.sort((a, b) => { return a.frame - b.frame });
    for (var i = 0; i < sorted.length; i++) {
      const crop = sorted[i];
      this.add.sprite(20 + i * 32, height - 120, 'crops', crop.frame);
      const bar = this.add.rectangle(20 + i * 32, height - 170, 8, 50, 0x333333);
      bar.setAngle(180);
      this.bars.push(bar);
    }
  }

  update(time: number, delta: number): void {
    this.crop.setFrame(Crops[this.registry.get('currentCrop')].frame);
    this.life.setText('Life: ' + this.getTime(this.registry.get('life')));
    this.money.setText('$' + this.registry.get('money'));
    this.profit.setText('Profit: $' + this.registry.get('profit'));

    const stats = this.registry.get('stats');
    const total = stats.reduce((a, v) => { return a + v; });
    // console.log(stats);
    for (var i = 0; i < Crops.length; i++) {
      if (total === 0) this.bars[i].height = 3;
      else this.bars[i].height = 3 + 47 * (stats[i] / total);
    }
  }

  getTime(ms: number): string {
    const sec = ms / 1000;
    const min = sec / 60;
    const hour = min / 60;
    const day = hour / 24;

    if (sec < 60) return sec.toFixed(0) + 's';
    if (min < 60) return min.toFixed(0) + 'm';
    if (hour < 60) return hour.toFixed(1) + 'h';
    return day.toFixed(1) + 'd';
  }

  toggleShop(): void {
    this.scene.sleep(this.isShop ? 'ShopScene' : 'FarmScene');
    this.scene.run(this.isShop ? 'FarmScene' : 'ShopScene');
    this.isShop = !this.isShop;
    this.button.setText(this.isShop ? 'Back' : 'Shop');
  }
}