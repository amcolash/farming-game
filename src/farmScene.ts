import { HUD } from './hud';
import { Farm } from './farm';

export class FarmScene extends Phaser.Scene {
  hud: HUD;
  farm: Farm;

  constructor() {
    super('FarmScene');
  }

  preload(): void {
    this.load.spritesheet('crops', 'assets/images/crops.png', { frameWidth: 32, frameHeight: 32 });
  }

  create(): void {
    this.hud = new HUD(this, false);
    this.farm = new Farm(this);
  }
}