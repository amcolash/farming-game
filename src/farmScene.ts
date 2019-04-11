import { Camera } from './camera';
import { Farm } from './farm';
import { Farmer } from './farmer';

export class FarmScene extends Phaser.Scene {
  camera: Camera;
  farm: Farm;
  farmer: Farmer;

  constructor() {
    super('FarmScene');
  }
  
  create(): void {
    this.farm = new Farm(this);
    this.camera = new Camera(this, 0, 0);
    this.farmer = new Farmer(this, 0, 0, this.farm);

    // TODO: Figure out dancing and fighting farmers
    // const farmer1 = new Farmer(this, 350, 350, this.farm);
    // this.physics.add.collider(this.farmer, farmer1);

    this.game.events.on('speed', value => {
      const raw = Math.max((1 / this.physics.world.timeScale) + value, 1);
      this.physics.world.timeScale = 1 / raw;

      // Let HUD know final value
      this.game.events.emit('speedValue', raw);
    });
  }

  update(): void {
    this.camera.update();
    this.farmer.update();
  }
}