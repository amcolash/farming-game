import { Crops } from './crops';
import { TextButton } from './button';

export class HUD extends Phaser.GameObjects.GameObject {
  money: Phaser.GameObjects.Text;
  button: TextButton;
  crop: Phaser.GameObjects.Sprite;
  isShop: boolean;
  
  constructor(scene: Phaser.Scene, isShop: boolean) {
    super(scene, 'hud');
    this.scene.sys.updateList.add(this);
    
    const width: number = Number.parseInt(this.scene.game.config.width.toString());
    const height: number = Number.parseInt(this.scene.game.config.height.toString());

    this.isShop = isShop;
    this.button = new TextButton(this.scene, 60, height - 50, isShop ? 'Back' : 'Shop', () => this.openShop());
    this.money = this.scene.add.text(width - 120, height - 50, '$', { fontSize: 24 });
    this.crop = this.scene.add.sprite(width / 2 - 8, height - 50, 'crops', Crops[this.scene.game.registry.get('currentCrop')].frame);
    this.crop.setScale(2);
  }

  preUpdate(time: number, delta: number): void {
    this.money.setText('$' + this.scene.game.registry.get('money'));
    this.crop.setFrame(Crops[this.scene.game.registry.get('currentCrop')].frame);
  }

  openShop(): void {
    this.scene.scene.sleep(this.isShop ? 'ShopScene' : 'FarmScene');
    this.scene.scene.run(this.isShop ? 'FarmScene' : 'ShopScene');
  }
}