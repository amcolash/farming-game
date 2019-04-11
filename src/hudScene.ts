import { Crops } from './crops';
import { TextButton } from './textButton';

export class HUDScene extends Phaser.Scene {
  data: Phaser.Data.DataManager;
  isShop: boolean;

  button: TextButton;
  crop: Phaser.GameObjects.Sprite;
  money: Phaser.GameObjects.Text;
  planted: Phaser.GameObjects.Text;
  speed: Phaser.GameObjects.Text;
  
  constructor() {
    super('HUDScene');
  }

  create() {
    const width: number = Number.parseInt(this.game.config.width.toString());
    const height: number = Number.parseInt(this.game.config.height.toString());

    this.data = this.game.registry;
    this.isShop = false;

    this.add.rectangle(0, height - 50, width * 3, 100, 0x000000).setInteractive({ cursor: 'default' });
    this.button = new TextButton(this, 60, height - 50, this.isShop ? 'Back' : 'Shop', () => this.toggleShop());
    this.money = this.add.text(width - 120, height - 50, '$', { fontSize: 24 });
    this.crop = this.add.sprite(width / 2 - 8, height - 50, 'crops', Crops[this.data.get('currentCrop')].frame);
    this.crop.setScale(2);

    new TextButton(this, width / 2 - 32, height - 100, "<", () => this.game.events.emit('speed', -1));
    new TextButton(this, width / 2 - 4, height - 100, ">", () => this.game.events.emit('speed', 1));
    new TextButton(this, width / 2 - 32, height - 80, "-", () => this.game.events.emit('zoom', -1));
    new TextButton(this, width / 2 - 4, height - 80, "+", () => this.game.events.emit('zoom', 1));

    this.planted = this.add.text(width -120, height - 95, 'Planted: \nSpeed: ' + this.registry.get('speed'));
    this.game.events.addListener('planted', value => this.planted.setText('Planted: ' + value));

    this.speed = this.add.text(width - 120, height - 80, 'Speed: 1');
    this.game.events.addListener('speedValue', value => this.speed.setText('Speed: ' + value));
  }

  update(time: number, delta: number): void {
    this.money.setText('$' + this.data.get('money'));
    this.crop.setFrame(Crops[this.data.get('currentCrop')].frame);
  }

  toggleShop(): void {
    this.scene.sleep(this.isShop ? 'ShopScene' : 'FarmScene');
    this.scene.run(this.isShop ? 'FarmScene' : 'ShopScene');
    this.isShop = !this.isShop;
    this.button.setText(this.isShop ? 'Back' : 'Shop');
  }
}