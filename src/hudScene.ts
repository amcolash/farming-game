import { Crops } from './crops';
import { TextButton } from './textButton';

export class HUDScene extends Phaser.Scene {
  data: Phaser.Data.DataManager;
  isShop: boolean;

  money: Phaser.GameObjects.Text;
  button: TextButton;
  crop: Phaser.GameObjects.Sprite;
  
  constructor() {
    super('HUDScene');
  }

  preload(): void {
    this.load.spritesheet('crops', 'assets/images/crops.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    const width: number = Number.parseInt(this.game.config.width.toString());
    const height: number = Number.parseInt(this.game.config.height.toString());

    this.data = this.game.registry;
    this.isShop = false;

    this.add.rectangle(0, height - 50, width * 3, 100, 0x000000).setInteractive({ cursor: 'default' });
    this.button = new TextButton(this, 60, height - 50, this.isShop ? 'Back' : 'Shop', () => this.openShop());
    this.money = this.add.text(width - 120, height - 50, '$', { fontSize: 24 });
    this.crop = this.add.sprite(width / 2 - 8, height - 50, 'crops', Crops[this.data.get('currentCrop')].frame);
    this.crop.setScale(2);
  }

  update(time: number, delta: number): void {
    this.money.setText('$' + this.data.get('money'));
    this.crop.setFrame(Crops[this.data.get('currentCrop')].frame);
  }

  openShop(): void {
    this.scene.sleep(this.isShop ? 'ShopScene' : 'FarmScene');
    this.scene.run(this.isShop ? 'FarmScene' : 'ShopScene');
    this.isShop = !this.isShop;
    this.button.setText(this.isShop ? 'Back' : 'Shop');
  }
}