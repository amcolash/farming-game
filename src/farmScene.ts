import { Camera } from './camera';
import { Farm } from './farm';

export class FarmScene extends Phaser.Scene {
  camera: Camera;
  farm: Farm;

  constructor() {
    super('FarmScene');
  }

  preload(): void {
    this.load.spritesheet('crops', 'assets/images/crops.png', { frameWidth: 32, frameHeight: 32 });
  }
  
  create(): void {
    this.farm = new Farm(this);
    this.camera = new Camera(this, 0, 0, 'crops', 1);
  }

  update(): void {
    this.camera.update();
  }
}